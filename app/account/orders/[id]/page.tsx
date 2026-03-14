'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import type { Order } from '@/lib/types'

const TIMELINE_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 100, color: '#9C7A8E' }}>Loading order...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 100 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4A3040' }}>Order not found</h2>
          <Link href="/account/orders" style={{ color: '#EC4899', fontWeight: 600, textDecoration: 'none', marginTop: 12, display: 'inline-block' }}>Back to orders</Link>
        </div>
      </div>
    )
  }

  const currentStep = TIMELINE_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <Link href="/account/orders" style={{ color: '#9C7A8E', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          &larr; Back to Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
          }}>
            Order #{order.id.slice(0, 8)}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Tracking Timeline */}
        {!isCancelled && (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #FFE4EF',
            padding: 28,
            marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 24 }}>Tracking</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Progress bar */}
              <div style={{
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
                  transition: 'width .5s',
                  borderRadius: 2,
                }} />
              </div>
              {TIMELINE_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <div style={{
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
                  <span style={{
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
            {order.tracking_number && (
              <div style={{ marginTop: 20, padding: '12px 16px', background: '#FFF8FC', borderRadius: 10, fontSize: 13, color: '#7A5A6A' }}>
                Tracking Number: <strong>{order.tracking_number}</strong>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Sender */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4A3040', marginBottom: 12 }}>Sender</h3>
            <div style={{ fontSize: 13, color: '#7A5A6A', lineHeight: 1.8 }}>
              <div>{order.sender_name}</div>
              <div>{order.sender_email}</div>
              {order.sender_phone && <div>{order.sender_phone}</div>}
            </div>
          </div>

          {/* Recipient */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4A3040', marginBottom: 12 }}>Recipient</h3>
            <div style={{ fontSize: 13, color: '#7A5A6A', lineHeight: 1.8 }}>
              <div>{order.recipient_name}</div>
              <div>{order.recipient_phone}</div>
              <div>{order.recipient_address}</div>
              <div>{order.recipient_city}</div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {order.delivery_date && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Delivery Date</h3>
              <div style={{ fontSize: 14, color: '#7A5A6A' }}>{new Date(order.delivery_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
          )}
          {order.card_message && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Card Message</h3>
              <div style={{ fontSize: 14, color: '#7A5A6A', fontStyle: 'italic' }}>&ldquo;{order.card_message}&rdquo;</div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 16 }}>Items</h3>
          {order.items?.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#4A3040' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#9C7A8E' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#DB2777' }}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #FFE4EF', marginTop: 12, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9C7A8E', marginBottom: 4 }}>
              <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9C7A8E', marginBottom: 8 }}>
              <span>Delivery Fee</span><span>${order.delivery_fee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700 }}>
              <span style={{ color: '#4A3040' }}>Total</span>
              <span style={{ color: '#DB2777' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
