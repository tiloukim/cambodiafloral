'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Summary {
  orders: number
  subtotal: number
  discounts: number
  delivery: number
  gross: number
  fees: number
  cogs: number
  net: number
  margin: number
  estimatedFees: number
}

interface Line {
  id: string
  date: string
  customer: string
  status: string
  gross: number
  fee: number
  feeEstimated: boolean
  cogs: number
  net: number
}

interface PL {
  timeZoneLabel: string
  feeModel: { percent: number; fixed: number }
  periods: { today: Summary; month: Summary; year: Summary; all: Summary }
  months: (Summary & { month: string })[]
  lines: Line[]
  excluded: { pending: number; cancelled: number }
}

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'all', label: 'All Time' },
] as const

const money = (n: number) => `$${n.toFixed(2)}`

function StatementRow({ label, value, sign, strong, top }: {
  label: string
  value: number
  sign?: '+' | '-'
  strong?: boolean
  top?: boolean
}) {
  const color = sign === '-' ? '#EF4444' : strong ? '#4A3040' : '#4A3040'
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '9px 0',
      borderTop: top ? '1px solid #FFE4EF' : 'none',
      gap: 16,
    }}>
      <span style={{ fontSize: strong ? 14 : 13, fontWeight: strong ? 700 : 500, color: strong ? '#4A3040' : '#7A5A6A' }}>
        {label}
      </span>
      <span style={{
        fontSize: strong ? 16 : 13,
        fontWeight: strong ? 800 : 600,
        color,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}>
        {sign === '-' ? '−' : ''}{money(Math.abs(value))}
      </span>
    </div>
  )
}

export default function AdminPL() {
  const [data, setData] = useState<PL | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'today' | 'month' | 'year' | 'all'>('month')

  useEffect(() => {
    fetch('/api/pl')
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Loading P&amp;L...</div>
  if (!data) return <div className="admin-empty">Failed to load P&amp;L</div>

  const s = data.periods[period]
  const cards = [
    { label: 'Collected', value: money(s.gross), color: '#4A3040', hint: `${s.orders} paid order${s.orders === 1 ? '' : 's'}` },
    { label: 'PayPal Fees', value: `−${money(s.fees)}`, color: '#EF4444', hint: `${data.feeModel.percent}% + $${data.feeModel.fixed.toFixed(2)}` },
    { label: 'Cost of Goods', value: `−${money(s.cogs)}`, color: '#EF4444', hint: 'from product cost' },
    { label: 'Net Profit', value: money(s.net), color: s.net >= 0 ? '#10B981' : '#EF4444', hint: `${s.margin.toFixed(1)}% margin` },
  ]

  return (
    <div>
      {/* Period picker */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid ' + (period === p.key ? '#EC4899' : '#FFD6E8'),
              background: period === p.key ? '#EC4899' : '#fff',
              color: period === p.key ? '#fff' : '#9C7A8E',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Headline numbers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #FFE4EF', padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
            <div style={{ fontSize: 11, color: '#C9A0B4', marginTop: 4 }}>{c.hint}</div>
          </div>
        ))}
      </div>

      {/* The statement */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #FFE4EF', padding: '18px 22px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>
            Profit &amp; Loss &middot; {PERIODS.find(p => p.key === period)?.label}
          </h3>
          <StatementRow label="Product sales" value={s.subtotal} />
          <StatementRow label="Delivery charged" value={s.delivery} />
          {s.discounts > 0 && <StatementRow label="Promo discounts" value={s.discounts} sign="-" />}
          <StatementRow label="Collected from customers" value={s.gross} strong top />
          <StatementRow label="PayPal fees" value={s.fees} sign="-" />
          <StatementRow label="Cash received" value={Number((s.gross - s.fees).toFixed(2))} strong top />
          <StatementRow label="Cost of goods sold" value={s.cogs} sign="-" />
          <StatementRow label="Net profit" value={s.net} strong top />
        </div>

        <div style={{ background: '#FFF8FC', borderRadius: 14, border: '1px solid #FFE4EF', padding: '18px 22px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#4A3040', marginBottom: 10 }}>What&apos;s counted</h3>
          <ul style={{ fontSize: 13, color: '#7A5A6A', lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
            <li>Only paid orders — confirmed through delivered.</li>
            <li>
              Excluded: {data.excluded.pending} pending (never captured), {data.excluded.cancelled} cancelled.
            </li>
            <li>
              {s.estimatedFees > 0
                ? `${s.estimatedFees} of ${s.orders} fees are estimated at ${data.feeModel.percent}% + $${data.feeModel.fixed.toFixed(2)} — orders captured before fee recording started.`
                : 'All fees are the exact amounts PayPal reported.'}
            </li>
            <li>Delivery cost (driver, fuel) isn&apos;t tracked yet, so it isn&apos;t deducted.</li>
            <li>Today / month / year follow the shop&apos;s calendar in {data.timeZoneLabel}.</li>
          </ul>
        </div>
      </div>

      {/* By month */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 12 }}>By Month</h3>
      {data.months.length === 0 ? (
        <div className="admin-empty">No paid orders yet</div>
      ) : (
        <div className="admin-table-wrap" style={{ marginBottom: 32 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Collected</th>
                <th>PayPal Fees</th>
                <th>COGS</th>
                <th>Net Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {data.months.map(m => (
                <tr key={m.month}>
                  <td style={{ fontWeight: 600 }}>
                    {new Date(`${m.month}-01T00:00:00Z`).toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                  </td>
                  <td>{m.orders}</td>
                  <td style={{ fontWeight: 600 }}>{money(m.gross)}</td>
                  <td style={{ color: '#EF4444' }}>{'−'}{money(m.fees)}</td>
                  <td style={{ color: '#EF4444' }}>{'−'}{money(m.cogs)}</td>
                  <td style={{ fontWeight: 700, color: m.net >= 0 ? '#10B981' : '#EF4444' }}>{money(m.net)}</td>
                  <td className="admin-sub-text">{m.margin.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Per order */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 12 }}>Order Breakdown</h3>
      {data.lines.length === 0 ? (
        <div className="admin-empty">No paid orders yet</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Collected</th>
                <th>PayPal Fee</th>
                <th>COGS</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map(l => (
                <tr key={l.id}>
                  <td>
                    <Link href={`/track?order=${l.id}`} target="_blank" style={{ fontWeight: 600, fontSize: 13, color: '#EC4899', textDecoration: 'none' }}>
                      #{l.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="admin-sub-text">{new Date(l.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{l.customer}</td>
                  <td style={{ fontWeight: 600 }}>{money(l.gross)}</td>
                  <td style={{ color: '#EF4444' }}>
                    {'−'}{money(l.fee)}
                    {l.feeEstimated && (
                      <span title="Estimated — PayPal's reported fee wasn't recorded for this order" style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#B08AA0', background: '#FFF0F5', padding: '1px 6px', borderRadius: 50 }}>
                        est
                      </span>
                    )}
                  </td>
                  <td style={{ color: '#EF4444' }}>{'−'}{money(l.cogs)}</td>
                  <td style={{ fontWeight: 700, color: l.net >= 0 ? '#10B981' : '#EF4444' }}>{money(l.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
