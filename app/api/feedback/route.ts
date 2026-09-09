import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { grantSurveyReward, hasCompletedBoth } from '@/lib/rewards'
import { sendRewardEmail } from '@/lib/notify'

// Records the customer's rating and comment for one order. Public for the same
// reason the survey endpoint is: it's reached from a one-click link in an email
// where there's no session. It writes only these three columns on an order the
// caller already knows the id of.
export async function POST(req: Request) {
  let body: { order_id?: string; rating?: number; comment?: string; consent?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { order_id, rating, comment, consent } = body
  const hasRating = rating !== undefined && rating !== null
  const hasComment = typeof comment === 'string' && comment.trim().length > 0

  // Consent alone is a valid update: the checkbox saves the moment it's
  // ticked, which can happen before anything is typed.
  const hasConsent = typeof consent === 'boolean'
  if (!order_id || (!hasRating && !hasComment && !hasConsent)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (hasRating && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('cf_orders')
    .select('id, heard_from, feedback_rating, customer_id, sender_name, sender_email')
    .eq('id', order_id)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Only overwrite what was actually sent: a rating arrives from the email's
  // one-click star, the comment follows from the page a moment later.
  const updates: Record<string, unknown> = { feedback_at: new Date().toISOString() }
  if (hasRating) updates.feedback_rating = rating
  if (hasComment) updates.feedback_comment = comment.trim().slice(0, 1000)
  // Consent is only meaningful attached to words. Sent explicitly each time,
  // so unticking the box withdraws permission.
  if (typeof consent === 'boolean') updates.feedback_consent = consent

  const { error } = await supabase.from('cf_orders').update(updates).eq('id', order_id)

  if (error) {
    console.error('[feedback] could not record (run supabase/feedback.sql):', error.message)
    return NextResponse.json({ error: 'Could not save your feedback' }, { status: 500 })
  }

  // A rating can be the half that completes the pair, so try the grant here too.
  const effectiveRating = hasRating ? rating : order.feedback_rating
  let reward: Awaited<ReturnType<typeof grantSurveyReward>> = null
  const bothDone = hasCompletedBoth({ heard_from: order.heard_from, feedback_rating: effectiveRating })

  if (order.customer_id && bothDone) {
    reward = await grantSurveyReward(supabase, order.customer_id)
    if (reward?.isNew) {
      await sendRewardEmail({
        customerName: order.sender_name,
        customerEmail: order.sender_email,
        code: reward.code,
        expiresAt: reward.expiresAt,
      })
    }
  }

  return NextResponse.json({
    ok: true,
    reward: reward ? { code: reward.code, isNew: reward.isNew } : null,
    // What's still outstanding before the discount unlocks.
    needsSource: !order.heard_from,
  })
}
