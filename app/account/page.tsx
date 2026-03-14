'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import { useAuth } from '@/lib/auth-context'
import type { Order } from '@/lib/types'

export default function AccountPage() {
  const { customer, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrders(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 100, color: '#9C7A8E' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 32,
        }}>
          My Account
        </h1>

        {/* Profile Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #FFE4EF',
          padding: 24,
          marginBottom: 32,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 16 }}>Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Name</div>
              <div style={{ fontSize: 15, color: '#4A3040', fontWeight: 500 }}>{customer?.name || '--'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 15, color: '#4A3040', fontWeight: 500 }}>{customer?.email || '--'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Phone</div>
              <div style={{ fontSize: 15, color: '#4A3040', fontWeight: 500 }}>{customer?.phone || '--'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Country</div>
              <div style={{ fontSize: 15, color: '#4A3040', fontWeight: 500 }}>{customer?.country || '--'}</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #FFE4EF',
          padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040' }}>Recent Orders</h2>
            <Link href="/account/orders" style={{ fontSize: 13, fontWeight: 600, color: '#EC4899', textDecoration: 'none' }}>View All</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#9C7A8E' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#9C7A8E' }}>
              <p>No orders yet.</p>
              <Link href="/shop" style={{ color: '#EC4899', fontWeight: 600, textDecoration: 'none' }}>Start shopping</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.slice(0, 5).map(order => (
                <Link key={order.id} href={`/account/orders/${order.id}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#FFF8FC',
                  borderRadius: 12,
                  textDecoration: 'none',
                  border: '1px solid #FFF0F5',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#4A3040' }}>
                      Order #{order.id.slice(0, 8)}
                    </div>
                    <div style={{ fontSize: 12, color: '#9C7A8E', marginTop: 2 }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#DB2777' }}>${order.total.toFixed(2)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
