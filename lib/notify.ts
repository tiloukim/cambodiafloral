function getEnv() {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  }
}

interface OrderNotification {
  orderId: string
  senderName: string
  senderEmail: string
  senderPhone?: string
  recipientName: string
  recipientPhone?: string
  recipientAddress?: string
  recipientCity: string
  total: number
  items: { sku?: string; title: string; quantity: number }[]
  deliveryDate?: string
  deliveryTime?: string
  deliveryNotes?: string
  cardMessage?: string
  type: 'new_order' | 'payment_confirmed'
}

interface MessageNotification {
  customerName: string
  customerEmail: string
  message: string
}

function formatOrderText(data: OrderNotification): string {
  const itemsList = data.items
    .map(i => `  ${i.sku ? `[${i.sku}] ` : ''}${i.title} x${i.quantity}`)
    .join('\n')

  const label = data.type === 'payment_confirmed' ? 'Payment Confirmed' : 'New Order'

  return [
    `${label} - #${data.orderId.slice(0, 8)}`,
    '',
    `From: ${data.senderName} (${data.senderEmail})`,
    data.senderPhone ? `Phone: ${data.senderPhone}` : '',
    '',
    'Deliver To:',
    `Name: ${data.recipientName}`,
    data.recipientAddress ? `Address: ${data.recipientAddress}, ${data.recipientCity}` : `City: ${data.recipientCity}`,
    data.recipientPhone ? `Phone: ${data.recipientPhone}` : '',
    data.deliveryDate ? `Date: ${data.deliveryDate}` : '',
    data.deliveryTime ? `Time: ${data.deliveryTime}` : '',
    data.deliveryNotes ? `Note: ${data.deliveryNotes}` : '',
    '',
    `Total: $${data.total.toFixed(2)}`,
    '',
    'Items:',
    itemsList,
    data.cardMessage ? `\nCard Message: "${data.cardMessage}"` : '',
  ].filter(Boolean).join('\n')
}

function formatOrderHTML(data: OrderNotification): string {
  const label = data.type === 'payment_confirmed' ? 'Payment Confirmed' : 'New Order'
  const itemsHTML = data.items
    .map(i => `<li>${i.sku ? `<code>[${i.sku}]</code> ` : ''}${i.title} x${i.quantity}</li>`)
    .join('')

  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
      <h2 style="color:#EC4899;margin:0 0 16px;">${label} - #${data.orderId.slice(0, 8)}</h2>
      <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Sender</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#888;width:100px;">Name</td><td style="padding:6px 0;font-weight:600;">${data.senderName}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${data.senderEmail}</td></tr>
        ${data.senderPhone ? `<tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${data.senderPhone}</td></tr>` : ''}
      </table>
      <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Deliver To</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#888;width:100px;">Name</td><td style="padding:6px 0;font-weight:600;">${data.recipientName}</td></tr>
        ${data.recipientPhone ? `<tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${data.recipientPhone}</td></tr>` : ''}
        ${data.recipientAddress ? `<tr><td style="padding:6px 0;color:#888;">Address</td><td style="padding:6px 0;">${data.recipientAddress}, ${data.recipientCity}</td></tr>` : `<tr><td style="padding:6px 0;color:#888;">City</td><td style="padding:6px 0;">${data.recipientCity}</td></tr>`}
        ${data.deliveryDate ? `<tr><td style="padding:6px 0;color:#888;">Date</td><td style="padding:6px 0;">${data.deliveryDate}</td></tr>` : ''}
        ${data.deliveryTime ? `<tr><td style="padding:6px 0;color:#888;">Time</td><td style="padding:6px 0;">${data.deliveryTime}</td></tr>` : ''}
        ${data.deliveryNotes ? `<tr><td style="padding:6px 0;color:#888;">Note</td><td style="padding:6px 0;">${data.deliveryNotes}</td></tr>` : ''}
      </table>
      <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Order</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#888;width:100px;">Total</td><td style="padding:6px 0;font-weight:700;color:#10B981;">$${data.total.toFixed(2)}</td></tr>
        ${data.cardMessage ? `<tr><td style="padding:6px 0;color:#888;">Card Message</td><td style="padding:6px 0;font-style:italic;">"${data.cardMessage}"</td></tr>` : ''}
      </table>
      <h3 style="margin:16px 0 8px;font-size:14px;color:#888;">Items</h3>
      <ul style="margin:0;padding-left:20px;font-size:14px;">${itemsHTML}</ul>
    </div>
  `
}

async function sendEmail(subject: string, html: string) {
  const { RESEND_API_KEY, ADMIN_EMAIL } = getEnv()
  console.log('[notify] sendEmail called, has API key:', !!RESEND_API_KEY, 'has admin email:', !!ADMIN_EMAIL)
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Cambodia Floral <noreply@cambodiafloral.com>',
        to: [ADMIN_EMAIL, ...(process.env.ADMIN_EMAIL_2 ? [process.env.ADMIN_EMAIL_2] : [])],
        subject,
        html,
      }),
    })
    const result = await res.json()
    console.log('[notify] Email response:', res.status, JSON.stringify(result))
  } catch (err) {
    console.error('[notify] Email notification failed:', err)
  }
}

async function sendTelegram(text: string) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = getEnv()
  console.log('[notify] sendTelegram called, has token:', !!TELEGRAM_BOT_TOKEN, 'has chat ID:', !!TELEGRAM_CHAT_ID)
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    })
    const result = await res.json()
    console.log('[notify] Telegram response:', res.status, JSON.stringify(result))
  } catch (err) {
    console.error('[notify] Telegram notification failed:', err)
  }
}

export async function notifyOrderAdmin(data: OrderNotification) {
  const label = data.type === 'payment_confirmed' ? 'Payment Confirmed' : 'New Order'
  const subject = `${label} #${data.orderId.slice(0, 8)} - $${data.total.toFixed(2)}`

  await Promise.all([
    sendEmail(subject, formatOrderHTML(data)),
    sendTelegram(formatOrderText(data)),
  ])
}

export async function notifyMessageAdmin(data: MessageNotification) {
  const subject = `New Message from ${data.customerName}`
  const html = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
      <h2 style="color:#EC4899;margin:0 0 16px;">New Customer Message</h2>
      <p><strong>${data.customerName}</strong> (${data.customerEmail})</p>
      <blockquote style="border-left:3px solid #EC4899;padding:8px 12px;margin:12px 0;background:#FFF0F5;">${data.message}</blockquote>
    </div>
  `
  const text = `New Message\n\nFrom: ${data.customerName} (${data.customerEmail})\n\n"${data.message}"`

  await Promise.all([
    sendEmail(subject, html),
    sendTelegram(text),
  ])
}
