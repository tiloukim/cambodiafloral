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
      if (res.ok) setSaved(sourceLabel(source, detailText))
      else setError('Sorry, we could not save that. Please try again.')
    } catch {
      setError('Sorry, we could not save that. Please try again.')
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
        {!orderId ? (
          <div style={card}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 24, color: '#4A3040', marginBottom: 8 }}>Nothing to answer here</h1>
            <p style={{ color: '#9C7A8E', fontSize: 14 }}>This link is missing an order reference.</p>
          </div>
        ) : saved ? (
          <div style={card}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💗</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 26, color: '#4A3040', marginBottom: 8 }}>Thank you!</h1>
            <p style={{ color: '#7A5A6A', fontSize: 15, lineHeight: 1.7 }}>
              You told us you found us through <strong style={{ color: '#EC4899' }}>{saved}</strong>.
              That genuinely helps a small shop like ours.
            </p>
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
