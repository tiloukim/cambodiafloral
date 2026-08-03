export interface PromoCode {
  id: string
  code: string
  discount_type: 'percent' | 'fixed' | 'free_delivery'
  discount_value: number
  min_subtotal: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  active: boolean
  first_order_only: boolean
}

export interface PromoResult {
  ok: boolean
  error?: string
  discount: number      // amount off the subtotal, in USD
  freeDelivery: boolean
  label: string         // human summary, e.g. "10% off", "$5 off", "Free delivery"
}

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Evaluate a promo code against an order. Pure — no DB, no side effects.
 * Used both for the checkout preview and the authoritative server-side apply.
 */
export function evaluatePromo(promo: PromoCode | null, subtotal: number, deliveryFee: number): PromoResult {
  const fail = (error: string): PromoResult => ({ ok: false, error, discount: 0, freeDelivery: false, label: '' })

  if (!promo) return fail('Invalid promo code')
  if (!promo.active) return fail('This code is no longer active')
  if (promo.expires_at && new Date(promo.expires_at).getTime() < Date.now()) return fail('This code has expired')
  if (promo.max_uses != null && promo.used_count >= promo.max_uses) return fail('This code has already been used')
  if (subtotal < promo.min_subtotal) return fail(`Requires a minimum subtotal of $${Number(promo.min_subtotal).toFixed(2)}`)

  if (promo.discount_type === 'percent') {
    const pct = Math.max(0, Math.min(100, Number(promo.discount_value)))
    return { ok: true, discount: round2(subtotal * pct / 100), freeDelivery: false, label: `${pct}% off` }
  }
  if (promo.discount_type === 'fixed') {
    return { ok: true, discount: round2(Math.min(Number(promo.discount_value), subtotal)), freeDelivery: false, label: `$${Number(promo.discount_value).toFixed(2)} off` }
  }
  // free_delivery
  return { ok: true, discount: 0, freeDelivery: deliveryFee > 0, label: 'Free delivery' }
}
