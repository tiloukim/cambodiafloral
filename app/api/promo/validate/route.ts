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

  if (!code) return NextResponse.json({ valid: false, error: 'Enter a promo code' }, { status: 400 })

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('cf_promo_codes')
    .select('*')
    .eq('code', code)
    .maybeSingle()

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const result = evaluatePromo(data as PromoCode | null, subtotal, deliveryFee)

  if (!result.ok) return NextResponse.json({ valid: false, error: result.error })

  return NextResponse.json({
    valid: true,
    code,
    discount: result.discount,
    freeDelivery: result.freeDelivery,
    label: result.label,
  })
}
