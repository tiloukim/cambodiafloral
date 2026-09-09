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

  // Public: the latest approved reviews across every product, for the strip
  // that sits above the footer sitewide.
  if (searchParams.get('all') === '1') {
    const limit = Math.min(Number(searchParams.get('limit')) || 8, 24)
    const { data, error } = await supabase
      .from('cf_reviews')
      .select('id, author_name, rating, title, body, created_at, product_id, cf_products!inner(title, is_active)')
      // Only products a visitor can actually open. A review card linking to a
      // hidden product is a dead end dressed up as social proof.
      .eq('approved', true)
      .eq('cf_products.is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const reviews = (data || []).map(r => ({
      id: r.id,
      author_name: r.author_name,
      rating: r.rating,
      title: r.title,
      body: r.body,
      created_at: r.created_at,
      product_id: r.product_id,
      product_title: (r.cf_products as { title?: string } | null)?.title || null,
    }))

    // Identical for every visitor, so let the CDN serve it.
    return NextResponse.json({ reviews }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
    })
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
      // Pending until an admin approves. Customer words don't go live —
      // or into the aggregateRating rich result — unread.
      approved: false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // Could be their own earlier review, or feedback the shop published on
      // their behalf. Saying "you already reviewed this" for the second case
      // is simply untrue.
      const { data: existing } = await supabase
        .from('cf_reviews')
        .select('body')
        .eq('order_id', orderId)
        .eq('product_id', productId)
        .maybeSingle()
      const { data: fb } = await supabase
        .from('cf_orders')
        .select('feedback_comment')
        .eq('id', orderId)
        .maybeSingle()
      const fromFeedback = Boolean(fb?.feedback_comment && existing?.body === fb.feedback_comment)
      return NextResponse.json({
        error: fromFeedback
          ? 'Your feedback for this item is already on our site — thank you!'
          : 'You have already reviewed this item',
      }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
