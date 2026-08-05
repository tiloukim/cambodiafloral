import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const supabase = createServiceClient()

  // Admin: list every review (any product, incl. hidden)
  if (searchParams.get('admin') === '1') {
    if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data, error } = await supabase
      .from('cf_reviews')
      .select('*, cf_products(title)')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // Public: approved reviews + aggregate for one product
  const productId = searchParams.get('product_id')
  if (!productId) return NextResponse.json({ error: 'product_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('cf_reviews')
    .select('id, author_name, rating, title, body, created_at')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const reviews = data || []
  const count = reviews.length
  const average = count ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0
  return NextResponse.json({ reviews, count, average })
}

export async function POST(req: Request) {
  const body = await req.json()
  const orderId = String(body.order_id || '')
  const productId = String(body.product_id || '')
  const rating = Math.round(Number(body.rating))
  const title = body.title ? String(body.title).slice(0, 120) : null
  const text = body.body ? String(body.body).slice(0, 2000) : null
  const authorName = body.author_name ? String(body.author_name).slice(0, 80) : null

  if (!orderId || !productId) return NextResponse.json({ error: 'Missing order or product' }, { status: 400 })
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })

  const supabase = createServiceClient()

  // Verify the order is real + paid (verified purchase)
  const { data: order } = await supabase
    .from('cf_orders')
    .select('id, status, customer_id, sender_name')
    .eq('id', orderId)
    .maybeSingle()
  if (!order || !['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status)) {
    return NextResponse.json({ error: 'This order is not eligible for a review' }, { status: 400 })
  }

  // Verify the product was actually in that order
  const { data: item } = await supabase
    .from('cf_order_items')
    .select('id')
    .eq('order_id', orderId)
    .eq('product_id', productId)
    .maybeSingle()
  if (!item) return NextResponse.json({ error: 'That product was not part of this order' }, { status: 400 })

  const { data, error } = await supabase
    .from('cf_reviews')
    .insert({
      product_id: productId,
      order_id: orderId,
      customer_id: order.customer_id,
      author_name: authorName || order.sender_name || 'Verified buyer',
      rating,
      title,
      body: text,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'You have already reviewed this item' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
