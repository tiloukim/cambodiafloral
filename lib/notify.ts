import { formatShopDate, shopDateKey, SHOP_TIME_ZONE_LABEL } from '@/lib/timezone'
import { SOURCES } from '@/lib/attribution'
import { REWARD_PERCENT, REWARD_VALID_DAYS } from '@/lib/rewards'

const SITE_URL = 'https://cambodiafloral.com'

/** Email bodies interpolate customer-supplied text, so escape it. */
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

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
    data.deliveryDate ? `Date: ${formatShopDate(data.deliveryDate)} (${SHOP_TIME_ZONE_LABEL})` : '',
    data.deliveryTime ? `Time: ${data.deliveryTime} (${SHOP_TIME_ZONE_LABEL})` : '',
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
        ${data.deliveryDate ? `<tr><td style="padding:6px 0;color:#888;">Date</td><td style="padding:6px 0;">${formatShopDate(data.deliveryDate)} <span style="color:#888;">(${SHOP_TIME_ZONE_LABEL})</span></td></tr>` : ''}
        ${data.deliveryTime ? `<tr><td style="padding:6px 0;color:#888;">Time</td><td style="padding:6px 0;">${data.deliveryTime} <span style="color:#888;">(${SHOP_TIME_ZONE_LABEL})</span></td></tr>` : ''}
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

async function sendEmail(subject: string, html: string, replyTo?: string) {
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
        from: 'Cambodia Floral <orders@cambodiafloral.com>',
        to: [ADMIN_EMAIL, ...(process.env.ADMIN_EMAIL_2 ? [process.env.ADMIN_EMAIL_2] : []), 'orders@cambodiafloral.com'],
        ...(replyTo ? { reply_to: replyTo } : {}),
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
    sendEmail(subject, formatOrderHTML(data), data.senderEmail),
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
    sendEmail(subject, html, data.customerEmail),
    sendTelegram(text),
  ])
}

export interface CustomerConfirmation {
  orderId: string
  customerName: string
  customerEmail: string
  recipientName: string
  recipientAddress?: string
  recipientCity: string
  deliveryDate?: string
  deliveryTime?: string
  cardMessage?: string
  items: { sku?: string | null; title: string; quantity: number; price: number }[]
  subtotal: number
  discount?: number
  deliveryFee: number
  total: number
  askHowTheyFoundUs: boolean
  /** False when this customer has already claimed the survey reward. */
  rewardAvailable?: boolean
}

