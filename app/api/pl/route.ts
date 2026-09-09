import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { orderFee, roundCents, PAYPAL_FEE_PERCENT, PAYPAL_FEE_FIXED } from '@/lib/fees'

// An order only earns money once it has been paid for. 'pending' orders were
// never captured and 'cancelled' ones were refunded or dropped, so neither
// belongs in a profit statement.
const PAID_STATUSES = new Set(['confirmed', 'preparing', 'out_for_delivery', 'delivered'])

interface OrderRow {
  id: string
  status: string
  subtotal: number
  discount: number | null
  delivery_fee: number
  total: number
  sender_name: string
  payment_fee?: number | null
  created_at: string
}

interface Line {
  id: string
  date: string
  customer: string
  status: string
  subtotal: number
  discount: number
  delivery: number
  gross: number
  fee: number
  feeEstimated: boolean
  cogs: number
  net: number
}

function summarize(lines: Line[]) {
  const sum = (pick: (l: Line) => number) => roundCents(lines.reduce((s, l) => s + pick(l), 0))
  const gross = sum(l => l.gross)
  const fees = sum(l => l.fee)
  const cogs = sum(l => l.cogs)
  const net = roundCents(gross - fees - cogs)
  return {
    orders: lines.length,
    subtotal: sum(l => l.subtotal),
    discounts: sum(l => l.discount),
    delivery: sum(l => l.delivery),
    gross,
    fees,
    cogs,
    net,
    margin: gross > 0 ? roundCents((net / gross) * 100) : 0,
    estimatedFees: lines.filter(l => l.feeEstimated).length,
  }
}

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // select('*') on purpose: the fee columns are optional until
  // supabase/payment_fees.sql has been run, and naming them would 400.
  const { data: orderRows, error } = await supabase
    .from('cf_orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: products } = await supabase.from('cf_products').select('id, cost')
  const costByProduct = new Map<string, number>()
  products?.forEach(p => costByProduct.set(p.id, Number(p.cost) || 0))

  const { data: items } = await supabase
    .from('cf_order_items')
    .select('order_id, product_id, quantity')

  const cogsByOrder = new Map<string, number>()
  items?.forEach(i => {
    const unit = costByProduct.get(i.product_id || '') || 0
    cogsByOrder.set(i.order_id, (cogsByOrder.get(i.order_id) || 0) + unit * i.quantity)
  })

  const paid = ((orderRows || []) as OrderRow[]).filter(o => PAID_STATUSES.has(o.status))

  const lines: Line[] = paid.map(o => {
    const { fee, estimated } = orderFee(o)
    const cogs = roundCents(cogsByOrder.get(o.id) || 0)
    const gross = roundCents(Number(o.total) || 0)
    return {
      id: o.id,
      date: o.created_at,
      customer: o.sender_name,
      status: o.status,
      subtotal: roundCents(Number(o.subtotal) || 0),
      discount: roundCents(Number(o.discount) || 0),
      delivery: roundCents(Number(o.delivery_fee) || 0),
      gross,
      fee,
      feeEstimated: estimated,
      cogs,
      net: roundCents(gross - fee - cogs),
    }
  })

  const today = new Date().toISOString().slice(0, 10)
  const inPeriod = (prefix: string) => lines.filter(l => l.date.startsWith(prefix))

  // Month-by-month, newest first
  const byMonth = new Map<string, Line[]>()
  lines.forEach(l => {
    const key = l.date.slice(0, 7)
    if (!byMonth.has(key)) byMonth.set(key, [])
    byMonth.get(key)!.push(l)
  })
  const months = Array.from(byMonth.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, ls]) => ({ month, ...summarize(ls) }))

  const unpaid = ((orderRows || []) as OrderRow[]).filter(o => !PAID_STATUSES.has(o.status))

  return NextResponse.json({
    feeModel: { percent: PAYPAL_FEE_PERCENT, fixed: PAYPAL_FEE_FIXED },
    periods: {
      today: summarize(inPeriod(today)),
      month: summarize(inPeriod(today.slice(0, 7))),
      year: summarize(inPeriod(today.slice(0, 4))),
      all: summarize(lines),
    },
    months,
    lines,
    excluded: {
      pending: unpaid.filter(o => o.status === 'pending').length,
      cancelled: unpaid.filter(o => o.status === 'cancelled').length,
    },
  })
}
