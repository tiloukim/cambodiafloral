'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'

const DELIVERY_FEE = 5
const CITIES = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville']

export default function CheckoutPage() {
  const router = useRouter()
  const { customer } = useAuth()
  const { items, total, clearCart } = useCart()

  const [senderName, setSenderName] = useState(customer?.name || '')
  const [senderEmail, setSenderEmail] = useState(customer?.email || '')
  const [senderPhone, setSenderPhone] = useState(customer?.phone || '')
  const [senderCountry, setSenderCountry] = useState(customer?.country || '')

  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [recipientCity, setRecipientCity] = useState('Phnom Penh')

  const [deliveryDate, setDeliveryDate] = useState('')
  const [cardMessage, setCardMessage] = useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: senderName,
          sender_email: senderEmail,
          sender_phone: senderPhone,
          sender_country: senderCountry,
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          recipient_address: recipientAddress,
          recipient_city: recipientCity,
          delivery_date: deliveryDate || null,
          card_message: cardMessage || null,
          items: items.map(i => ({
            product_id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.qty,
            image_url: i.img,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to place order')
        setSubmitting(false)
        return
      }

      const order = await res.json()
      clearCart()
      router.push(`/track?order=${order.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

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

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Sender Info */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Sender Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} required style={inputStyle} placeholder="John Smith" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} required style={inputStyle} placeholder="john@example.com" />
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Recipient Name *</label>
                    <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} required style={inputStyle} placeholder="Sophea Chan" />
                  </div>
                  <div>
                    <label style={labelStyle}>Recipient Phone *</label>
                    <input type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} required style={inputStyle} placeholder="+855 12 345 678" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Delivery Address *</label>
                    <input type="text" value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} required style={inputStyle} placeholder="Street 123, Sangkat Boeung Keng Kang" />
                  </div>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <select value={recipientCity} onChange={e => setRecipientCity(e.target.value)} required style={inputStyle}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Delivery Date</label>
                    <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
                  </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#7A5A6A' }}>
                  <span>Delivery Fee</span>
                  <span>${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px solid #FFE4EF', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#4A3040' }}>Total</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#DB2777' }}>${(total + DELIVERY_FEE).toFixed(2)}</span>
                </div>
              </div>

              {error && <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600, marginTop: 16 }}>{error}</div>}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  background: '#EC4899',
                  color: '#fff',
                  marginTop: 20,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
