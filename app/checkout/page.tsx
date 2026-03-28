'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Script from 'next/script'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'

const DELIVERY_FEE = 5
const FREE_DELIVERY_THRESHOLD = 100
const CITIES = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville']

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const { customer } = useAuth()
  const { items, total, clearCart } = useCart()
  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE

  const [senderName, setSenderName] = useState(customer?.name || '')
  const [senderEmail, setSenderEmail] = useState(customer?.email || '')
  const [senderPhone, setSenderPhone] = useState(customer?.phone || '')
  const [senderCountry, setSenderCountry] = useState(customer?.country || '')

  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [recipientCity, setRecipientCity] = useState('Phnom Penh')

  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [cardMessage, setCardMessage] = useState('')

  const searchParams = useSearchParams()
  const [error, setError] = useState(searchParams.get('cancelled') ? 'Payment was cancelled. You can try again.' : '')
  const [submitting, setSubmitting] = useState(false)
  const [paypalReady, setPaypalReady] = useState(false)
  const paypalRef = useRef<HTMLDivElement>(null)
  const paypalRendered = useRef(false)

  // Use refs so PayPal callbacks always read latest values (avoids stale closure)
  const formRef = useRef({
    senderName, senderEmail, senderPhone, senderCountry,
    recipientName, recipientPhone, recipientAddress, recipientCity,
    deliveryDate, deliveryTime, cardMessage, items,
  })
  formRef.current = {
    senderName, senderEmail, senderPhone, senderCountry,
    recipientName, recipientPhone, recipientAddress, recipientCity,
    deliveryDate, deliveryTime, cardMessage, items,
  }

  const clearCartRef = useRef(clearCart)
  clearCartRef.current = clearCart

  // Render PayPal buttons once when SDK is ready
  useEffect(() => {
    if (!paypalReady || !paypalRef.current || paypalRendered.current) return
    if (typeof window === 'undefined' || !(window as unknown as Record<string, unknown>).paypal) return

    paypalRendered.current = true
    const paypal = (window as unknown as Record<string, unknown>).paypal as {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void }
    }

    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 50,
      },
      createOrder: async () => {
        const f = formRef.current
        // Validate
        if (!f.senderName || !f.senderEmail || !f.recipientName || !f.recipientPhone || !f.recipientAddress || !f.recipientCity) {
          setError('Please fill in all required fields')
          throw new Error('Validation failed')
        }
        if (f.items.length === 0) {
          setError('Your cart is empty')
          throw new Error('Validation failed')
        }
        setError('')
        setSubmitting(true)

        const orderBody = {
          sender_name: f.senderName,
          sender_email: f.senderEmail,
          sender_phone: f.senderPhone,
          sender_country: f.senderCountry,
          recipient_name: f.recipientName,
          recipient_phone: f.recipientPhone,
          recipient_address: f.recipientAddress,
          recipient_city: f.recipientCity,
          delivery_date: f.deliveryDate || null,
          delivery_time: f.deliveryTime || null,
          card_message: f.cardMessage || null,
          payment_method: 'paypal',
          items: f.items.map(i => ({
            product_id: i.id,
            sku: i.sku || null,
            title: i.title,
            price: i.price,
            quantity: i.qty,
            image_url: i.img,
          })),
        }

        // Create order in our DB
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to create order')
          setSubmitting(false)
          throw new Error('Order creation failed')
        }

        const { order_id, total: orderTotal } = await res.json()

        // Create PayPal order
        const ppRes = await fetch('/api/paypal/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id, total: orderTotal }),
        })

        if (!ppRes.ok) {
          const ppErr = await ppRes.json()
          setError(ppErr.error || 'Failed to create PayPal payment')
          setSubmitting(false)
          throw new Error(ppErr.error || 'PayPal order creation failed')
        }

        const ppData = await ppRes.json()
        paypalRef.current?.setAttribute('data-order-id', order_id)
        return ppData.id
      },
      onApprove: async (data: { orderID: string }) => {
        const orderId = paypalRef.current?.getAttribute('data-order-id')

        const res = await fetch('/api/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paypal_order_id: data.orderID, order_id: orderId }),
        })

        if (res.ok) {
          clearCartRef.current()
          router.push(`/checkout/success?order=${orderId}`)
        } else {
          setError('Payment capture failed. Please contact support.')
          setSubmitting(false)
        }
      },
      onCancel: () => {
        setError('PayPal payment was cancelled.')
        setSubmitting(false)
      },
      onError: (err: unknown) => {
        console.error('PayPal error:', err)
        setError(`PayPal error: ${err instanceof Error ? err.message : String(err)}`)
        setSubmitting(false)
      },
    }).render(paypalRef.current!)
  }, [paypalReady, router])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #FFD6E8',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#9C7A8E',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Your cart is empty</h2>
            <p style={{ color: '#9C7A8E', marginBottom: 24 }}>Add some flowers before checking out</p>
            <button onClick={() => router.push('/shop')} style={{
              background: '#EC4899', color: '#fff', padding: '12px 28px', borderRadius: 50,
              fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
            }}>Shop Flowers</button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 32,
        }}>
          Checkout
        </h1>

        <div className="grid-checkout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Sender Info */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Sender Information</h2>
              <div className="grid-form-2col">
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} style={inputStyle} placeholder="John Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} style={inputStyle} placeholder="john@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} style={inputStyle} placeholder="+1 555-0123" />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input type="text" value={senderCountry} onChange={e => setSenderCountry(e.target.value)} style={inputStyle} placeholder="United States" />
                </div>
              </div>
            </div>

            {/* Recipient Info */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Recipient Information</h2>
              <div className="grid-form-2col">
                <div>
                  <label style={labelStyle}>Recipient Name *</label>
                  <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} style={inputStyle} placeholder="Sophea Chan" />
                </div>
                <div>
                  <label style={labelStyle}>Recipient Phone *</label>
                  <input type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} style={inputStyle} placeholder="+855 12 345 678" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Delivery Address *</label>
                  <input type="text" value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} style={inputStyle} placeholder="Street 123, Sangkat Boeung Keng Kang" />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <select value={recipientCity} onChange={e => setRecipientCity(e.target.value)} style={inputStyle}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={labelStyle}>Preferred Time</label>
                  <select value={deliveryTime.startsWith('specific') ? 'specific' : deliveryTime} onChange={e => setDeliveryTime(e.target.value)} style={inputStyle}>
                    <option value="">Any time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                    <option value="specific">Specific time...</option>
                  </select>
                </div>
                {deliveryTime.startsWith('specific') && (
                  <div>
                    <label style={labelStyle}>Specify Time</label>
                    <input type="time" value={deliveryTime.includes(':') ? deliveryTime.replace('specific:', '') : ''} onChange={e => setDeliveryTime(`specific:${e.target.value}`)} style={inputStyle} />
                  </div>
                )}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Card Message</label>
                  <textarea
                    value={cardMessage}
                    onChange={e => setCardMessage(e.target.value)}
                    style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                    placeholder="Write a personal message to include with the flowers..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #FFE4EF',
            padding: 24,
            position: 'sticky',
            top: 80,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Order Summary</h2>

            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#4A3040' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#9C7A8E' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #FFE4EF', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#7A5A6A' }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#7A5A6A' }}>
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span style={{ color: '#10B981', fontWeight: 600 }}>FREE</span>
                ) : (
                  <span>${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              {deliveryFee === 0 && (
                <div style={{ background: '#D1FAE5', color: '#065F46', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, marginBottom: 12, textAlign: 'center' }}>
                  🎉 Free delivery applied!
                </div>
              )}
              <div style={{ borderTop: '1px solid #FFE4EF', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#4A3040' }}>Total</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#DB2777' }}>${(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>

            {error && <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600, marginTop: 16 }}>{error}</div>}

            {/* PayPal Payment */}
            <div style={{ marginTop: 20 }}>
              {!paypalReady && (
                <div style={{ textAlign: 'center', padding: 16, color: '#C9A0B4', fontSize: 14 }}>
                  Loading payment...
                </div>
              )}
              <div ref={paypalRef} />
              {submitting && (
                <div style={{ textAlign: 'center', padding: 12, color: '#9C7A8E', fontSize: 14 }}>
                  Processing your payment...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
        onReady={() => setPaypalReady(true)}
      />
      <Footer />
    </div>
  )
}
