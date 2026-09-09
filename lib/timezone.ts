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
