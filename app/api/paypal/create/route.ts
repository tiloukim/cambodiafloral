import { NextResponse } from 'next/server'

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
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
    const { order_id, total } = await req.json()

    if (!order_id || !total) {
      return NextResponse.json({ error: 'Missing order_id or total' }, { status: 400 })
    }

    const accessToken = await getAccessToken()

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
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
            description: `Cambodia Floral Order #${order_id.slice(0, 8)}`,
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
            },
          },
        ],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('PayPal create order error:', data)
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('PayPal create error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
