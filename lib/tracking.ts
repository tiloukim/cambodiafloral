// First-touch traffic attribution.
//
// Recorded once, on the visitor's first page, and kept until they order. First
// touch rather than last: someone who finds the shop on Facebook, leaves, then
// returns by typing the address came from Facebook — crediting "direct" would
// hide the channel that actually did the work.
//
// Deliberately non-identifying: a referring host, a landing path and any UTM
// tags. No fingerprinting, nothing personal, and it never leaves the browser
// until the customer places an order.

const KEY = 'cf_attribution_v1'

export interface Attribution {
  referrer: string | null
  referrer_host: string | null
  landing_page: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  traffic_source: string
}

// Normalised to the same vocabulary as the survey, so "said Google" and
// "came from Google" can be compared without translating between two lists.
const HOSTS: [RegExp, string][] = [
  [/(^|\.)google\./i, 'google'],
  [/(^|\.)bing\.com$/i, 'google'],
  [/(^|\.)duckduckgo\.com$/i, 'google'],
  [/(^|\.)(facebook|fb)\./i, 'facebook'],
  [/(^|\.)instagram\.com$/i, 'instagram'],
  [/(^|\.)tiktok\.com$/i, 'tiktok'],
  // t.me has no subdomain, so it must match whole — an earlier pattern
  // requiring a trailing dot classified every Telegram click as "other".
  [/^t\.me$|(^|\.)telegram\./i, 'telegram'],
  [/(^|\.)youtube\.com$/i, 'other'],
  [/(^|\.)pinterest\./i, 'other'],
]

export function classify(host: string | null, utmSource: string | null): string {
  const utm = (utmSource || '').toLowerCase()
  if (utm) {
    if (utm.includes('google')) return 'google'
    if (utm.includes('facebook') || utm === 'fb') return 'facebook'
    if (utm.includes('instagram') || utm === 'ig') return 'instagram'
    if (utm.includes('tiktok')) return 'tiktok'
    if (utm.includes('telegram')) return 'telegram'
    return 'other'
  }
  if (!host) return 'direct'
  for (const [re, key] of HOSTS) if (re.test(host)) return key
  return 'other'
}

/** Record the first touch, if we haven't already. Safe to call on every page. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(KEY)) return // first touch wins

    const params = new URLSearchParams(window.location.search)
    const referrer = document.referrer || null

    // Internal navigation isn't a referral.
    let host: string | null = null
    if (referrer) {
      try {
        const h = new URL(referrer).hostname
        host = h === window.location.hostname ? null : h
      } catch { host = null }
    }

    const utm_source = params.get('utm_source')
    const data: Attribution = {
      referrer: host ? referrer : null,
      referrer_host: host,
      landing_page: window.location.pathname + (window.location.search || ''),
      utm_source,
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      traffic_source: classify(host, utm_source),
    }
    window.localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Private browsing, storage disabled — attribution is never worth an error.
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}
