'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { SOURCES, sourceLabel, sourceEmoji } from '@/lib/attribution'
import { formatShopDate } from '@/lib/timezone'

interface Row {
  id: string
  shopDate: string
  createdAt: string
  customer: string
  email: string
  total: number
  source: string | null
  detail: string | null
  answeredAt: string | null
  rating: number | null
  comment: string | null
  consent: boolean
  trafficSource: string | null
  referrerHost: string | null
  utmCampaign: string | null
  products: { id: string; title: string }[]
  published: { productId: string; approved: boolean }[]
}

interface Report {
  timeZoneLabel: string
  rows: Row[]
}

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'all', label: 'All Time' },
] as const

type PeriodKey = typeof PERIODS[number]['key']

/** RFC 4180: quote every field, double any embedded quote. */
function toCSV(rows: Row[]): string {
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = ['Order', 'Order date', 'Customer', 'Email', 'Order total (USD)', 'Said (survey)', 'Detail', 'Answered at', 'Came from (measured)', 'Referrer', 'Campaign', 'Rating', 'Feedback']
  const body = rows.map(r => [
    `#${r.id.slice(0, 8)}`,
    r.shopDate,
    r.customer,
    r.email,
    r.total.toFixed(2),
    r.source ? sourceLabel(r.source) : 'No answer',
    r.detail || '',
    r.answeredAt || '',
    r.trafficSource || '',
    r.referrerHost || '',
    r.utmCampaign || '',
    r.rating ?? '',
    r.comment || '',
  ].map(cell).join(','))
  return [header.map(cell).join(','), ...body].join('\r\n')
}

