'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import type { Order } from '@/lib/types'

const STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
                  </td>
                  <td>
                    {o.items?.map((item, i) => (
                      <div key={i} style={{ fontSize: 12, lineHeight: 1.6 }}>
                        {item.sku && <span style={{ fontFamily: 'monospace', color: '#EC4899', fontWeight: 600 }}>[{item.sku}]</span>}{' '}
                        {item.title} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.recipient_name}</div>
                    <div className="admin-sub-text">{o.recipient_city}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#10B981' }}>${o.total.toFixed(2)}</td>
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
