'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import OrderStatusBadge from '@/components/OrderStatusBadge'

interface Stats {
  totalRevenue: number
  todayRevenue: number
  totalOrders: number
  pendingOrders: number
  confirmedOrders: number
  preparingOrders: number
  deliveredOrders: number
  customerCount: number
  productCount: number
  recentOrders: Array<{
    id: string
    total: number
    status: string
    created_at: string
    cf_customers?: { name: string; email: string }
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Loading dashboard...</div>
  if (!stats) return <div className="admin-empty">Failed to load stats</div>

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders.toString(), color: '#EC4899' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: '#10B981' },
    { label: 'Pending Orders', value: stats.pendingOrders.toString(), color: '#F59E0B' },
    { label: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(2)}`, color: '#6366F1' },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #FFE4EF',
            padding: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 32,
      }}>
        {[
          { label: 'Customers', value: stats.customerCount },
          { label: 'Products', value: stats.productCount },
          { label: 'Confirmed', value: stats.confirmedOrders },
          { label: 'Delivered', value: stats.deliveredOrders },
        ].map(s => (
          <div key={s.label} style={{
            background: '#FFF8FC',
            borderRadius: 12,
            padding: '14px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#4A3040' }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9C7A8E', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-section-header" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040' }}>Recent Orders</h3>
        <Link href="/admin/orders" style={{ fontSize: 13, fontWeight: 600, color: '#EC4899', textDecoration: 'none' }}>View All</Link>
      </div>

      {stats.recentOrders.length === 0 ? (
        <div className="admin-empty">No orders yet</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(o => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/orders?id=${o.id}`} style={{ color: '#EC4899', fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>
                      #{o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.cf_customers?.name || 'Guest'}</div>
                    <div className="admin-sub-text">{o.cf_customers?.email || ''}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#10B981' }}>${o.total.toFixed(2)}</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td className="admin-sub-text">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
