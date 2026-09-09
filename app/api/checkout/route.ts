import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { notifyOrderAdmin } from '@/lib/notify'
import { evaluatePromo, type PromoCode } from '@/lib/promo'
import { isSourceKey } from '@/lib/attribution'
import {
  earliestDeliveryDate, formatShopDate, isPastSameDayCutoff,
  SHOP_TIME_ZONE_LABEL, SAME_DAY_CUTOFF_LABEL,
} from '@/lib/timezone'

const DELIVERY_FEE = 5
const FREE_DELIVERY_THRESHOLD = 100

export async function POST(req: Request) {
  const body = await req.json()

  // Validate required fields
  if (!body.sender_name || !body.sender_email || !body.recipient_name || !body.recipient_phone || !body.recipient_address || !body.recipient_city) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 })
  }

  // The delivery date is a Cambodia calendar date. Check it against the shop's
  // clock in Phnom Penh, not the server's (Vercel runs in UTC) or the sender's.
  // Past the 2PM cutoff the florist can no longer deliver same-day, so the
  // earliest acceptable date rolls to tomorrow.
  if (body.delivery_date) {
    const earliest = earliestDeliveryDate()
    if (String(body.delivery_date) < earliest) {
      return NextResponse.json({
        error: isPastSameDayCutoff()
          ? `Same-day orders close at ${SAME_DAY_CUTOFF_LABEL} ${SHOP_TIME_ZONE_LABEL}. The earliest delivery date is now ${formatShopDate(earliest)}.`
          : `That delivery date has already passed in Cambodia. The earliest delivery date is ${formatShopDate(earliest)} (${SHOP_TIME_ZONE_LABEL}).`,
      }, { status: 400 })
    }
  }

  const supabase = createServiceClient()

  // Find or create customer
  let customerId: string
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (user) {
    const { data: existing } = await supabase
      .from('cf_customers')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle()

    if (existing) {
      customerId = existing.id
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from('cf_customers')
        .insert({
          auth_id: user.id,
          email: body.sender_email,
          name: body.sender_name,
          phone: body.sender_phone || null,
          country: body.sender_country || null,
        })
        .select('id')
        .single()

      if (custErr) return NextResponse.json({ error: custErr.message }, { status: 500 })
      customerId = newCustomer.id
    }
  } else {
    const { data: existing } = await supabase
      .from('cf_customers')
      .select('id')
      .eq('email', body.sender_email)
      .maybeSingle()

    if (existing) {
      customerId = existing.id
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from('cf_customers')
        .insert({
          email: body.sender_email,
          name: body.sender_name,
          phone: body.sender_phone || null,
          country: body.sender_country || null,
        })
        .select('id')
        .single()

      if (custErr) return NextResponse.json({ error: custErr.message }, { status: 500 })
      customerId = newCustomer.id
    }
  }

  // Calculate totals
  const subtotal = body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)
  let deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE

  // Apply promo code (authoritative server-side check)
  let discount = 0
  let appliedCode: string | null = null
  if (body.promo_code) {
    const code = String(body.promo_code).trim().toUpperCase()
    const { data: promo } = await supabase
      .from('cf_promo_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle()
    const result = evaluatePromo(promo as PromoCode | null, subtotal, deliveryFee)
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Invalid promo code' }, { status: 400 })
    }
    // First-time-customer codes: reject if this customer already has a paid order
    if (promo?.first_order_only) {
      const { count } = await supabase
        .from('cf_orders')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customerId)
        .eq('status', 'confirmed')
      if ((count || 0) > 0) {
        return NextResponse.json({ error: 'This code is for first-time customers only' }, { status: 400 })
      }
    }
    discount = result.discount
    if (result.freeDelivery) deliveryFee = 0
    appliedCode = code
  }

  const total = Math.max(0, subtotal - discount + deliveryFee)

  // Create order with status 'pending'
  const { data: order, error: orderErr } = await supabase
    .from('cf_orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      subtotal,
      discount,
      promo_code: appliedCode,
      delivery_fee: deliveryFee,
      total,
      payment_method: 'paypal',
      sender_name: body.sender_name,
      sender_email: body.sender_email,
      sender_phone: body.sender_phone || null,
      recipient_name: body.recipient_name,
      recipient_phone: body.recipient_phone,
      recipient_address: body.recipient_address,
      recipient_city: body.recipient_city,
      delivery_date: body.delivery_date || null,
      delivery_time: body.delivery_time || null,
      card_message: body.card_message || null,
    })
    .select()
    .single()

  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

  // "How did you hear about us?" — written separately and non-fatally so a
  // missing column (migration not yet run) can never fail a real order.
  if (isSourceKey(body.heard_from)) {
    const { error: heardErr } = await supabase
      .from('cf_orders')
      .update({
        heard_from: body.heard_from,
        heard_from_detail: body.heard_from === 'other'
          ? String(body.heard_from_detail || '').slice(0, 200) || null
          : null,
        heard_from_at: new Date().toISOString(),
      })
      .eq('id', order.id)
    if (heardErr) {
      console.error('[checkout] could not record attribution (run supabase/attribution.sql):', heardErr.message)
    }
  }

  // Create order items
  const orderItems = body.items.map((item: { product_id: string; sku?: string; title: string; price: number; quantity: number; image_url: string }) => ({
    order_id: order.id,
    product_id: item.product_id,
    sku: item.sku || null,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image_url,
  }))

  const { error: itemsErr } = await supabase
    .from('cf_order_items')
    .insert(orderItems)

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  // Send email + Telegram alert for new order
  await notifyOrderAdmin({
    orderId: order.id,
    senderName: body.sender_name,
    senderEmail: body.sender_email,
    senderPhone: body.sender_phone,
    recipientName: body.recipient_name,
    recipientPhone: body.recipient_phone,
    recipientAddress: body.recipient_address,
    recipientCity: body.recipient_city,
    total,
    items: body.items.map((i: { sku?: string; title: string; quantity: number }) => ({
      sku: i.sku,
      title: i.title,
      quantity: i.quantity,
    })),
    deliveryDate: body.delivery_date,
    deliveryTime: body.delivery_time,
    deliveryNotes: body.delivery_notes,
    cardMessage: body.card_message,
    type: 'new_order',
  })

  return NextResponse.json({ order_id: order.id, total })
}