export default function AdminSurvey() {
  const [data, setData] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [pickProduct, setPickProduct] = useState<Record<string, string>>({})
  const [period, setPeriod] = useState<PeriodKey>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const reload = () => {
    fetch('/api/survey/report')
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d) })
      .catch(() => {})
  }

  const publish = async (row: Row) => {
    const productId = pickProduct[row.id] || row.products[0]?.id
    if (!productId) return
    setPublishing(row.id)
    try {
      const res = await fetch('/api/feedback/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: row.id, product_id: productId }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) alert(body.error || 'Could not publish this feedback')
      else reload()
    } catch {
      alert('Could not publish this feedback')
    }
    setPublishing(null)
  }

  useEffect(() => {
    fetch('/api/survey/report')
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const custom = Boolean(from || to)

  const filtered = useMemo(() => {
    if (!data) return []
    // A custom range wins over the quick periods; both compare plain
    // YYYY-MM-DD strings already resolved to the shop's calendar in Cambodia.
    if (custom) {
      return data.rows.filter(r => (!from || r.shopDate >= from) && (!to || r.shopDate <= to))
    }
    if (period === 'all') return data.rows
    // The server resolved every row to a Cambodia date; derive the current
    // period prefix the same way so the two can never disagree.
    const key = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date())
    const prefix = period === 'today' ? key : period === 'month' ? key.slice(0, 7) : key.slice(0, 4)
    return data.rows.filter(r => r.shopDate.startsWith(prefix))
  }, [data, period, from, to, custom])

  const answered = filtered.filter(r => r.source)
  const rated = filtered.filter(r => r.rating)
  const avgRating = rated.length
    ? rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length
    : 0

  const breakdown = useMemo(() => {
    return SOURCES.map(src => {
      const matching = answered.filter(r => r.source === src.key)
      return {
        ...src,
        orders: matching.length,
        revenue: Math.round(matching.reduce((s, r) => s + r.total, 0) * 100) / 100,
      }
    }).filter(b => b.orders > 0).sort((a, b) => b.revenue - a.revenue)
  }, [answered])

  const download = () => {
    const blob = new Blob([toCSV(filtered)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const scope = custom ? `${from || 'start'}_to_${to || 'today'}` : period
    a.href = url
    a.download = `cambodiafloral-survey-${scope}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="admin-loading">Loading survey report...</div>
  if (!data) return <div className="admin-empty">Failed to load survey report</div>

  const rate = filtered.length > 0 ? (answered.length / filtered.length) * 100 : 0

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => { setPeriod(p.key); setFrom(''); setTo('') }}
            style={{
              padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: '1px solid ' + (!custom && period === p.key ? '#EC4899' : '#FFD6E8'),
              background: !custom && period === p.key ? '#EC4899' : '#fff',
              color: !custom && period === p.key ? '#fff' : '#9C7A8E',
            }}
          >
            {p.label}
          </button>
        ))}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#9C7A8E', fontWeight: 600 }}>From</span>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #FFD6E8', fontSize: 13 }} />
          <span style={{ fontSize: 12, color: '#9C7A8E', fontWeight: 600 }}>to</span>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #FFD6E8', fontSize: 13 }} />
          {custom && (
            <button onClick={() => { setFrom(''); setTo('') }}
              style={{ background: 'none', border: 'none', color: '#EC4899', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              clear
            </button>
          )}
          <button
            onClick={download}
            disabled={filtered.length === 0}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700,
              background: filtered.length ? '#10B981' : '#D9E9E1', color: '#fff',
              cursor: filtered.length ? 'pointer' : 'not-allowed',
            }}
          >
            &#11015; Export CSV
          </button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#9C7A8E', marginBottom: 20 }}>
        {answered.length} of {filtered.length} paid orders answered
        {filtered.length > 0 && ` (${rate.toFixed(0)}%)`}
        {rated.length > 0 && (
          <> &middot; <strong style={{ color: '#F59E0B' }}>★ {avgRating.toFixed(1)}</strong> average from {rated.length} rating{rated.length === 1 ? '' : 's'}</>
        )}
        {' '}&middot; dates are {data.timeZoneLabel}
      </div>

      {/* Breakdown */}
      {breakdown.length === 0 ? (
        <div className="admin-empty" style={{ marginBottom: 28 }}>
          No answers in this period. Customers are asked at checkout and again in their confirmation email.
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #FFE4EF', borderRadius: 14, padding: 20, marginBottom: 28 }}>
          {breakdown.map(src => {
            const share = answered.length > 0 ? (src.orders / answered.length) * 100 : 0
            return (
              <div key={src.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5, gap: 12 }}>
                  <span style={{ fontWeight: 600, color: '#4A3040' }}>{src.emoji} {src.label}</span>
                  <span style={{ color: '#7A5A6A', whiteSpace: 'nowrap' }}>
                    {src.orders} order{src.orders === 1 ? '' : 's'} &middot; {share.toFixed(0)}% &middot; <strong style={{ color: '#10B981' }}>${src.revenue.toFixed(2)}</strong>
                  </span>
                </div>
                <div style={{ height: 8, background: '#FFF0F5', borderRadius: 50, overflow: 'hidden' }}>
                  <div style={{ width: `${share}%`, height: '100%', background: '#EC4899', borderRadius: 50 }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Responses */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 12 }}>Responses</h3>
      {filtered.length === 0 ? (
        <div className="admin-empty">No paid orders in this period</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Order total</th>
                <th>Said (survey)</th>
                <th>Came from (measured)</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/track?order=${r.id}`} target="_blank" style={{ fontWeight: 600, fontSize: 13, color: '#EC4899', textDecoration: 'none' }}>
                      #{r.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="admin-sub-text">{formatShopDate(r.shopDate)}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.customer}</div>
                    <div className="admin-sub-text">{r.email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${r.total.toFixed(2)}</td>
                  <td>
                    {r.source
                      ? <span style={{ fontSize: 13, color: '#4A3040' }}>{sourceEmoji(r.source)} {sourceLabel(r.source, r.detail)}</span>
                      : <span style={{ fontSize: 12, color: '#C9A0B4' }}>No answer</span>}
                  </td>
                  <td>
                    {r.trafficSource ? (
                      <div>
                        <span style={{ fontSize: 13, color: '#4A3040' }}>
                          {sourceEmoji(r.trafficSource)} {r.trafficSource === 'direct' ? 'Direct / typed in' : sourceLabel(r.trafficSource)}
                        </span>
                        {r.referrerHost && (
                          <div className="admin-sub-text" style={{ fontSize: 11 }}>{r.referrerHost}</div>
                        )}
                        {r.utmCampaign && (
                          <div style={{ fontSize: 10, color: '#EC4899', fontWeight: 700 }}>{r.utmCampaign}</div>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#C9A0B4' }}>&mdash;</span>
                    )}
                  </td>
                  <td>
                    {r.rating ? (
                      <div>
                        <span style={{ color: '#F59E0B', fontSize: 14, letterSpacing: 1 }}>
                          {'\u2605'.repeat(r.rating)}<span style={{ color: '#E5D3DC' }}>{'\u2605'.repeat(5 - r.rating)}</span>
                        </span>
                        {r.comment && (
                          <div style={{ fontSize: 12, color: '#7A5A6A', marginTop: 4, maxWidth: 280, fontStyle: 'italic' }}>
                            &ldquo;{r.comment}&rdquo;
                          </div>
                        )}
                      </div>
                    ) : r.comment ? (
                      <div style={{ fontSize: 12, color: '#7A5A6A', maxWidth: 280, fontStyle: 'italic' }}>&ldquo;{r.comment}&rdquo;</div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#C9A0B4' }}>&mdash;</span>
                    )}

                    {/* Publishing needs the customer's permission AND an admin's
                        deliberate action. Neither alone is enough. */}
                    {r.rating != null && (
                      r.published.length > 0 ? (
                        <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: '#059669', background: '#F0FDF4', padding: '2px 8px', borderRadius: 50, display: 'inline-block' }}>
                          ✓ Published to the site
                        </div>
                      ) : !r.consent ? (
                        <div style={{ marginTop: 6, fontSize: 11, color: '#C9A0B4' }}>
                          Private &mdash; customer didn&apos;t agree to share
                        </div>
                      ) : (
                        <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          {r.products.length > 1 && (
                            <select
                              value={pickProduct[r.id] || r.products[0]?.id || ''}
                              onChange={e => setPickProduct(p => ({ ...p, [r.id]: e.target.value }))}
                              style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid #FFD6E8', fontSize: 12, maxWidth: 170 }}
                            >
                              {r.products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                          )}
                          <button
                            onClick={() => publish(r)}
                            disabled={publishing === r.id || r.products.length === 0}
                            style={{
                              padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700,
                              background: '#EC4899', color: '#fff', cursor: 'pointer',
                            }}
                          >
                            {publishing === r.id ? 'Publishing…' : 'Approve & publish'}
                          </button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
