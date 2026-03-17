import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

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
    console.error('[PayPal] capture error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Something went wrong' }, { status: 500 })
  }
}
