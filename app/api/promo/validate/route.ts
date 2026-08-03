import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { evaluatePromo, type PromoCode } from '@/lib/promo'

const DELIVERY_FEE = 5
const FREE_DELIVERY_THRESHOLD = 100

// Preview a promo code for the checkout UI. Does NOT consume the code.
export async function POST(req: Request) {
  const body = await req.json()
  const code = String(body.code || '').trim().toUpperCase()
  const subtotal = Number(body.subtotal) || 0
  const email = String(body.email || '').trim().toLowerCase()

  if (!code) return NextResponse.json({ valid: false, error: 'Enter a promo code' }, { status: 400 })

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('cf_promo_codes')
    .select('*')
    .eq('code', code)
    .maybeSingle()

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const promo = data as PromoCode | null
  const result = evaluatePromo(promo, subtotal, deliveryFee)

  if (!result.ok) return NextResponse.json({ valid: false, error: result.error })

  // First-time-customer codes: warn early if this email already has a paid order
  if (promo?.first_order_only && email) {
    const { data: cust } = await supabase
      .from('cf_customers')
      .select('id')
      .eq('email', email)
      .maybeSingle()
    if (cust) {
      const { count } = await supabase
        .from('cf_orders')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', cust.id)
        .eq('status', 'confirmed')
      if ((count || 0) > 0) {
        return NextResponse.json({ valid: false, error: 'This code is for first-time customers only' })
      }
    }
  }

  return NextResponse.json({
    valid: true,
    code,
    discount: result.discount,
    freeDelivery: result.freeDelivery,
    label: result.label,
  })
}