export function confirmationHTML(d: CustomerConfirmation): string {
  const short = d.orderId.slice(0, 8)
  const row = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:7px 0;color:#9C7A8E;font-size:13px;">${label}</td>
      <td style="padding:7px 0;text-align:right;font-size:13px;${strong ? 'font-weight:700;color:#4A3040;' : 'color:#4A3040;'}">${value}</td>
    </tr>`

  const itemRows = d.items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #FFE4EF;">
        <div style="font-size:14px;font-weight:600;color:#4A3040;">${esc(i.title)}</div>
        <div style="font-size:12px;color:#9C7A8E;">
          ${i.sku ? `Item # <span style="font-family:monospace;color:#EC4899;font-weight:700;">${esc(i.sku)}</span> &middot; ` : ''}Qty ${i.quantity}
        </div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #FFE4EF;text-align:right;font-size:14px;font-weight:600;color:#4A3040;white-space:nowrap;">
        $${(i.price * i.quantity).toFixed(2)}
      </td>
    </tr>`).join('')

  // One-click attribution: each button records the answer and lands on a
  // thank-you page, so the customer never has to fill in a form.
  const surveyHTML = d.askHowTheyFoundUs
    ? surveyButtons(d.orderId, d.rewardAvailable !== false)
    : ''

  return `
  <div style="background:#FFF5F9;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #FFE4EF;">
      <div style="background:linear-gradient(135deg,#FFF0F5,#FFE4EF);padding:28px 24px;text-align:center;">
        <div style="font-size:13px;font-weight:700;color:#EC4899;letter-spacing:1px;text-transform:uppercase;">Cambodia Floral</div>
        <h1 style="margin:10px 0 4px;font-size:24px;color:#4A3040;">Thank you, ${esc(d.customerName)}!</h1>
        <p style="margin:0;font-size:14px;color:#7A5A6A;">Your order is confirmed and we're getting it ready.</p>
      </div>

      <div style="padding:24px;">
        <div style="text-align:center;margin-bottom:22px;">
          <div style="font-size:12px;color:#9C7A8E;text-transform:uppercase;letter-spacing:.5px;">Order number</div>
          <div style="font-size:20px;font-weight:800;color:#EC4899;font-family:monospace;">#${short}</div>
        </div>

        <h3 style="font-size:13px;color:#9C7A8E;text-transform:uppercase;letter-spacing:.5px;margin:0 0 6px;">Your order</h3>
        <table style="width:100%;border-collapse:collapse;">${itemRows}</table>

        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          ${row('Subtotal', '$' + d.subtotal.toFixed(2))}
          ${d.discount && d.discount > 0 ? row('Discount', '-$' + d.discount.toFixed(2)) : ''}
          ${row('Delivery', d.deliveryFee > 0 ? '$' + d.deliveryFee.toFixed(2) : 'Free')}
          ${row('Total paid', '$' + d.total.toFixed(2), true)}
        </table>

        <h3 style="font-size:13px;color:#9C7A8E;text-transform:uppercase;letter-spacing:.5px;margin:24px 0 6px;">Delivering to</h3>
        <div style="font-size:14px;color:#4A3040;font-weight:600;">${esc(d.recipientName)}</div>
        <div style="font-size:13px;color:#7A5A6A;line-height:1.6;">
          ${d.recipientAddress ? esc(d.recipientAddress) + '<br />' : ''}${esc(d.recipientCity)}
        </div>
        ${d.deliveryDate ? `<div style="margin-top:10px;font-size:14px;color:#EC4899;font-weight:700;">
          &#128197; ${formatShopDate(d.deliveryDate)}${d.deliveryTime ? ' &middot; ' + esc(d.deliveryTime) : ''}
          <span style="font-weight:500;color:#9C7A8E;font-size:12px;">(${SHOP_TIME_ZONE_LABEL})</span>
        </div>` : ''}

        ${d.cardMessage ? `<h3 style="font-size:13px;color:#9C7A8E;text-transform:uppercase;letter-spacing:.5px;margin:24px 0 6px;">Your card message</h3>
        <div style="background:#FFF0F5;border-radius:10px;padding:12px 16px;font-size:14px;color:#7A5A6A;font-style:italic;">&ldquo;${esc(d.cardMessage)}&rdquo;</div>` : ''}

        <div style="text-align:center;margin:26px 0 6px;">
          <a href="${SITE_URL}/track?order=${encodeURIComponent(d.orderId)}" style="display:inline-block;background:#EC4899;color:#fff;text-decoration:none;padding:13px 30px;border-radius:50px;font-size:15px;font-weight:700;">Track your order</a>
        </div>

        ${surveyHTML}
      </div>

      <div style="background:#FFF8FC;padding:18px 24px;text-align:center;border-top:1px solid #FFE4EF;">
        <p style="margin:0 0 6px;font-size:12px;color:#9C7A8E;line-height:1.6;">
          Questions? Just reply to this email &mdash; it reaches us directly.
        </p>
        <p style="margin:0;font-size:11px;color:#C9A0B4;">Cambodia Floral &middot; Phnom Penh, Cambodia</p>
      </div>
    </div>
  </div>`
}

/**
 * Send one email to a customer. Never throws — customer mail is a courtesy on
 * top of an already-completed action (a captured payment, a delivered order),
 * and must never be able to fail it.
 */
async function sendCustomerEmail(to: string, subject: string, html: string, kind: string) {
  const { RESEND_API_KEY } = getEnv()
  if (!RESEND_API_KEY) {
    console.log(`[notify] no RESEND_API_KEY, skipping customer ${kind} email`)
    return
  }
  if (!to) return

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Cambodia Floral <orders@cambodiafloral.com>',
        to: [to],
        reply_to: 'orders@cambodiafloral.com',
        subject,
        html,
      }),
    })
    const result = await res.json()
    console.log(`[notify] customer ${kind} email:`, res.status, JSON.stringify(result))
  } catch (err) {
    console.error(`[notify] customer ${kind} email failed:`, err)
  }
}

/** Order confirmation to the customer, sent once payment is captured. Never throws. */
export async function sendOrderConfirmation(d: CustomerConfirmation) {
  await sendCustomerEmail(
    d.customerEmail,
    `Order confirmed #${d.orderId.slice(0, 8)} — thank you! 🌸`,
    confirmationHTML(d),
    'confirmation',
  )
}

