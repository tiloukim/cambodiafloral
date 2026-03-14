import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Total revenue and order stats
  const { data: orders } = await supabase
    .from('cf_orders')
    .select('total, status, created_at')

  const totalRevenue = orders?.reduce((s, o) => s + o.total, 0) || 0
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
  const confirmedOrders = orders?.filter(o => o.status === 'confirmed').length || 0
  const preparingOrders = orders?.filter(o => o.status === 'preparing').length || 0
  const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0

  // Today's revenue
  const today = new Date().toISOString().split('T')[0]
  const todayRevenue = orders
    ?.filter(o => o.created_at.startsWith(today))
    .reduce((s, o) => s + o.total, 0) || 0

  // Customer count
  const { count: customerCount } = await supabase
    .from('cf_customers')
    .select('*', { count: 'exact', head: true })

  // Product count
  const { count: productCount } = await supabase
    .from('cf_products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('cf_orders')
    .select('*, cf_customers(name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    totalRevenue,
    todayRevenue,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    preparingOrders,
    deliveredOrders,
    customerCount: customerCount || 0,
    productCount: productCount || 0,
    recentOrders: recentOrders || [],
  })
}
