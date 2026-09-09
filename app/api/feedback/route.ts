import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Records the customer's rating and comment for one order. Public for the same
// reason the survey endpoint is: it's reached from a one-click link in an email
// where there's no session. It writes only these three columns on an order the
// caller already knows the id of.
export async function POST(req: Request) {
  let body: { order_id?: string; rating?: number; comment?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { order_id, rating, comment } = body
  const hasRating = rating !== undefined && rating !== null
  const hasComment = typeof comment === 'string' && comment.trim().length > 0

  if (!order_id || (!hasRating && !hasComment)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (hasRating && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('cf_orders')
    .select('id')
    .eq('id', order_id)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Only overwrite what was actually sent: a rating arrives from the email's
  // one-click star, the comment follows from the page a moment later.
  const updates: Record<string, unknown> = { feedback_at: new Date().toISOString() }
  if (hasRating) updates.feedback_rating = rating
  if (hasComment) updates.feedback_comment = comment.trim().slice(0, 1000)

  const { error } = await supabase.from('cf_orders').update(updates).eq('id', order_id)

  if (error) {
    console.error('[feedback] could not record (run supabase/feedback.sql):', error.message)
    return NextResponse.json({ error: 'Could not save your feedback' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
