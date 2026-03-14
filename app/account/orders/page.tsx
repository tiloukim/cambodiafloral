'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import type { Order } from '@/lib/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrders(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Link href="/account" style={{ color: '#9C7A8E', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>&larr; Account</Link>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#4A3040',
          }}>
            My Orders
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9C7A8E' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>No orders yet</h2>
            <p style={{ color: '#9C7A8E', marginBottom: 24 }}>Your flower orders will appear here</p>
            <Link href="/shop" style={{
              display: 'inline-block', background: '#EC4899', color: '#fff', padding: '12px 28px',
              borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>Shop Flowers</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <Link key={order.id} href={`/account/orders/${order.id}`} style={{
                display: 'block',
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #FFE4EF',
                padding: '20px 24px',
                textDecoration: 'none',
                transition: 'box-shadow .2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#4A3040' }}>Order #{order.id.slice(0, 8)}</div>
                    <div style={{ fontSize: 12, color: '#9C7A8E', marginTop: 4 }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: '#9C7A8E' }}>
                    To: {order.recipient_name} in {order.recipient_city}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#DB2777' }}>${order.total.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
