import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // All orders with items for profit calculation
  const { data: orders } = await supabase
    .from('cf_orders')
    .select('total, subtotal, delivery_fee, status, created_at')

  // Get all products with cost for profit calculation
  const { data: products } = await supabase
    .from('cf_products')
    .select('id, price, cost')

  const productCostMap = new Map<string, number>()
  products?.forEach(p => productCostMap.set(p.id, p.cost || 0))

  // Get all order items to calculate cost
  const { data: orderItems } = await supabase
    .from('cf_order_items')
    .select('order_id, product_id, price, quantity')

  // Build order cost map
  const orderCostMap = new Map<string, number>()
  orderItems?.forEach(item => {
    const cost = productCostMap.get(item.product_id || '') || 0
    const existing = orderCostMap.get(item.order_id) || 0
    orderCostMap.set(item.order_id, existing + (cost * item.quantity))
  })

  const totalRevenue = orders?.reduce((s, o) => s + o.total, 0) || 0
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
  const confirmedOrders = orders?.filter(o => o.status === 'confirmed').length || 0
  const preparingOrders = orders?.filter(o => o.status === 'preparing').length || 0
  const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0

  // Date helpers
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const thisMonth = today.slice(0, 7) // YYYY-MM
  const thisYear = today.slice(0, 4)  // YYYY

  // Revenue by period
  const todayOrders = orders?.filter(o => o.created_at.startsWith(today)) || []
  const monthOrders = orders?.filter(o => o.created_at.startsWith(thisMonth)) || []
  const yearOrders = orders?.filter(o => o.created_at.startsWith(thisYear)) || []

  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const monthRevenue = monthOrders.reduce((s, o) => s + o.total, 0)
  const yearRevenue = yearOrders.reduce((s, o) => s + o.total, 0)

  // Total cost (from order items)
  const totalCost = Array.from(orderCostMap.values()).reduce((s, c) => s + c, 0)
  const totalProfit = totalRevenue - totalCost

  // For period-specific profit, we need order IDs
  // Get order IDs by fetching full orders
  const { data: fullOrders } = await supabase
    .from('cf_orders')
    .select('id, total, created_at')

  const getProfit = (periodOrders: typeof todayOrders) => {
    // Match by created_at since we don't have IDs in the filtered list
    const periodIds = new Set(
      fullOrders
        ?.filter(fo => periodOrders.some(po => po.created_at === fo.created_at && po.total === fo.total))
        .map(fo => fo.id) || []
    )
    const periodCost = Array.from(periodIds).reduce((s, id) => s + (orderCostMap.get(id) || 0), 0)
    const periodRevenue = periodOrders.reduce((s, o) => s + o.total, 0)
    return { revenue: periodRevenue, cost: periodCost, profit: periodRevenue - periodCost }
  }

  const todayProfit = getProfit(todayOrders)
  const monthProfit = getProfit(monthOrders)
  const yearProfit = getProfit(yearOrders)

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
    monthRevenue,
    yearRevenue,
    totalCost,
    totalProfit,
    todayProfit,
    monthProfit,
    yearProfit,
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
