'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cart-context'

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>&#127881;</div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            marginBottom: 12,
          }}>
            Payment Successful!
          </h1>
          <p style={{ fontSize: 15, color: '#9C7A8E', lineHeight: 1.6, marginBottom: 24 }}>
            Thank you for your order! We&apos;ve received your payment and will begin preparing your beautiful flowers right away.
          </p>
          {orderId && (
            <p style={{ fontSize: 13, color: '#B8A0AE', marginBottom: 32 }}>
              Order ID: <strong>{orderId.slice(0, 8)}</strong>
            </p>
          )}
          <div style={{
            background: '#FFF8FC',
            border: '1px solid #FFE4EF',
            borderRadius: 12,
            padding: '14px 20px',
            marginBottom: 32,
            fontSize: 12,
            color: '#9C7A8E',
            lineHeight: 1.7,
          }}>
            <p>📋 The charge on your credit card statement will appear as a charge from <strong style={{ color: '#4A3040' }}>Kimco LLC</strong>.</p>
            <p style={{ marginTop: 4 }}>Cambodia Floral is managed by Kimco LLC.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {orderId && (
              <Link href={`/track?order=${orderId}`} style={{
                background: '#EC4899',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}>
                Track Order
              </Link>
            )}
            <Link href="/shop" style={{
              background: '#FFF0F5',
              color: '#EC4899',
              padding: '14px 28px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              border: '2px solid #FFD6E8',
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
