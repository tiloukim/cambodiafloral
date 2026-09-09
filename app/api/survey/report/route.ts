import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { shopDateKey, SHOP_TIME_ZONE_LABEL } from '@/lib/timezone'
import { roundCents } from '@/lib/fees'

// Attribution is only meaningful against orders that were actually paid for —
// the same basis the P&L uses, so the two reports can be read side by side.
const PAID_STATUSES = new Set(['confirmed', 'preparing', 'out_for_delivery', 'delivered'])

interface OrderRow {
  id: string
  status: string
  total: number
  sender_name: string
  sender_email: string
  heard_from?: string | null
  heard_from_detail?: string | null
  heard_from_at?: string | null
  feedback_rating?: number | null
  feedback_comment?: string | null
  feedback_at?: string | null
  feedback_consent?: boolean | null
  traffic_source?: string | null
  referrer_host?: string | null
  utm_campaign?: string | null
  created_at: string
}

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('cf_orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const paidIds = ((data || []) as OrderRow[]).filter(o => PAID_STATUSES.has(o.status)).map(o => o.id)

  // What each order contained, so the admin can pick which product a published
  // review attaches to, and what's already been published from it.
  const { data: items } = await supabase
    .from('cf_order_items')
    .select('order_id, product_id, title')
    .in('order_id', paidIds.length ? paidIds : ['00000000-0000-0000-0000-000000000000'])

  const productsByOrder = new Map<string, { id: string; title: string }[]>()
  items?.forEach(i => {
    if (!i.product_id) return
    const list = productsByOrder.get(i.order_id) || []
    list.push({ id: i.product_id, title: i.title })
    productsByOrder.set(i.order_id, list)
  })

  const { data: published } = await supabase
    .from('cf_reviews')
    .select('order_id, product_id, approved')
    .in('order_id', paidIds.length ? paidIds : ['00000000-0000-0000-0000-000000000000'])

  const publishedByOrder = new Map<string, { productId: string; approved: boolean }[]>()
  published?.forEach(r => {
    if (!r.order_id) return
    const list = publishedByOrder.get(r.order_id) || []
    list.push({ productId: r.product_id, approved: r.approved })
    publishedByOrder.set(r.order_id, list)
  })

  // Every paid order ships to the client, answered or not: the response rate
  // needs the denominator, and the period filter runs there without a refetch.
  const rows = ((data || []) as OrderRow[])
    .filter(o => PAID_STATUSES.has(o.status))
    .map(o => ({
      id: o.id,
      shopDate: shopDateKey(o.created_at),
      createdAt: o.created_at,
      customer: o.sender_name,
      email: o.sender_email,
      total: roundCents(Number(o.total) || 0),
      source: o.heard_from || null,
      detail: o.heard_from_detail || null,
      answeredAt: o.heard_from_at || null,
      rating: o.feedback_rating ?? null,
      comment: o.feedback_comment || null,
      consent: o.feedback_consent === true,
      trafficSource: o.traffic_source || null,
      referrerHost: o.referrer_host || null,
      utmCampaign: o.utm_campaign || null,
      products: productsByOrder.get(o.id) || [],
      published: publishedByOrder.get(o.id) || [],
    }))

  return NextResponse.json({ timeZoneLabel: SHOP_TIME_ZONE_LABEL, rows })
}
