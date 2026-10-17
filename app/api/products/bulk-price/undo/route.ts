import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

/** Put every price back exactly as it was before a bulk change. */
export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { adjustment_id } = await req.json().catch(() => ({ adjustment_id: null }))
  const supabase = createServiceClient()

  let query = supabase.from('cf_price_adjustments').select('*').is('undone_at', null)
  query = adjustment_id ? query.eq('id', adjustment_id) : query.order('created_at', { ascending: false }).limit(1)

  const { data: rows } = await query
  const adjustment = rows?.[0]
  if (!adjustment) return NextResponse.json({ error: 'No bulk price change to undo' }, { status: 404 })

  const snapshot = adjustment.snapshot as { id: string; price: number; compare_price: number | null }[]
  let restored = 0
  for (const s of snapshot) {
    const { error } = await supabase
      .from('cf_products')
      .update({ price: s.price, compare_price: s.compare_price })
      .eq('id', s.id)
    if (!error) restored++
  }

  await supabase.from('cf_price_adjustments')
    .update({ undone_at: new Date().toISOString() })
    .eq('id', adjustment.id)

  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true, restored, description: adjustment.description })
}
