'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import type { Order } from '@/lib/types'

const TIMELINE_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

function TrackContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('order') || ''
  const [orderId, setOrderId] = useState(initialId)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleTrack(id?: string) {
    const trackId = (id || orderId).trim().replace(/^#/, '')
    if (!trackId) return
    setError('')
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/orders/${trackId}`)
      if (!res.ok) {
        setError('Order not found. Please check the order ID and try again.')
        setOrder(null)
      } else {
        const data = await res.json()
        setOrder(data)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setOrder(null)
    }
    setLoading(false)
  }

  const currentStep = order ? TIMELINE_STEPS.indexOf(order.status) : -1
  const isCancelled = order?.status === 'cancelled'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{
        background: 'linear-gradient(135deg, #FFF0F5, #FFE4EF)',
        padding: '48px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 8,
        }}>
          Track Your Order
        </h1>
        <p style={{ color: '#9C7A8E', fontSize: 15, marginBottom: 28 }}>Enter your order ID to check the delivery status</p>

        <div style={{
          display: 'flex',
          gap: 10,
          maxWidth: 500,
          margin: '0 auto',
        }}>
          <input
            type="text"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="Enter order ID..."
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 14,
              border: '2px solid #FFD6E8',
              fontSize: 15,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            style={{
              padding: '14px 28px',
              borderRadius: 14,
              background: '#EC4899',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px', flex: 1, width: '100%' }}>
        {error && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: '#EF4444', fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {!searched && !order && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9C7A8E' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p>Enter your order ID above to track your delivery</p>
          </div>
        )}

        {order && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#4A3040' }}>Order #{order.id.slice(0, 8)}</h2>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Timeline */}
            {!isCancelled && (
              <div style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #FFE4EF',
                padding: 28,
                marginBottom: 24,
              }}>
                <div className="timeline-row">
                  <div className="timeline-bar" style={{
                    position: 'absolute',
                    top: 16,
                    left: 24,
                    right: 24,
                    height: 3,
                    background: '#FFE4EF',
                    zIndex: 0,
                  }}>
                    <div style={{
                      height: '100%',
                      background: '#EC4899',
                      width: `${(Math.max(0, currentStep) / (TIMELINE_STEPS.length - 1)) * 100}%`,
                      borderRadius: 2,
                    }} />
                  </div>
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                      <div className="timeline-dot" style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: i <= currentStep ? '#EC4899' : '#FFE4EF',
                        color: i <= currentStep ? '#fff' : '#C9A0B4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}>
                        {i <= currentStep ? '✓' : i + 1}
                      </div>
                      <span className="timeline-step-label" style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: i <= currentStep ? '#EC4899' : '#C9A0B4',
                        textTransform: 'capitalize',
                        textAlign: 'center',
                        maxWidth: 80,
                      }}>
                        {step.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid-order-info">
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Recipient</h3>
                <div style={{ fontSize: 13, color: '#7A5A6A', lineHeight: 1.8 }}>
                  <div>{order.recipient_name}</div>
                  <div>{order.recipient_city}</div>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Order Info</h3>
                <div style={{ fontSize: 13, color: '#7A5A6A', lineHeight: 1.8 }}>
                  <div>Placed: {new Date(order.created_at).toLocaleDateString()}</div>
                  <div>Total: <span style={{ color: '#DB2777', fontWeight: 700 }}>${order.total.toFixed(2)}</span></div>
                  {order.delivery_date && <div>Delivery: {new Date(order.delivery_date).toLocaleDateString()}{order.delivery_time && ` (${order.delivery_time.startsWith('specific:') ? order.delivery_time.replace('specific:', '') : order.delivery_time})`}</div>}
                  {order.tracking_number && <div>Tracking: {order.tracking_number}</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-pink-400">Loading...</div>}>
      <TrackContent />
    </Suspense>
  )
}