/** The reward code, shown the same way in every email that carries it. */
function rewardBlock(code: string, expiresAt?: string): string {
  const expiry = expiresAt
    ? formatShopDate(expiresAt.slice(0, 10))
    : `${REWARD_VALID_DAYS} days from today`
  return `
    <div style="background:linear-gradient(135deg,#FFF0F5,#FFE4EF);border:1px solid #FFD6E8;border-radius:14px;padding:22px 20px;margin:24px 0;text-align:center;">
      <div style="font-size:13px;font-weight:700;color:#EC4899;text-transform:uppercase;letter-spacing:1px;">Your thank-you gift</div>
      <div style="font-size:15px;color:#7A5A6A;margin:8px 0 14px;">${REWARD_PERCENT}% off your next order</div>
      <div style="display:inline-block;background:#fff;border:2px dashed #EC4899;border-radius:10px;padding:12px 22px;font-family:monospace;font-size:20px;font-weight:800;color:#4A3040;letter-spacing:2px;">${esc(code)}</div>
      <div style="font-size:12px;color:#9C7A8E;margin-top:12px;">Enter it at checkout. Valid until ${expiry}.</div>
    </div>`
}

function surveyButtons(orderId: string, offerReward: boolean): string {
  const buttons = SOURCES.map(src =>
    `<a href="${SITE_URL}/survey?order=${encodeURIComponent(orderId)}&amp;source=${src.key}" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;background:#fff;border:1px solid #FFD6E8;border-radius:50px;text-decoration:none;font-size:13px;font-weight:600;color:#4A3040;">${src.emoji} ${src.label}</a>`
  ).join('')

  // When there's a discount on the table, lead with it. Buried in body copy it
  // reads as a footnote, and the whole point is that it's worth a tap.
  if (offerReward) {
    return `
    <div style="background:linear-gradient(135deg,#FFF0F5,#FFE4EF);border:2px dashed #EC4899;border-radius:14px;padding:22px 20px;margin:24px 0;text-align:center;">
      <div style="font-size:30px;line-height:1;">&#127873;</div>
      <div style="font-size:22px;font-weight:800;color:#EC4899;margin:8px 0 2px;">Get ${REWARD_PERCENT}% off your next order</div>
      <div style="font-size:14px;color:#7A5A6A;margin-bottom:16px;">Just tell us how you found us &mdash; one tap and the code is yours.</div>
      <div>${buttons}</div>
      <div style="font-size:12px;color:#9C7A8E;margin-top:8px;">We'll email your code straight away.</div>
    </div>`
  }

  return `
    <div style="background:#FFF8FC;border:1px solid #FFE4EF;border-radius:12px;padding:18px 20px;margin:24px 0;">
      <div style="font-size:15px;font-weight:700;color:#4A3040;margin-bottom:4px;">How did you find us?</div>
      <div style="font-size:13px;color:#9C7A8E;margin-bottom:14px;">One tap. It helps us know where to reach people like you.</div>
      ${buttons}
    </div>`
}

/** One-tap stars. Each links straight through to the recorded rating. */
function starRow(orderId: string): string {
  const star = (n: number) =>
    `<a href="${SITE_URL}/survey?order=${encodeURIComponent(orderId)}&amp;rating=${n}" style="display:inline-block;padding:0 6px;font-size:30px;line-height:1;text-decoration:none;color:#F59E0B;">&#9733;</a>`
  return `
    <div style="background:#FFF8FC;border:1px solid #FFE4EF;border-radius:12px;padding:18px 20px;margin:24px 0;text-align:center;">
      <div style="font-size:15px;font-weight:700;color:#4A3040;margin-bottom:2px;">How did we do?</div>
      <div style="font-size:13px;color:#9C7A8E;margin-bottom:10px;">Tap a star &mdash; you can add a note on the next page.</div>
      <div>${[1, 2, 3, 4, 5].map(star).join('')}</div>
    </div>`
}

export interface DeliveredEmail {
  orderId: string
  customerName: string
  customerEmail: string
  recipientName: string
  deliveredOn?: string
  /** Set when the customer has already answered the survey and earned the code. */
  rewardCode?: string
  rewardExpiresAt?: string
  /** True when they haven't answered yet, so the email should ask. */
  askHowTheyFoundUs: boolean
  /** False when this customer has already been rewarded once. */
  rewardAvailable: boolean
  /** False once they've already rated this order. */
  askFeedback?: boolean
}

