'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Anniversary',
  'Funeral / Sympathy',
  'Grand Opening',
  'Graduation',
  'Baby Shower',
  'Corporate Event',
  'Religious Ceremony',
  'Other',
]

const FLOWER_PREFERENCES = [
  'Roses',
  'Lilies',
  'Orchids',
  'Sunflowers',
  'Carnations',
  'Mixed / No Preference',
]

const COLOR_OPTIONS = [
  'Red',
  'Pink',
  'White',
  'Yellow',
  'Purple',
  'Orange',
  'Pastel Mix',
  'Bright / Vibrant',
  'No Preference',
]

const ARRANGEMENT_TYPES = [
  'Bouquet',
  'Basket',
  'Vase Arrangement',
  'Wreath',
  'Centerpiece',
  'Arch / Backdrop',
  'Stage Decoration',
  'Table Arrangements',
  'Gift Box',
  'Other',
]

const BUDGET_RANGES = [
  'Under $30',
  '$30 - $50',
  '$50 - $100',
  '$100 - $200',
  '$200 - $500',
  '$500+',
  'Not sure - need consultation',
]

const CITIES = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Other']

export default function CustomOrderPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Contact info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Order details
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [arrangementType, setArrangementType] = useState('')
  const [flowerPreference, setFlowerPreference] = useState('')
  const [colorPreference, setColorPreference] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [description, setDescription] = useState('')

  // Delivery
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('Phnom Penh')
  const [deliveryTime, setDeliveryTime] = useState('')

  // Reference images
  const [refImages, setRefImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleColor = (c: string) => {
    setColorPreference(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('prefix', 'custom-orders')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const { url } = await res.json()
          setRefImages(prev => [...prev, url])
        }
      } catch { /* ignore */ }
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/custom-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          event_type: eventType,
          event_date: eventDate || null,
          arrangement_type: arrangementType,
          flower_preference: flowerPreference,
          color_preference: colorPreference,
          budget,
          quantity: parseInt(quantity) || 1,
          description,
          recipient_name: recipientName || null,
          recipient_phone: recipientPhone || null,
          delivery_address: deliveryAddress || null,
          delivery_city: deliveryCity,
          delivery_time: deliveryTime || null,
          reference_images: refImages,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to submit request')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
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

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ textAlign: 'center', maxWidth: 500 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>💐</div>
            <h1 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 32,
              fontWeight: 700,
              color: '#4A3040',
              marginBottom: 12,
            }}>
              Request Submitted!
            </h1>
            <p style={{ color: '#7A5A6A', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Thank you for your custom order request. Our florist team will review your details and contact you within 24 hours with a quote and design options.
            </p>
            <p style={{ color: '#9C7A8E', fontSize: 14, marginBottom: 32 }}>
              We&apos;ll reach out to you at <strong>{email}</strong>
            </p>
            <a href="/shop" style={{
              display: 'inline-block',
              background: '#EC4899',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Continue Shopping
            </a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF0F5, #FFE4EF)',
        padding: '48px 20px 36px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 36,
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 8,
        }}>
          Custom Order Request
        </h1>
        <p style={{ color: '#9C7A8E', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
          Tell us exactly what you need and our expert florists will create the perfect arrangement for your special occasion.
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Contact Information */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Your Contact Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Your full name" />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Phone / WhatsApp</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="+855 12 345 678" />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Order Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Event / Occasion *</label>
                <select value={eventType} onChange={e => setEventType(e.target.value)} required style={inputStyle}>
                  <option value="">Select occasion...</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Event Date</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label style={labelStyle}>Arrangement Type *</label>
                <select value={arrangementType} onChange={e => setArrangementType(e.target.value)} required style={inputStyle}>
                  <option value="">Select type...</option>
                  {ARRANGEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Flower Preference</label>
                <select value={flowerPreference} onChange={e => setFlowerPreference(e.target.value)} style={inputStyle}>
                  <option value="">Select flowers...</option>
                  {FLOWER_PREFERENCES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Budget Range *</label>
                <select value={budget} onChange={e => setBudget(e.target.value)} required style={inputStyle}>
                  <option value="">Select budget...</option>
                  {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Color Preferences */}
            <div style={{ marginTop: 20 }}>
              <label style={labelStyle}>Preferred Colors (select multiple)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleColor(c)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 50,
                      fontSize: 13,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: colorPreference.includes(c) ? '#EC4899' : '#FFF0F5',
                      color: colorPreference.includes(c) ? '#fff' : '#9C7A8E',
                      transition: 'all .2s',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: 20 }}>
              <label style={labelStyle}>Describe What You Have in Mind *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
                placeholder="Please describe your ideal arrangement - style, size, any special requests, theme, additional items (chocolates, balloons, stuffed animals), etc."
              />
            </div>

            {/* Reference Images */}
            <div style={{ marginTop: 20 }}>
              <label style={labelStyle}>Reference Images (optional)</label>
              <p style={{ fontSize: 12, color: '#C9A0B4', marginBottom: 10 }}>
                Upload photos of arrangements you like for inspiration
              </p>
              {refImages.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {refImages.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 10, overflow: 'hidden' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <button type="button" onClick={() => setRefImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>&times;</button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFileUpload} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  background: '#FFF8FC',
                  textAlign: 'center',
                  color: uploading ? '#C9A0B4' : '#9C7A8E',
                  fontWeight: 600,
                }}
              >
                {uploading ? 'Uploading...' : '+ Upload Reference Images'}
              </button>
            </div>
          </div>

          {/* Delivery Details */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>Delivery Details</h2>
            <p style={{ fontSize: 13, color: '#C9A0B4', marginBottom: 20 }}>Leave blank if you&apos;ll pick up in person</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Recipient Name</label>
                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} style={inputStyle} placeholder="Who will receive this?" />
              </div>
              <div>
                <label style={labelStyle}>Recipient Phone</label>
                <input type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} style={inputStyle} placeholder="+855 12 345 678" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Delivery Address</label>
                <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} style={inputStyle} placeholder="Street address, building, floor..." />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <select value={deliveryCity} onChange={e => setDeliveryCity(e.target.value)} style={inputStyle}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Preferred Delivery Time</label>
                <select value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} style={inputStyle}>
                  <option value="">Any time</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 8PM)</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div style={{ color: '#DC2626', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{error}</div>}

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
              opacity: submitting ? 0.7 : 1,
              transition: 'background .2s',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Custom Order Request'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#C9A0B4' }}>
            Our team will contact you within 24 hours with a quote. No payment required now.
          </p>
        </form>
      </div>

      <Footer />
    </div>
  )
}
