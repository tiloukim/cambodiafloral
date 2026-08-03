import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('cf_promo_codes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const code = String(body.code || '').trim().toUpperCase()
  const type = body.discount_type

  if (!code) return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  if (!['percent', 'fixed', 'free_delivery'].includes(type)) {
    return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('cf_promo_codes')
    .insert({
      code,
      discount_type: type,
      discount_value: type === 'free_delivery' ? 0 : (Number(body.discount_value) || 0),
      min_subtotal: Number(body.min_subtotal) || 0,
      max_uses: body.max_uses === '' || body.max_uses == null ? null : Number(body.max_uses),
      expires_at: body.expires_at || null,
      first_order_only: body.first_order_only === true,
      active: body.active !== false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'That code already exists' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
