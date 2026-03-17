import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const PAYPAL_API = process.env.PAYPAL_SECRET?.startsWith('live')
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const { paypal_order_id, order_id } = await req.json()

    if (!paypal_order_id || !order_id) {
      return NextResponse.json({ error: 'Missing paypal_order_id or order_id' }, { status: 400 })
    }

    const accessToken = await getAccessToken()

    // Capture the PayPal order
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paypal_order_id}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await res.json()

    if (!res.ok || data.status !== 'COMPLETED') {
      console.error('PayPal capture error:', data)
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 500 })
    }

    // Update order in database with PayPal payment info
    const supabase = createServiceClient()
    const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id

    await supabase
      .from('cf_orders')
      .update({
        payment_method: 'paypal',
        payment_id: captureId || paypal_order_id,
        status: 'confirmed',
      })
      .eq('id', order_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PayPal capture error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
