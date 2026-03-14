'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
    }
  }
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const renderCaptcha = useCallback(() => {
    if (window.turnstile && captchaRef.current && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(captchaRef.current, {
        sitekey: '0x4AAAAAACq7DsjA4vjgSMuc',
        callback: (token: string) => setCaptchaToken(token),
        'expired-callback': () => setCaptchaToken(''),
        theme: 'light',
      })
    }
  }, [])

  useEffect(() => {
    renderCaptcha()
  }, [renderCaptcha])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontSize: 14,
    border: '1px solid #FFD6E8',
    borderRadius: 10,
    outline: 'none',
    fontFamily: 'inherit',
    color: '#4A3040',
    background: '#fff',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#4A3040',
    marginBottom: 6,
    display: 'block',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.')
      return
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message.')
        return
      }
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EF 50%, #FECDD3 100%)',
        padding: 'clamp(48px, 8vw, 80px) 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 12,
        }}>
          Contact Us
        </h1>
        <p style={{ fontSize: 16, color: '#7A5A6A', maxWidth: 500, margin: '0 auto' }}>
          Have a question or special request? We&apos;d love to hear from you.
        </p>
      </section>

      <section style={{ maxWidth: 560, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #FFE4EF',
          borderRadius: 16,
          padding: 'clamp(24px, 4vw, 40px)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#FFF0F5', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 16px', fontSize: 28,
              }}>
                ✓
              </div>
              <h2 style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 24, fontWeight: 700, color: '#4A3040', marginBottom: 8,
              }}>
                Thank You!
              </h2>
              <p style={{ fontSize: 14, color: '#9C7A8E', marginBottom: 24 }}>
                We&apos;ve received your message and will get back to you within 24 hours.
              </p>
              <Link href="/" style={{
                display: 'inline-block', background: '#EC4899', color: '#fff',
                padding: '12px 28px', borderRadius: 50, fontSize: 14,
                fontWeight: 700, textDecoration: 'none',
              }}>
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Select a topic</option>
                  <option value="order">Order Inquiry</option>
                  <option value="delivery">Delivery Question</option>
                  <option value="custom">Custom Arrangement</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div ref={captchaRef} />
              </div>

              {error && (
                <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 14 }}>{error}</p>
              )}

              <button type="submit" style={{
                width: '100%',
                padding: '14px',
                background: '#EC4899',
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}>
                Send Message
              </button>
            </form>
          )}

          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: '1px solid #FFE4EF',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>📧</span>
              <span style={{ fontSize: 14, color: '#7A5A6A' }}>support@cambodiafloral.com</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <span style={{ fontSize: 14, color: '#7A5A6A' }}>Phnom Penh, Cambodia</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onLoad={renderCaptcha}
      />
    </div>
  )
}
