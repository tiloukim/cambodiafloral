import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { sendReviewRequestEmail } from '@/lib/notify'

// Delivered only. Asking someone to review flowers that haven't arrived is
// the fastest way to get a bad review of a fine bouquet.
const ELIGIBLE = ['delivered']

/** Ask one customer to review what they bought. Admin-triggered, never automatic. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('cf_orders')
    .select('id, status, sender_name, sender_email, heard_from, review_requested_at, cf_order_items(product_id, title, image_url)')
    .eq('id', id)
    .maybeSingle()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!ELIGIBLE.includes(order.status)) {
    return NextResponse.json({
      error: `This order is "${order.status.replace(/_/g, ' ')}". Wait until it's delivered — asking for a review before the flowers arrive tends to backfire.`,
    }, { status: 400 })
  }
  if (!order.sender_email) {
    return NextResponse.json({ error: 'This order has no email address' }, { status: 400 })
  }

  // Nothing left to ask about if every product has already been reviewed.
  const { data: reviews } = await supabase
    .from('cf_reviews').select('product_id').eq('order_id', id)
    .then(r => ({ data: r.data || [] }))
  const reviewed = new Set(reviews.map(r => r.product_id))
  const items = (order.cf_order_items || []).filter(i => i.product_id && !reviewed.has(i.product_id))
  if (items.length === 0) {
    return NextResponse.json({ error: 'Every item in this order has already been reviewed' }, { status: 400 })
  }

  await sendReviewRequestEmail({
    orderId: order.id,
    customerName: order.sender_name,
    customerEmail: order.sender_email,
    items: items.map(i => ({ title: i.title, image_url: i.image_url })),
    // One email, both asks: no reason to send a second one for the survey.
    askHowTheyFoundUs: !order.heard_from,
  })

  await supabase
    .from('cf_orders')
    .update({ review_requested_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true, sentTo: order.sender_email })
}
