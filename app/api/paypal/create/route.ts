import { NextResponse } from 'next/server'

function getPayPalAPI() {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  const api = getPayPalAPI()
  console.log('[PayPal] getAccessToken - has clientId:', !!clientId, 'has secret:', !!secret, 'mode:', process.env.PAYPAL_MODE, 'API:', api)

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
  console.log('[PayPal] token response status:', res.status, 'has token:', !!data.access_token)
  if (!res.ok) {
    console.error('[PayPal] token error:', JSON.stringify(data))
    throw new Error(`PayPal auth failed: ${data.error_description || data.error || 'unknown'}`)
  }
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const { order_id, total } = await req.json()

    console.log('[PayPal] create order - order_id:', order_id, 'total:', total, 'type:', typeof total)

    if (!order_id || total === undefined || total === null) {
      return NextResponse.json({ error: 'Missing order_id or total' }, { status: 400 })
    }

    const accessToken = await getAccessToken()
    const api = getPayPalAPI()

    const res = await fetch(`${api}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: order_id,
            description: `Cambodia Floral Order`,
            amount: {
              currency_code: 'USD',
              value: String(parseFloat(Number(total).toFixed(2))),
            },
          },
        ],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[PayPal] create order error:', JSON.stringify(data))
      return NextResponse.json({ error: `PayPal error: ${JSON.stringify(data)}` }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('[PayPal] create error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Something went wrong' }, { status: 500 })
  }
}
