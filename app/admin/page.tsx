'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import OrderStatusBadge from '@/components/OrderStatusBadge'

interface PeriodProfit {
  revenue: number
  cost: number
  profit: number
}

interface Stats {
  totalRevenue: number
  todayRevenue: number
  monthRevenue: number
  yearRevenue: number
  totalCost: number
  totalProfit: number
  todayProfit: PeriodProfit
  monthProfit: PeriodProfit
  yearProfit: PeriodProfit
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
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: '#10B981' },
    { label: 'Total Profit', value: `$${stats.totalProfit.toFixed(2)}`, color: stats.totalProfit >= 0 ? '#10B981' : '#EF4444' },
    { label: 'Pending Orders', value: stats.pendingOrders.toString(), color: '#F59E0B' },
  ]

  const profitMargin = stats.totalRevenue > 0 ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : '0'

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

      {/* Earnings Report */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 16 }}>💰 Earnings Report</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {/* Today */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #FFE4EF', padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Today</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#7A5A6A' }}>Revenue</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3040' }}>${stats.todayProfit.revenue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#7A5A6A' }}>Cost</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>-${stats.todayProfit.cost.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #FFE4EF', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>Profit</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: stats.todayProfit.profit >= 0 ? '#10B981' : '#EF4444' }}>
                ${stats.todayProfit.profit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* This Month */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #FFE4EF', padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>This Month</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#7A5A6A' }}>Revenue</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3040' }}>${stats.monthProfit.revenue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#7A5A6A' }}>Cost</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>-${stats.monthProfit.cost.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #FFE4EF', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>Profit</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: stats.monthProfit.profit >= 0 ? '#10B981' : '#EF4444' }}>
                ${stats.monthProfit.profit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* This Year */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #FFE4EF', padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>This Year</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#7A5A6A' }}>Revenue</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3040' }}>${stats.yearProfit.revenue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#7A5A6A' }}>Cost</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#EF4444' }}>-${stats.yearProfit.cost.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #FFE4EF', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>Profit</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: stats.yearProfit.profit >= 0 ? '#10B981' : '#EF4444' }}>
                ${stats.yearProfit.profit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Summary Bar */}
        <div style={{
          marginTop: 16,
          background: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)',
          borderRadius: 14,
          border: '1px solid #FFE4EF',
          padding: 20,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px' }}>All-Time Revenue</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#4A3040', marginTop: 4 }}>${stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px' }}>All-Time Cost</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#EF4444', marginTop: 4 }}>${stats.totalCost.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px' }}>All-Time Profit</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981', marginTop: 4 }}>${stats.totalProfit.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px' }}>Profit Margin</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#6366F1', marginTop: 4 }}>{profitMargin}%</div>
          </div>
        </div>
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
