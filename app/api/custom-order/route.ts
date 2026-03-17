import { NextRequest, NextResponse } from 'next/server'

function getEnv() {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone,
      event_type, event_date, arrangement_type,
      flower_preference, color_preference, budget,
      quantity, description,
      recipient_name, recipient_phone,
      delivery_address, delivery_city, delivery_time,
      reference_images,
    } = body

    if (!name || !email || !event_type || !arrangement_type || !budget || !description) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
    }

    // Build notification content
    const colors = (color_preference as string[])?.join(', ') || 'Not specified'
    const images = (reference_images as string[])?.length || 0

    const text = [
      '💐 New Custom Order Request',
      '',
      `From: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      '',
      '--- Order Details ---',
      `Event: ${event_type}`,
      event_date ? `Date: ${event_date}` : '',
      `Type: ${arrangement_type}`,
      `Quantity: ${quantity || 1}`,
      flower_preference ? `Flowers: ${flower_preference}` : '',
      `Colors: ${colors}`,
      `Budget: ${budget}`,
      '',
      `Description: ${description}`,
      images > 0 ? `Reference Images: ${images} attached` : '',
      '',
      recipient_name ? '--- Delivery ---' : '',
      recipient_name ? `Recipient: ${recipient_name}` : '',
      recipient_phone ? `Phone: ${recipient_phone}` : '',
      delivery_address ? `Address: ${delivery_address}` : '',
      delivery_city ? `City: ${delivery_city}` : '',
      delivery_time ? `Time: ${delivery_time}` : '',
    ].filter(Boolean).join('\n')

    const imagesHTML = (reference_images as string[])?.length > 0
      ? `<h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Reference Images</h3>
         <div style="display:flex;gap:8px;flex-wrap:wrap;">
           ${(reference_images as string[]).map((url: string) => `<img src="${url}" style="width:100px;height:100px;object-fit:cover;border-radius:8px;" />`).join('')}
         </div>`
      : ''

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#EC4899;margin:0 0 16px;">💐 New Custom Order Request</h2>

        <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Contact</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${email}</td></tr>
          ${phone ? `<tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${phone}</td></tr>` : ''}
        </table>

        <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Order Details</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Event</td><td style="padding:6px 0;font-weight:600;">${event_type}</td></tr>
          ${event_date ? `<tr><td style="padding:6px 0;color:#888;">Event Date</td><td style="padding:6px 0;">${event_date}</td></tr>` : ''}
          <tr><td style="padding:6px 0;color:#888;">Type</td><td style="padding:6px 0;">${arrangement_type}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Quantity</td><td style="padding:6px 0;">${quantity || 1}</td></tr>
          ${flower_preference ? `<tr><td style="padding:6px 0;color:#888;">Flowers</td><td style="padding:6px 0;">${flower_preference}</td></tr>` : ''}
          <tr><td style="padding:6px 0;color:#888;">Colors</td><td style="padding:6px 0;">${colors}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Budget</td><td style="padding:6px 0;font-weight:700;color:#10B981;">${budget}</td></tr>
        </table>

        <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Description</h3>
        <blockquote style="border-left:3px solid #EC4899;padding:8px 12px;margin:0;background:#FFF0F5;font-size:14px;">${description}</blockquote>

        ${recipient_name ? `
        <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Delivery</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Recipient</td><td style="padding:6px 0;">${recipient_name}</td></tr>
          ${recipient_phone ? `<tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${recipient_phone}</td></tr>` : ''}
          ${delivery_address ? `<tr><td style="padding:6px 0;color:#888;">Address</td><td style="padding:6px 0;">${delivery_address}</td></tr>` : ''}
          ${delivery_city ? `<tr><td style="padding:6px 0;color:#888;">City</td><td style="padding:6px 0;">${delivery_city}</td></tr>` : ''}
          ${delivery_time ? `<tr><td style="padding:6px 0;color:#888;">Time</td><td style="padding:6px 0;">${delivery_time}</td></tr>` : ''}
        </table>
        ` : ''}

        ${imagesHTML}
      </div>
    `

    // Send notifications
    const { RESEND_API_KEY, ADMIN_EMAIL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = getEnv()

    const promises: Promise<unknown>[] = []

    if (RESEND_API_KEY && ADMIN_EMAIL) {
      promises.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Cambodia Floral <noreply@cambodiafloral.com>',
            to: [ADMIN_EMAIL, ...(process.env.ADMIN_EMAIL_2 ? [process.env.ADMIN_EMAIL_2] : [])],
            subject: `Custom Order Request - ${event_type} - ${arrangement_type} (${budget})`,
            html,
          }),
        }).catch(err => console.error('[custom-order] Email failed:', err))
      )
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      promises.push(
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
          }),
        }).catch(err => console.error('[custom-order] Telegram failed:', err))
      )
    }

    await Promise.all(promises)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
