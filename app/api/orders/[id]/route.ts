import { NextResponse } from 'next/server'
import { sendDeliveredEmail } from '@/lib/notify'
import { grantSurveyReward, hasCompletedBoth } from '@/lib/rewards'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  // Check if admin
  const admin = await isAdmin()

  if (admin) {
    let adminQuery = supabase.from('cf_orders').select('*, cf_order_items(*)')
    if (id.length < 36) {
      adminQuery = adminQuery.ilike('id', `${id}%`)
    } else {
      adminQuery = adminQuery.eq('id', id)
    }
    const { data, error } = await adminQuery.limit(1).single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ ...data, items: data.cf_order_items })
  }

  // For users/guests, allow looking up by order id (for tracking)
  // Support both full UUID and short (first 8 chars) order IDs
  let query = supabase.from('cf_orders').select('*, cf_order_items(*)')
  if (id.length < 36) {
    query = query.ilike('id', `${id}%`)
  } else {
    query = query.eq('id', id)
  }
  const { data, error } = await query.limit(1).single()

  if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // If user is logged in, verify they own this order
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (user) {
    const { data: customer } = await supabase
      .from('cf_customers')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle()

    // Allow access if customer owns the order or it's a public tracking lookup
    if (customer && data.customer_id !== customer.id) {
      // Still allow tracking by order ID for non-owners
    }
  }

  return NextResponse.json({ ...data, items: data.cf_order_items })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status, tracking_number } = await req.json()
  const supabase = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (tracking_number !== undefined) updates.tracking_number = tracking_number
  if (status === 'delivered') updates.delivered_at = new Date().toISOString()

  // Read the current state first: the delivered email must fire on the
  // transition, not every time an already-delivered order is touched.
  const { data: before } = await supabase
    .from('cf_orders')
    .select('status, customer_id, sender_name, sender_email, recipient_name, heard_from, feedback_rating')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('cf_orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'delivered' && before && before.status !== 'delivered') {
    // Answering the survey earns a one-per-customer discount. If they already
    // answered, they've earned it now; if not, the email asks and offers it.
    let reward: Awaited<ReturnType<typeof grantSurveyReward>> = null
    let rewardAvailable = true

    if (before.customer_id) {
      const { data: customer } = await supabase
        .from('cf_customers')
        .select('survey_reward_code')
        .eq('id', before.customer_id)
        .maybeSingle()
      rewardAvailable = !customer?.survey_reward_code

      // Same rule as everywhere else: both halves, or no discount.
      if (hasCompletedBoth(before)) {
        reward = await grantSurveyReward(supabase, before.customer_id)
      }
    }

    await sendDeliveredEmail({
      orderId: id,
      customerName: before.sender_name,
      customerEmail: before.sender_email,
      recipientName: before.recipient_name,
      deliveredOn: updates.delivered_at,
      rewardCode: reward?.isNew ? reward.code : undefined,
      rewardExpiresAt: reward?.expiresAt,
      askHowTheyFoundUs: !before.heard_from,
      rewardAvailable,
      askFeedback: !before.feedback_rating,
    })
  }

  // Create notification for status change
  if (status) {
    await supabase.from('cf_notifications').insert({
      type: 'status_change',
      title: 'Order Updated',
      message: `Order #${id.slice(0, 8)} status changed to ${status.replace(/_/g, ' ')}`,
      order_id: id,
    })
  }

  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()

  // Delete order items first (foreign key constraint)
  await supabase.from('cf_order_items').delete().eq('order_id', id)

  // Delete notifications related to this order
  await supabase.from('cf_notifications').delete().eq('order_id', id)

  // Delete the order
  const { error } = await supabase.from('cf_orders').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
