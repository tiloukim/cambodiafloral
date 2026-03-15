import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const DELIVERY_FEE = 5

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
      payment_method: 'stripe',
      sender_name: body.sender_name,
      sender_email: body.sender_email,
      sender_phone: body.sender_phone || null,
      sender_country: body.sender_country || null,
      recipient_name: body.recipient_name,
      recipient_phone: body.recipient_phone,
      recipient_address: body.recipient_address,
      recipient_city: body.recipient_city,
      delivery_date: body.delivery_date || null,
      card_message: body.card_message || null,
    })
    .select()
    .single()

  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

  // Create order items
  const orderItems = body.items.map((item: { product_id: string; title: string; price: number; quantity: number; image_url: string }) => ({
    order_id: order.id,
    product_id: item.product_id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image_url,
  }))

  const { error: itemsErr } = await supabase
    .from('cf_order_items')
    .insert(orderItems)

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  // Create Stripe Checkout Session
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items.map((item: { title: string; price: number; quantity: number; image_url: string }) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        images: item.image_url ? [item.image_url] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  // Add delivery fee as a line item
  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: { name: 'Delivery Fee' },
      unit_amount: DELIVERY_FEE * 100,
    },
    quantity: 1,
  })

  const origin = new URL(req.url).origin

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    customer_email: body.sender_email,
    metadata: {
      order_id: order.id,
    },
    success_url: `${origin}/checkout/success?order=${order.id}`,
    cancel_url: `${origin}/checkout?cancelled=true`,
  })

  return NextResponse.json({ url: session.url, order_id: order.id })
}
