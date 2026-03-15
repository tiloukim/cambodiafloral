import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  // If webhook secret is set, verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } else {
    event = JSON.parse(body) as Stripe.Event
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id

    if (orderId) {
      const supabase = createServiceClient()

      // Update order status to confirmed and store payment ID
      await supabase
        .from('cf_orders')
        .update({
          status: 'confirmed',
          payment_id: session.payment_intent as string,
        })
        .eq('id', orderId)

      // Create notification for admin
      await supabase.from('cf_notifications').insert({
        type: 'new_order',
        title: 'New Paid Order',
        message: `Order #${orderId.slice(0, 8)} paid - $${((session.amount_total || 0) / 100).toFixed(2)}`,
        order_id: orderId,
      })
    }
  }

  return NextResponse.json({ received: true })
}
