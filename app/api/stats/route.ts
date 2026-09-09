import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { orderFee, roundCents } from '@/lib/fees'
import { shopDateKey, shopToday } from '@/lib/timezone'
import { SOURCES } from '@/lib/attribution'

// Money is only earned once an order is captured. 'pending' was never paid for
// and 'cancelled' was refunded or dropped, so neither counts as revenue.
const PAID_STATUSES = new Set(['confirmed', 'preparing', 'out_for_delivery', 'delivered'])

interface OrderRow {
  id: string
  status: string
  total: number
  payment_fee?: number | null
  heard_from?: string | null
  created_at: string
}

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // select('*') on purpose: the fee columns are optional until
  // supabase/payment_fees.sql has been run, and naming them would 400.
  const { data: orderRows } = await supabase.from('cf_orders').select('*')
  const orders = (orderRows || []) as OrderRow[]

  const { data: products } = await supabase.from('cf_products').select('id, cost')
  const costByProduct = new Map<string, number>()
  products?.forEach(p => costByProduct.set(p.id, Number(p.cost) || 0))

  const { data: orderItems } = await supabase
    .from('cf_order_items')
    .select('order_id, product_id, quantity')

  const cogsByOrder = new Map<string, number>()
  orderItems?.forEach(item => {
    const unit = costByProduct.get(item.product_id || '') || 0
    cogsByOrder.set(item.order_id, (cogsByOrder.get(item.order_id) || 0) + unit * item.quantity)
  })

  // One line per paid order, carrying everything the periods need. Keyed work
  // happens here so period figures are filtered by id, never by matching on
  // (created_at, total) — two orders can share both.
  const lines = orders.filter(o => PAID_STATUSES.has(o.status)).map(o => {
    const revenue = roundCents(Number(o.total) || 0)
    const cost = roundCents(cogsByOrder.get(o.id) || 0)
    const { fee } = orderFee(o)
    return { shopDate: shopDateKey(o.created_at), revenue, cost, fee, profit: roundCents(revenue - cost - fee) }
  })

  const summarize = (ls: typeof lines) => {
    const sum = (pick: (l: typeof lines[number]) => number) => roundCents(ls.reduce((s, l) => s + pick(l), 0))
    return { revenue: sum(l => l.revenue), cost: sum(l => l.cost), fees: sum(l => l.fee), profit: sum(l => l.profit) }
  }

  // Today/month/year are the shop's calendar in Phnom Penh, not UTC.
  const today = shopToday()
  const inPeriod = (prefix: string) => lines.filter(l => l.shopDate.startsWith(prefix))

  const todayProfit = summarize(inPeriod(today))
  const monthProfit = summarize(inPeriod(today.slice(0, 7)))
  const yearProfit = summarize(inPeriod(today.slice(0, 4)))
  const allTime = summarize(lines)

  // How customers found us, counted over paid orders and ranked by revenue —
  // an answer that brings $400 of orders matters more than one that brings $40.
  const paidOrders = orders.filter(o => PAID_STATUSES.has(o.status))
  const answered = paidOrders.filter(o => o.heard_from)
  const heardFrom = SOURCES.map(src => {
    const matching = answered.filter(o => o.heard_from === src.key)
    return {
      key: src.key,
      label: src.label,
      emoji: src.emoji,
      orders: matching.length,
      revenue: roundCents(matching.reduce((sum, o) => sum + (Number(o.total) || 0), 0)),
    }
  }).filter(r => r.orders > 0).sort((a, b) => b.revenue - a.revenue)

  const { count: customerCount } = await supabase
    .from('cf_customers')
    .select('*', { count: 'exact', head: true })

  const { count: productCount } = await supabase
    .from('cf_products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { data: recentOrders } = await supabase
    .from('cf_orders')
    .select('*, cf_customers(name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    totalRevenue: allTime.revenue,
    todayRevenue: todayProfit.revenue,
    monthRevenue: monthProfit.revenue,
    yearRevenue: yearProfit.revenue,
    totalCost: allTime.cost,
    totalFees: allTime.fees,
    totalProfit: allTime.profit,
    todayProfit,
    monthProfit,
    yearProfit,
    totalOrders: orders.length,
    paidOrders: lines.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    heardFrom,
    heardFromAnswered: answered.length,
    heardFromAsked: paidOrders.length,
    customerCount: customerCount || 0,
    productCount: productCount || 0,
    recentOrders: recentOrders || [],
  })
}
