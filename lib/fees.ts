// Payment-processor fees.
//
// PayPal takes a cut of every capture, so the money that lands in the account
// is less than the order total. The capture response reports the exact fee and
// we store it on the order (payment_fee). Orders captured before we started
// recording that — and any order whose capture response omitted it — fall back
// to PayPal's published US commercial rate so the P&L still costs them in.
//
// Override the fallback with PAYPAL_FEE_PERCENT / PAYPAL_FEE_FIXED if PayPal
// changes the rate or the account moves to a different pricing tier.

export const PAYPAL_FEE_PERCENT = Number(process.env.PAYPAL_FEE_PERCENT ?? '2.99')
export const PAYPAL_FEE_FIXED = Number(process.env.PAYPAL_FEE_FIXED ?? '0.49')

export function roundCents(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** PayPal's fee for a capture of `gross` USD, at the configured rate. */
export function estimatePayPalFee(gross: number): number {
  if (!gross || gross <= 0) return 0
  return roundCents(gross * (PAYPAL_FEE_PERCENT / 100) + PAYPAL_FEE_FIXED)
}

export interface FeeBearingOrder {
  total: number
  payment_fee?: number | null
}

/**
 * The processor fee for an order: the recorded one when we have it, otherwise
 * an estimate. `estimated` lets the UI mark numbers that aren't from PayPal.
 */
export function orderFee(order: FeeBearingOrder): { fee: number; estimated: boolean } {
  const recorded = order.payment_fee
  if (recorded !== null && recorded !== undefined && Number(recorded) > 0) {
    return { fee: roundCents(Number(recorded)), estimated: false }
  }
  return { fee: estimatePayPalFee(order.total), estimated: true }
}
