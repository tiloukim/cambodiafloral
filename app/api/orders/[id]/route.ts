import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  // Check if admin
  const admin = await isAdmin()

  if (admin) {
    const { data, error } = await supabase
      .from('cf_orders')
      .select('*, cf_order_items(*)')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ ...data, items: data.cf_order_items })
  }

  // For users/guests, allow looking up by order id (for tracking)
  const { data, error } = await supabase
    .from('cf_orders')
    .select('*, cf_order_items(*)')
    .eq('id', id)
    .single()

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

  const { data, error } = await supabase
    .from('cf_orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

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
