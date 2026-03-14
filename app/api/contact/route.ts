import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, captchaToken } = await req.json()

    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify Turnstile CAPTCHA
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: captchaToken,
      }),
    })

    const verify = await verifyRes.json()
    if (!verify.success) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 403 })
    }

    // TODO: Send email, save to DB, etc.
    // For now, just return success
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
