import type { SupabaseClient } from '@supabase/supabase-js'

// Completing the "how did you find us?" survey earns a discount on the next
// order. One per customer, ever — the grant is recorded on cf_customers, and
// the code itself is an ordinary single-use promo code.

export const REWARD_PERCENT = 5
export const REWARD_VALID_DAYS = 90

// No 0/O/1/I: these get read off a screen and typed into a form by hand.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  let out = ''
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length]
  return `THANKS5-${out}`
}

export interface RewardGrant {
  code: string
  /** False when the customer had already been rewarded and this is their existing code. */
  isNew: boolean
  expiresAt: string
}

/**
 * Give a customer their survey reward, or hand back the one they already have.
 * Safe to call repeatedly and concurrently: the write that marks the customer
 * is conditional on them not already having a code, so exactly one grant wins.
 */
export async function grantSurveyReward(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  customerId: string,
): Promise<RewardGrant | null> {
  const { data: customer } = await supabase
    .from('cf_customers')
    .select('id, survey_reward_code')
    .eq('id', customerId)
    .maybeSingle()

  if (!customer) return null

  if (customer.survey_reward_code) {
    const { data: existing } = await supabase
      .from('cf_promo_codes')
      .select('code, expires_at')
      .eq('code', customer.survey_reward_code)
      .maybeSingle()
    return {
      code: customer.survey_reward_code,
      isNew: false,
      expiresAt: existing?.expires_at || '',
    }
  }

  const expiresAt = new Date(Date.now() + REWARD_VALID_DAYS * 86400_000).toISOString()

  // Retry only for the vanishingly unlikely code collision.
  let code = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = randomCode()
    const { error } = await supabase.from('cf_promo_codes').insert({
      code: candidate,
      discount_type: 'percent',
      discount_value: REWARD_PERCENT,
      min_subtotal: 0,
      max_uses: 1,
      used_count: 0,
      expires_at: expiresAt,
      first_order_only: false,
      active: true,
    })
    if (!error) { code = candidate; break }
    if (!String(error.message).toLowerCase().includes('duplicate')) {
      console.error('[rewards] could not create promo code:', error.message)
      return null
    }
  }
  if (!code) return null

  // Claim it for this customer, but only if nobody else already did. Two
  // concurrent survey submissions would otherwise mint two codes.
  const { data: claimed } = await supabase
    .from('cf_customers')
    .update({ survey_reward_code: code, survey_reward_at: new Date().toISOString() })
    .eq('id', customerId)
    .is('survey_reward_code', null)
    .select('id, survey_reward_code')

  if (!claimed || claimed.length === 0) {
    // Lost the race: retire the code we just made and return the winner's.
    await supabase.from('cf_promo_codes').update({ active: false }).eq('code', code)
    const { data: winner } = await supabase
      .from('cf_customers')
      .select('survey_reward_code')
      .eq('id', customerId)
      .maybeSingle()
    return winner?.survey_reward_code
      ? { code: winner.survey_reward_code, isNew: false, expiresAt: '' }
      : null
  }

  return { code, isNew: true, expiresAt }
}
