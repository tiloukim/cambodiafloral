'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SOURCES, sourceLabel } from '@/lib/attribution'

export default function SurveyClient() {
  const params = useSearchParams()
  const orderId = params.get('order') || ''
  const initialSource = params.get('source') || ''

  const [saved, setSaved] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  // A link that names an order we don't have can never succeed, so it gets its
  // own dead end rather than a "try again" that would only fail identically.
  const [badLink, setBadLink] = useState(false)
  const [reward, setReward] = useState<{ code: string; isNew: boolean } | null>(null)
  const [detail, setDetail] = useState('')

  const submit = useCallback(async (source: string, detailText = '') => {
    if (!orderId || !source) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, source, detail: detailText }),
      })
      if (res.ok) {
        const body = await res.json().catch(() => ({}))
        setSaved(sourceLabel(source, detailText))
        setReward(body.reward || null)
      }
      else if (res.status === 404 || res.status === 400) setBadLink(true)
      else setError('Sorry, we could not save that. Please try again in a moment.')
    } catch {
      setError('Sorry, we could not save that. Please check your connection and try again.')
    }
    setSaving(false)
  }, [orderId])

  // Arriving from the email's one-click link records the answer immediately.
  useEffect(() => {
    if (initialSource && initialSource !== 'other') submit(initialSource)
  }, [initialSource, submit])

  const card: React.CSSProperties = {
    maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 16,
    border: '1px solid #FFE4EF', padding: 32, textAlign: 'center',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '48px 20px', width: '100%' }}>
        {!orderId || badLink ? (
          <div style={card}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 24, color: '#4A3040', marginBottom: 8 }}>
              We couldn&apos;t match this link to an order
            </h1>
            <p style={{ color: '#9C7A8E', fontSize: 14, lineHeight: 1.7 }}>
              {orderId
                ? 'The link may have been copied incompletely, or it came from a test message. Please use the buttons in your order confirmation email.'
                : 'This link is missing its order reference. Please use the buttons in your order confirmation email.'}
            </p>
            <div style={{ marginTop: 22 }}>
              <Link href="/shop" style={{ background: '#EC4899', color: '#fff', padding: '11px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Browse flowers</Link>
            </div>
          </div>
        ) : saved ? (
          <div style={card}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💗</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 26, color: '#4A3040', marginBottom: 8 }}>Thank you!</h1>
            <p style={{ color: '#7A5A6A', fontSize: 15, lineHeight: 1.7 }}>
              You told us you found us through <strong style={{ color: '#EC4899' }}>{saved}</strong>.
              That genuinely helps a small shop like ours.
            </p>
            {reward && (
              <div style={{ margin: '22px 0 4px', background: 'linear-gradient(135deg,#FFF0F5,#FFE4EF)', border: '1px solid #FFD6E8', borderRadius: 14, padding: '20px 18px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {reward.isNew ? 'Your thank-you gift' : 'Your thank-you code'}
                </div>
                <div style={{ fontSize: 14, color: '#7A5A6A', margin: '6px 0 12px' }}>5% off your next order</div>
                <div style={{ display: 'inline-block', background: '#fff', border: '2px dashed #EC4899', borderRadius: 10, padding: '10px 20px', fontFamily: 'monospace', fontSize: 19, fontWeight: 800, color: '#4A3040', letterSpacing: 2 }}>
                  {reward.code}
                </div>
                <div style={{ fontSize: 12, color: '#9C7A8E', marginTop: 10 }}>
                  {reward.isNew ? "We've emailed it to you as well. " : 'You earned this earlier. '}Enter it at checkout.
                </div>
              </div>
            )}
            <div style={{ marginTop: 22, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/track?order=${orderId}`} style={{ background: '#EC4899', color: '#fff', padding: '11px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Track your order</Link>
              <Link href="/shop" style={{ background: '#fff', color: '#EC4899', border: '1px solid #FFD6E8', padding: '11px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Keep browsing</Link>
            </div>
            <button
              onClick={() => { setSaved(null); setDetail('') }}
              style={{ marginTop: 18, background: 'none', border: 'none', color: '#C9A0B4', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
            >
              That&apos;s not right &mdash; change my answer
            </button>
          </div>
        ) : (
          <div style={card}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌷</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 24, color: '#4A3040', marginBottom: 6 }}>How did you find us?</h1>
            <p style={{ color: '#9C7A8E', fontSize: 14, marginBottom: 22 }}>One tap. It helps us know where to reach people like you.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {SOURCES.filter(s => s.key !== 'other').map(s => (
                <button
                  key={s.key}
                  disabled={saving}
                  onClick={() => submit(s.key)}
                  style={{
                    padding: '10px 18px', borderRadius: 50, border: '1px solid #FFD6E8',
                    background: '#fff', color: '#4A3040', fontSize: 14, fontWeight: 600,
                    cursor: saving ? 'wait' : 'pointer',
                  }}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                value={detail}
                onChange={e => setDetail(e.target.value)}
                placeholder="Somewhere else? Tell us where"
                maxLength={200}
                style={{ flex: '1 1 220px', maxWidth: 280, padding: '10px 14px', borderRadius: 10, border: '1px solid #FFD6E8', fontSize: 14 }}
              />
              <button
                disabled={saving || !detail.trim()}
                onClick={() => submit('other', detail.trim())}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none', background: detail.trim() ? '#EC4899' : '#F3D9E6',
                  color: '#fff', fontSize: 14, fontWeight: 700, cursor: detail.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Send
              </button>
            </div>
            {error && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 14 }}>{error}</p>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
