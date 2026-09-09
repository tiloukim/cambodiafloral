import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

// Turns a customer's private order feedback into a public product review.
// Admin-only, and refuses unless the customer consented — approval alone is
// not permission to publish words someone wrote expecting privacy.
export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id, product_id } = await req.json()
  if (!order_id || !product_id) {
    return NextResponse.json({ error: 'Missing order or product' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('cf_orders')
    .select('id, customer_id, sender_name, feedback_rating, feedback_comment, feedback_consent')
    .eq('id', order_id)
    .maybeSingle()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!order.feedback_consent) {
    return NextResponse.json({ error: 'This customer did not agree to have their feedback shared' }, { status: 403 })
  }
  if (!order.feedback_rating) {
    return NextResponse.json({ error: 'This order has no rating to publish' }, { status: 400 })
  }

  const { data: item } = await supabase
    .from('cf_order_items')
    .select('id')
    .eq('order_id', order_id)
    .eq('product_id', product_id)
    .maybeSingle()
  if (!item) {
    return NextResponse.json({ error: 'That product was not part of this order' }, { status: 400 })
  }

  // approved: true — an admin is publishing it deliberately, right now.
  const { data, error } = await supabase
    .from('cf_reviews')
    .insert({
      product_id,
      order_id,
      customer_id: order.customer_id,
      // The consent checkbox promises "with my first name" — publish exactly
      // that, not the full name they gave for delivery.
      author_name: (order.sender_name || '').trim().split(/\s+/)[0] || 'Verified buyer',
      rating: order.feedback_rating,
      body: order.feedback_comment,
      approved: true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'This feedback is already published for that product' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