export function deliveredHTML(d: DeliveredEmail): string {
  const offer = d.rewardCode
    ? rewardBlock(d.rewardCode, d.rewardExpiresAt)
    : d.askHowTheyFoundUs
      ? surveyButtons(d.orderId, d.rewardAvailable)
      : ''

  return `
  <div style="background:#FFF5F9;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #FFE4EF;">
      <div style="background:linear-gradient(135deg,#FFF0F5,#FFE4EF);padding:28px 24px;text-align:center;">
        <div style="font-size:13px;font-weight:700;color:#EC4899;letter-spacing:1px;text-transform:uppercase;">Cambodia Floral</div>
        <div style="font-size:40px;margin:10px 0 4px;">&#127804;</div>
        <h1 style="margin:6px 0 4px;font-size:24px;color:#4A3040;">Delivered!</h1>
        <p style="margin:0;font-size:14px;color:#7A5A6A;">
          Your flowers reached ${esc(d.recipientName)}${d.deliveredOn ? ` on ${formatShopDate(shopDateKey(d.deliveredOn))}` : ''}.
        </p>
      </div>

      <div style="padding:24px;">
        <p style="font-size:15px;color:#4A3040;line-height:1.7;margin:0 0 6px;">Thank you, ${esc(d.customerName)}.</p>
        <p style="font-size:14px;color:#7A5A6A;line-height:1.7;margin:0;">
          We hope it made their day. Order #${d.orderId.slice(0, 8)} is complete &mdash; thank you for trusting a small shop in Phnom Penh with something that mattered.
        </p>

        ${offer}

        ${d.askFeedback === false ? '' : starRow(d.orderId)}

        <div style="text-align:center;margin:26px 0 6px;">
          <a href="${SITE_URL}/shop" style="display:inline-block;background:#EC4899;color:#fff;text-decoration:none;padding:13px 30px;border-radius:50px;font-size:15px;font-weight:700;">Send flowers again</a>
        </div>
      </div>

      <div style="background:#FFF8FC;padding:18px 24px;text-align:center;border-top:1px solid #FFE4EF;">
        <p style="margin:0 0 6px;font-size:12px;color:#9C7A8E;line-height:1.6;">Questions? Just reply to this email &mdash; it reaches us directly.</p>
        <p style="margin:0;font-size:11px;color:#C9A0B4;">Cambodia Floral &middot; Phnom Penh, Cambodia</p>
      </div>
    </div>
  </div>`
}

/** "Your order was delivered" — sent when an admin marks the order delivered. Never throws. */
export async function sendDeliveredEmail(d: DeliveredEmail) {
  await sendCustomerEmail(
    d.customerEmail,
    d.rewardCode
      ? `Delivered! And here's ${REWARD_PERCENT}% off your next order 🌸`
      : `Your flowers were delivered 🌸`,
    deliveredHTML(d),
    'delivered',
  )
}

export interface RewardEmail {
  customerName: string
  customerEmail: string
  code: string
  expiresAt?: string
}

/** "Thanks for answering — here's your code." Never throws. */
export async function sendRewardEmail(d: RewardEmail) {
  const html = `
  <div style="background:#FFF5F9;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #FFE4EF;">
      <div style="background:linear-gradient(135deg,#FFF0F5,#FFE4EF);padding:28px 24px;text-align:center;">
        <div style="font-size:13px;font-weight:700;color:#EC4899;letter-spacing:1px;text-transform:uppercase;">Cambodia Floral</div>
        <h1 style="margin:10px 0 4px;font-size:24px;color:#4A3040;">Thank you, ${esc(d.customerName)}!</h1>
        <p style="margin:0;font-size:14px;color:#7A5A6A;">Knowing how you found us genuinely helps.</p>
      </div>
      <div style="padding:8px 24px 24px;">
        ${rewardBlock(d.code, d.expiresAt)}
        <div style="text-align:center;margin:6px 0;">
          <a href="${SITE_URL}/shop" style="display:inline-block;background:#EC4899;color:#fff;text-decoration:none;padding:13px 30px;border-radius:50px;font-size:15px;font-weight:700;">Browse flowers</a>
        </div>
      </div>
      <div style="background:#FFF8FC;padding:18px 24px;text-align:center;border-top:1px solid #FFE4EF;">
        <p style="margin:0;font-size:11px;color:#C9A0B4;">Cambodia Floral &middot; Phnom Penh, Cambodia</p>
      </div>
    </div>
  </div>`
  await sendCustomerEmail(d.customerEmail, `Your ${REWARD_PERCENT}% thank-you code 🌸`, html, 'reward')
}
