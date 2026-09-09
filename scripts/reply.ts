/**
 * Print paste-ready customer replies with the real per-order links filled in.
 *   npx tsx scripts/reply.ts <order-id or first 8 chars>
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SITE = 'https://cambodiafloral.com'

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('usage: npx tsx scripts/reply.ts <order-id or first 8 chars>')
    process.exit(1)
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: orders } = await supabase
    .from('cf_orders')
    .select('id, sender_name, sender_email, status, total, heard_from, feedback_rating')
    .order('created_at', { ascending: false })

  const order = (orders || []).find(o => o.id === arg || o.id.startsWith(arg))
  if (!order) {
    console.error(`no order matching "${arg}"`)
    process.exit(1)
  }

  const first = (order.sender_name || '').trim().split(/\s+/)[0] || 'there'
  const short = `#${order.id.slice(0, 8)}`
  const survey = `${SITE}/survey?order=${order.id}`
  const review = `${SITE}/review/${order.id}`

  const md = readFileSync('docs/email-replies.md', 'utf8')
    .replaceAll('{{FIRST_NAME}}', first)
    .replaceAll('{{ORDER_SHORT}}', short)
    .replaceAll('{{SURVEY_LINK}}', survey)
    .replaceAll('{{REVIEW_LINK}}', review)

  console.log(`\n=== ${order.sender_name} <${order.sender_email}> · ${short} · ${order.status} · $${order.total} ===`)
  console.log(`survey answered: ${order.heard_from ? 'yes' : 'no'} · rated: ${order.feedback_rating ? order.feedback_rating + '/5' : 'no'}`)
  console.log(`\nsurvey link: ${survey}\nreview link: ${review}\n`)
  console.log(md.split('---').slice(1).join('---'))
}

main().catch(e => { console.error(e.message || e); process.exit(1) })
