import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { notifyOrderAdmin } from '@/lib/notify'

const DELIVERY_FEE = 0

export async function POST(req: Request) {
  const body = await req.json()

  // Validate required fields
  if (!body.sender_name || !body.sender_email || !body.recipient_name || !body.recipient_phone || !body.recipient_address || !body.recipient_city) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 })
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
  const total = subtotal + DELIVERY_FEE

  // Create order with status 'pending'
  const { data: order, error: orderErr } = await supabase
    .from('cf_orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      subtotal,
      delivery_fee: DELIVERY_FEE,
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
