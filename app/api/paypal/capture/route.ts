import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/notify'

function getPayPalAPI() {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  const api = getPayPalAPI()

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const res = await fetch(`${api}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${data.error_description || data.error || 'unknown'}`)
  }
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const { paypal_order_id, order_id } = await req.json()

    if (!paypal_order_id || !order_id) {
      return NextResponse.json({ error: 'Missing paypal_order_id or order_id' }, { status: 400 })
    }

    const accessToken = await getAccessToken()
    const api = getPayPalAPI()

    const res = await fetch(`${api}/v2/checkout/orders/${paypal_order_id}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await res.json()

    if (!res.ok || data.status !== 'COMPLETED') {
      console.error('[PayPal] capture error:', JSON.stringify(data))
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 500 })
    }

    // Update order in database
    const supabase = createServiceClient()
    const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
    const captureId = capture?.id

    // Read current state first so we only count a promo redemption once
    const { data: existingOrder } = await supabase
      .from('cf_orders')
      .select('*, cf_order_items(*)')
      .eq('id', order_id)
      .maybeSingle()

    // Capture can be retried by the client; everything below keyed on this
    // runs exactly once, on the transition into 'confirmed'.
    const firstConfirmation = !!existingOrder && existingOrder.status !== 'confirmed'

    await supabase
      .from('cf_orders')
      .update({
        payment_method: 'paypal',
        payment_id: captureId || paypal_order_id,
        status: 'confirmed',
      })
      .eq('id', order_id)

    // Record what PayPal actually kept, so the P&L reflects real cash.
    // Kept separate from the update above and deliberately non-fatal: if the
    // fee columns haven't been added yet the payment must still go through.
    const breakdown = capture?.seller_receivable_breakdown
    if (breakdown) {
      const num = (v: { value?: string } | undefined) =>
        v?.value !== undefined ? Number(v.value) : null
      const { error: feeErr } = await supabase
        .from('cf_orders')
        .update({
          payment_gross: num(breakdown.gross_amount),
          payment_fee: num(breakdown.paypal_fee),
          payment_net: num(breakdown.net_amount),
        })
        .eq('id', order_id)
      if (feeErr) {
        console.error('[PayPal] could not record capture fee (run supabase/payment_fees.sql):', feeErr.message)
      }
    }

    // Count the promo redemption once, on first successful payment
    if (firstConfirmation && existingOrder.promo_code) {
      const code = String(existingOrder.promo_code).toUpperCase()
      const { data: promo } = await supabase
        .from('cf_promo_codes')
        .select('id, used_count')
        .eq('code', code)
        .maybeSingle()
      if (promo) {
        await supabase
          .from('cf_promo_codes')
          .update({ used_count: (promo.used_count || 0) + 1 })
          .eq('id', promo.id)
      }
    }

    // Receipt to the customer. Awaited so it survives the serverless freeze,
    // but sendOrderConfirmation swallows its own errors — a failed email must
    // never turn a captured payment into an error response.
    if (firstConfirmation) {
      // Don't dangle a discount in front of someone who already claimed theirs.
      let rewardAvailable = true
      if (existingOrder.customer_id) {
        const { data: customer } = await supabase
          .from('cf_customers')
          .select('survey_reward_code')
          .eq('id', existingOrder.customer_id)
          .maybeSingle()
        rewardAvailable = !customer?.survey_reward_code
      }

      await sendOrderConfirmation({
        rewardAvailable,
        orderId: order_id,
        customerName: existingOrder.sender_name,
        customerEmail: existingOrder.sender_email,
        recipientName: existingOrder.recipient_name,
        recipientAddress: existingOrder.recipient_address,
        recipientCity: existingOrder.recipient_city,
        deliveryDate: existingOrder.delivery_date,
        deliveryTime: existingOrder.delivery_time,
        cardMessage: existingOrder.card_message,
        items: (existingOrder.cf_order_items || []).map((i: { sku?: string | null; title: string; quantity: number; price: number }) => ({
          sku: i.sku, title: i.title, quantity: i.quantity, price: Number(i.price),
        })),
        subtotal: Number(existingOrder.subtotal) || 0,
        discount: Number(existingOrder.discount) || 0,
        deliveryFee: Number(existingOrder.delivery_fee) || 0,
        total: Number(existingOrder.total) || 0,
        // Only ask if they didn't already tell us at checkout.
        askHowTheyFoundUs: !existingOrder.heard_from,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PayPal] capture error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Something went wrong' }, { status: 500 })
  }
}
