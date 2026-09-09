import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isSourceKey, sourceLabel } from '@/lib/attribution'

// Records "how did you hear about us?" for one order. Public on purpose: the
// answer arrives from a one-click link in the confirmation email, where the
// customer has no session. It can only ever write these three columns on an
// order the caller already knows the id of, and it won't overwrite an existing
// answer, so a leaked link can't be used to flip the data.
export async function POST(req: Request) {
  let body: { order_id?: string; source?: string; detail?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { order_id, source, detail } = body

  if (!order_id || !isSourceKey(source)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('cf_orders')
    .select('id, heard_from')
    .eq('id', order_id)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('cf_orders')
    .update({
      heard_from: source,
      heard_from_detail: source === 'other' ? (detail || '').slice(0, 200) || null : null,
      heard_from_at: new Date().toISOString(),
    })
    .eq('id', order_id)

  if (error) {
    console.error('[survey] could not record answer (run supabase/attribution.sql):', error.message)
    return NextResponse.json({ error: 'Could not save your answer' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, label: sourceLabel(source, detail) })
}
