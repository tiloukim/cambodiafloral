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
    }))

  return NextResponse.json({ timeZoneLabel: SHOP_TIME_ZONE_LABEL, rows })
}
