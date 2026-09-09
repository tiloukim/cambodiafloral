'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import type { Order } from '@/lib/types'
import { formatShopDate, SHOP_TIME_ZONE_LABEL } from '@/lib/timezone'
import { sourceLabel, sourceEmoji } from '@/lib/attribution'

const STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [requestingId, setRequestingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const url = statusFilter === 'all' ? '/api/orders?admin=1' : `/api/orders?admin=1&status=${statusFilter}`
      const res = await fetch(url)
      if (res.ok) setOrders(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchOrders()
    } catch { /* ignore */ }
    setUpdatingId(null)
  }

  const updateTracking = async (id: string) => {
    const tracking = trackingInputs[id]
    if (!tracking) return
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: tracking }),
      })
      setTrackingInputs(prev => ({ ...prev, [id]: '' }))
      fetchOrders()
    } catch { /* ignore */ }
  }

  const requestReview = async (o: Order) => {
    setRequestingId(o.id)
    try {
      const res = await fetch(`/api/orders/${o.id}/request-review`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      alert(res.ok ? `Review request sent to ${body.sentTo}` : (body.error || 'Could not send the request'))
      if (res.ok) fetchOrders()
    } catch {
      alert('Could not send the request')
    }
    setRequestingId(null)
  }

  const deleteOrder = async (id: string) => {
    if (!confirm(`Delete order #${id.slice(0, 8)}? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id))
      }
    } catch { /* ignore */ }
    setDeletingId(null)
  }

  if (loading) return <div className="admin-loading">Loading orders...</div>

  return (
    <div>
      {/* Status Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: statusFilter === s ? '#EC4899' : '#FFF0F5',
              color: statusFilter === s ? '#fff' : '#9C7A8E',
              textTransform: 'capitalize',
            }}
          >
            {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Recipient</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/track?order=${o.id}`} target="_blank" style={{ fontWeight: 600, fontSize: 13, color: '#EC4899', textDecoration: 'none' }}>#{o.id.slice(0, 8)}</Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.sender_name}</div>
                    <div className="admin-sub-text">{o.sender_email}</div>
                    {o.sender_phone && <div className="admin-sub-text">📞 {o.sender_phone}</div>}
                    {o.heard_from && (
                      <div style={{ fontSize: 11, color: '#7A5A6A', marginTop: 4, background: '#FFF8FC', border: '1px solid #FFE4EF', borderRadius: 50, padding: '2px 8px', display: 'inline-block' }}>
                        {sourceEmoji(o.heard_from)} {sourceLabel(o.heard_from, o.heard_from_detail)}
                      </div>
                    )}
                  </td>
                  <td>
                    {o.items?.map((item, i) => {
                      const line = (
                        <>
                          {item.sku && <span style={{ fontFamily: 'monospace', color: '#EC4899', fontWeight: 600 }}>[{item.sku}]</span>}{' '}
                          {item.title} x{item.quantity}
                        </>
                      )
                      // Link through to the product when we still know which one
                      // it was — product_id is nullable on older items.
                      return item.product_id ? (
                        <Link
                          key={i}
                          href={`/shop/${item.product_id}`}
                          target="_blank"
                          title={`Open ${item.title}`}
                          style={{ display: 'block', fontSize: 12, lineHeight: 1.6, color: '#4A3040', textDecoration: 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
                          onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
                        >
                          {line}
                        </Link>
                      ) : (
                        <div key={i} style={{ fontSize: 12, lineHeight: 1.6 }}>{line}</div>
                      )
                    })}
                    {o.card_message && (
                      <div style={{ fontSize: 11, color: '#9C7A8E', marginTop: 4, fontStyle: 'italic', background: '#FFF5F9', padding: '4px 8px', borderRadius: 6 }}>
                        💌 &quot;{o.card_message}&quot;
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.recipient_name}</div>
                    <div className="admin-sub-text">📞 {o.recipient_phone}</div>
                    <div className="admin-sub-text">📍 {o.recipient_address}</div>
                    <div className="admin-sub-text">{o.recipient_city}</div>
                    {o.delivery_date && (
                      <div style={{ fontSize: 11, color: '#EC4899', fontWeight: 600, marginTop: 4 }}>
                        📅 {formatShopDate(o.delivery_date)}{o.delivery_time ? ` @ ${o.delivery_time}` : ''} <span style={{ fontWeight: 500, color: '#9C7A8E' }}>({SHOP_TIME_ZONE_LABEL})</span>
                      </div>
                    )}
                    {o.delivery_notes && (
                      <div style={{ fontSize: 11, color: '#9C7A8E', marginTop: 2 }}>
                        📝 {o.delivery_notes}
                      </div>
                    )}
                  </td>
                  <td style={{ minWidth: 150 }}>
                    {/* What the customer paid, and what actually lands in the
                        account after PayPal takes its cut. */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, lineHeight: 1.5 }}>
                      <tbody>
                        <tr>
                          <td style={{ color: '#9C7A8E', padding: '1px 0' }}>Items</td>
                          <td style={{ textAlign: 'right', color: '#4A3040', padding: '1px 0' }}>${(o.subtotal ?? 0).toFixed(2)}</td>
                        </tr>
                        {(o.discount ?? 0) > 0 && (
                          <tr>
                            <td style={{ color: '#9C7A8E', padding: '1px 0' }}>
                              Discount{o.promo_code ? ` (${o.promo_code})` : ''}
                            </td>
                            <td style={{ textAlign: 'right', color: '#EF4444', padding: '1px 0' }}>−${(o.discount ?? 0).toFixed(2)}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ color: '#9C7A8E', padding: '1px 0' }}>Delivery</td>
                          <td style={{ textAlign: 'right', color: o.delivery_fee > 0 ? '#4A3040' : '#059669', padding: '1px 0' }}>
                            {o.delivery_fee > 0 ? `$${o.delivery_fee.toFixed(2)}` : 'Free'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, color: '#4A3040', borderTop: '1px solid #FFE4EF', padding: '3px 0 1px' }}>Paid</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 13, color: '#10B981', borderTop: '1px solid #FFE4EF', padding: '3px 0 1px' }}>
                            ${o.total.toFixed(2)}
                          </td>
                        </tr>
                        {o.payment_fee != null && (
                          <>
                            <tr>
                              <td style={{ color: '#9C7A8E', padding: '1px 0' }}>PayPal fee</td>
                              <td style={{ textAlign: 'right', color: '#EF4444', padding: '1px 0' }}>−${Number(o.payment_fee).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td style={{ color: '#9C7A8E', fontWeight: 600, padding: '1px 0' }}>You receive</td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669', padding: '1px 0' }}>
                                ${Number(o.payment_net ?? (o.total - Number(o.payment_fee))).toFixed(2)}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td>
                    {o.tracking_number ? (
                      <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{o.tracking_number}</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input
                          type="text"
                          value={trackingInputs[o.id] || ''}
                          onChange={e => setTrackingInputs(prev => ({ ...prev, [o.id]: e.target.value }))}
                          placeholder="Add #"
                          style={{ width: 80, padding: '3px 6px', fontSize: 11, border: '1px solid #FFD6E8', borderRadius: 4 }}
                        />
                        <button
                          onClick={() => updateTracking(o.id)}
                          style={{ padding: '3px 6px', fontSize: 10, fontWeight: 700, background: '#EC4899', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="admin-sub-text">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        style={{
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 600,
                          border: '1px solid #FFD6E8',
                          borderRadius: 6,
                          cursor: 'pointer',
                          background: '#FFF0F5',
                          color: '#4A3040',
                        }}
                      >
                        {STATUSES.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => requestReview(o)}
                        disabled={requestingId === o.id}
                        title={o.review_requested_at
                          ? `Review last requested ${new Date(o.review_requested_at).toLocaleDateString()} — click to ask again`
                          : 'Email this customer asking for a review'}
                        style={{
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          background: o.review_requested_at ? '#F0FDF4' : '#FFF0F5',
                          color: o.review_requested_at ? '#059669' : '#EC4899',
                          border: '1px solid ' + (o.review_requested_at ? '#BBF7D0' : '#FFD6E8'),
                          borderRadius: 6,
                          cursor: requestingId === o.id ? 'wait' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {requestingId === o.id ? '…' : o.review_requested_at ? '✓ asked' : '★ ask'}
                      </button>
                      <button
                        onClick={() => deleteOrder(o.id)}
                        disabled={deletingId === o.id}
                        title="Delete order"
                        style={{
                          padding: '4px 7px',
                          fontSize: 12,
                          fontWeight: 700,
                          background: deletingId === o.id ? '#ccc' : '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          borderRadius: 6,
                          cursor: deletingId === o.id ? 'not-allowed' : 'pointer',
                          lineHeight: 1,
                        }}
                      >
                        ✕
                      </button>
                    </div>
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
