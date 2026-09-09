import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { sendReviewRequestEmail } from '@/lib/notify'

const ELIGIBLE = ['delivered']
const RESEND_AFTER_DAYS = 30
const MAX_PER_RUN = 50

/**
 * Ask every delivered order that hasn't been asked recently. Deliberately
 * conservative: delivered only, one ask per 30 days, capped per run — a bulk
 * send to real customers is not something to get wrong twice.
 */
export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dryRun = new URL(req.url).searchParams.get('dry') === '1'
  const supabase = createServiceClient()

  const { data: orders } = await supabase
    .from('cf_orders')
    .select('id, status, sender_name, sender_email, heard_from, review_requested_at, cf_order_items(product_id, title, image_url)')
    .in('status', ELIGIBLE)
    .order('created_at', { ascending: false })

  const { data: allReviews } = await supabase.from('cf_reviews').select('order_id, product_id')
  const reviewedByOrder = new Map<string, Set<string>>()
  allReviews?.forEach(r => {
    if (!r.order_id) return
    const set = reviewedByOrder.get(r.order_id) || new Set<string>()
    set.add(r.product_id)
    reviewedByOrder.set(r.order_id, set)
  })

  const cutoff = Date.now() - RESEND_AFTER_DAYS * 86400_000
  const candidates = (orders || []).filter(o => {
    if (!o.sender_email) return false
    if (o.review_requested_at && new Date(o.review_requested_at).getTime() > cutoff) return false
    const reviewed = reviewedByOrder.get(o.id) || new Set<string>()
    return (o.cf_order_items || []).some(i => i.product_id && !reviewed.has(i.product_id))
  }).slice(0, MAX_PER_RUN)

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      wouldSend: candidates.length,
      recipients: candidates.map(o => ({ order: o.id.slice(0, 8), email: o.sender_email })),
    })
  }

  let sent = 0
  for (const o of candidates) {
    const reviewed = reviewedByOrder.get(o.id) || new Set<string>()
    await sendReviewRequestEmail({
      orderId: o.id,
      customerName: o.sender_name,
      customerEmail: o.sender_email,
      items: (o.cf_order_items || [])
        .filter(i => i.product_id && !reviewed.has(i.product_id))
        .map(i => ({ title: i.title, image_url: i.image_url })),
      askHowTheyFoundUs: !o.heard_from,
    })
    await supabase.from('cf_orders')
      .update({ review_requested_at: new Date().toISOString() }).eq('id', o.id)
    sent++
  }

  return NextResponse.json({ ok: true, sent })
}
