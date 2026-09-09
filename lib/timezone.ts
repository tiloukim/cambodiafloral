// The shop runs on Cambodia time.
//
// Most senders order from abroad (the /send-flowers-from-usa traffic in
// particular), so "today" in their browser is routinely a different day than
// "today" in Phnom Penh — Cambodia is UTC+7, which is 11-12 hours ahead of the
// US. A delivery date only means something in the florist's local calendar, so
// every date the customer picks and every date the shop reads is resolved in
// this zone rather than in the browser's or the server's.

export const SHOP_TIME_ZONE = 'Asia/Phnom_Penh'
export const SHOP_TIME_ZONE_LABEL = 'Cambodia time (ICT)'

// Published policy, stated across the site: order before 2:00 PM Cambodia time
// for same-day delivery; after that the florist delivers the next morning.
export const SAME_DAY_CUTOFF_HOUR = 14
export const SAME_DAY_CUTOFF_LABEL = '2:00 PM'

// en-CA formats as YYYY-MM-DD, which is what <input type="date"> speaks.
const dateKeyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: SHOP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** The calendar date in Phnom Penh at the given instant, as YYYY-MM-DD. */
export function shopDateKey(instant: string | Date = new Date()): string {
  const d = typeof instant === 'string' ? new Date(instant) : instant
  if (Number.isNaN(d.getTime())) return ''
  return dateKeyFormat.format(d)
}

/** Today's date in Phnom Penh, as YYYY-MM-DD. */
export function shopToday(): string {
  return shopDateKey(new Date())
}

/** The current hour (0-23) in Phnom Penh. */
export function shopHour(instant: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: SHOP_TIME_ZONE, hour: '2-digit', hour12: false })
      .format(instant),
  )
}

/** "Wed, Sep 9, 2026" — a plain YYYY-MM-DD rendered for humans, no zone shift. */
export function formatShopDate(dateOnly: string): string {
  if (!dateOnly) return ''
  const d = new Date(`${dateOnly}T12:00:00Z`) // midday UTC: same calendar day everywhere
  if (Number.isNaN(d.getTime())) return dateOnly
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** Shift a plain YYYY-MM-DD by whole days. Midday UTC keeps the arithmetic clear of any offset. */
function addDays(dateOnly: string, days: number): string {
  const d = new Date(`${dateOnly}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Has the shop's same-day cutoff passed in Phnom Penh? */
export function isPastSameDayCutoff(instant: Date = new Date()): boolean {
  return shopHour(instant) >= SAME_DAY_CUTOFF_HOUR
}

/**
 * The earliest date the florist can deliver: today in Phnom Penh before the
 * 2PM cutoff, tomorrow after it.
 */
export function earliestDeliveryDate(instant: Date = new Date()): string {
  const today = shopDateKey(instant)
  return isPastSameDayCutoff(instant) ? addDays(today, 1) : today
}

/** The current time in Phnom Penh, e.g. "4:02 PM". */
export function shopTimeLabel(instant: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SHOP_TIME_ZONE, hour: 'numeric', minute: '2-digit',
  }).format(instant)
}
