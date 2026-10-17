import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

type Mode = 'percent' | 'fixed'
type Rounding = 'none' | 'whole' | 'nearest5' | 'end99'

interface Body {
  mode: Mode
  value: number
  direction: 'increase' | 'decrease'
  category?: string          // 'all' or a category name
  rounding?: Rounding
  adjustCompare?: boolean    // keep the struck-through price above the new price
  dryRun?: boolean
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

function applyRounding(n: number, rounding: Rounding): number {
  switch (rounding) {
    case 'whole': return Math.round(n)
    case 'nearest5': return Math.round(n / 5) * 5
    case 'end99': return Math.max(0.99, Math.floor(n) + 0.99)
    default: return round2(n)
  }
}

function newPrice(current: number, b: Body): number {
  const signed = b.direction === 'decrease' ? -Math.abs(b.value) : Math.abs(b.value)
  const raw = b.mode === 'percent' ? current * (1 + signed / 100) : current + signed
  // Never produce a free or negative product through a bulk operation.
  return Math.max(0.01, applyRounding(raw, b.rounding || 'none'))
}

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let b: Body
  try { b = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  if (!['percent', 'fixed'].includes(b.mode) || !Number.isFinite(b.value) || b.value === 0) {
    return NextResponse.json({ error: 'Enter an amount or percentage to apply' }, { status: 400 })
  }
  if (b.mode === 'percent' && Math.abs(b.value) > 90) {
    return NextResponse.json({ error: 'That percentage looks like a typo — keep it under 90%' }, { status: 400 })
  }

  const supabase = createServiceClient()
  let q = supabase.from('cf_products').select('id, sku, title, price, compare_price, category').eq('is_active', true)
  if (b.category && b.category !== 'all') q = q.eq('category', b.category)

  const { data: products, error } = await q.order('title')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const changes = (products || []).map(p => {
    const from = Number(p.price) || 0
    const to = newPrice(from, b)
    let compareTo = p.compare_price == null ? null : Number(p.compare_price)
    // A struck-through price below the asking price reads as a mistake.
    if (b.adjustCompare && compareTo != null) {
      compareTo = Math.max(newPrice(compareTo, b), round2(to * 1.05))
      compareTo = applyRounding(compareTo, b.rounding || 'none')
    }
    return { id: p.id, sku: p.sku, title: p.title, from, to, compareFrom: p.compare_price, compareTo }
  }).filter(c => c.to !== c.from || c.compareTo !== c.compareFrom)

  const label = `${b.direction === 'decrease' ? '−' : '+'}${b.mode === 'percent' ? `${Math.abs(b.value)}%` : `$${Math.abs(b.value).toFixed(2)}`}` +
    ` on ${b.category && b.category !== 'all' ? b.category : 'all products'} (${changes.length} items)`

  if (b.dryRun) {
    return NextResponse.json({
      dryRun: true, label,
      count: changes.length,
      sample: changes.slice(0, 8),
      totalBefore: round2(changes.reduce((s, c) => s + c.from, 0)),
      totalAfter: round2(changes.reduce((s, c) => s + c.to, 0)),
    })
  }

  if (changes.length === 0) {
    return NextResponse.json({ error: 'Nothing would change' }, { status: 400 })
  }

  // Snapshot first: this is the only thing that makes the change reversible.
  const { data: adjustment, error: snapErr } = await supabase
    .from('cf_price_adjustments')
    .insert({
      description: label,
      product_count: changes.length,
      snapshot: changes.map(c => ({ id: c.id, price: c.from, compare_price: c.compareFrom })),
    })
    .select('id')
    .single()

  if (snapErr) {
    return NextResponse.json({
      error: `Could not save an undo point, so nothing was changed. Run supabase/price_adjustments.sql first. (${snapErr.message})`,
    }, { status: 500 })
  }

  let updated = 0
  for (const c of changes) {
    const patch: Record<string, number | null> = { price: c.to }
    if (b.adjustCompare && c.compareTo != null) patch.compare_price = c.compareTo
    const { error: upErr } = await supabase.from('cf_products').update(patch).eq('id', c.id)
    if (!upErr) updated++
  }

  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true, updated, adjustmentId: adjustment.id, label })
}

/** The most recent bulk change that hasn't been undone, for the Undo button. */
export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('cf_price_adjustments')
    .select('id, description, created_at, product_count')
    .is('undone_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
  return NextResponse.json({ last: data?.[0] || null })
}
