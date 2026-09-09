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
  const initialRating = Number(params.get('rating')) || 0
  const ratingFlow = initialRating >= 1 && initialRating <= 5

  const [saved, setSaved] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  // A link that names an order we don't have can never succeed, so it gets its
  // own dead end rather than a "try again" that would only fail identically.
  const [badLink, setBadLink] = useState(false)
  const [reward, setReward] = useState<{ code: string; isNew: boolean } | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [sendingFeedback, setSendingFeedback] = useState(false)
  const [consent, setConsent] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const [savedComment, setSavedComment] = useState('')
  const [savedRating, setSavedRating] = useState(0)
  // Set when one half is done and the other still stands between them and 5%.
  const [needsRating, setNeedsRating] = useState(false)
  const [needsSource, setNeedsSource] = useState(false)
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
        if (body.reward) setReward(body.reward)
        setNeedsRating(Boolean(body.needsRating))
      }
      else if (res.status === 404 || res.status === 400) setBadLink(true)
      else setError('Sorry, we could not save that. Please try again in a moment.')
    } catch {
      setError('Sorry, we could not save that. Please check your connection and try again.')
    }
    setSaving(false)
  }, [orderId])

  const sendFeedback = useCallback(async (stars: number, text: string, mayShare = false) => {
    if (!orderId || (!stars && !text.trim())) return
    setSendingFeedback(true)
    setFeedbackError('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          rating: stars || undefined,
          comment: text || undefined,
          consent: mayShare,
        }),
      })
      if (res.ok) {
        const body = await res.json().catch(() => ({}))
        if (body.reward) setReward(body.reward)
        setNeedsSource(Boolean(body.needsSource))
        if (!body.needsSource) setNeedsRating(false)
        setFeedbackSent(true)
        // Record exactly what the server now holds, so the form can tell the
        // difference between "saved" and "typed but not sent yet".
        setSavedComment(text.trim())
        setSavedRating(stars)
        setJustSaved(true)
      } else {
        const body = await res.json().catch(() => ({}))
        setFeedbackError(body.error || 'We could not save that. Please try again.')
      }
    } catch {
      setFeedbackError('We could not reach the server. Please check your connection.')
    }
    setSendingFeedback(false)
  }, [orderId])

  // Let the confirmation fade rather than sit there forever.
  useEffect(() => {
    if (!justSaved) return
    const t = setTimeout(() => setJustSaved(false), 3000)
    return () => clearTimeout(t)
  }, [justSaved])

  // Arriving from the email's one-click link records the answer immediately.
  useEffect(() => {
    if (initialSource && initialSource !== 'other') submit(initialSource)
  }, [initialSource, submit])

  // A star tapped in the delivered email is already an answer — record it.
  useEffect(() => {
    if (initialRating >= 1 && initialRating <= 5) {
      setRating(initialRating)
      sendFeedback(initialRating, '')
    }
  }, [initialRating, sendFeedback])

  // True when what's on screen differs from what the server confirmed.
  const unsaved = feedbackSent && (comment.trim() !== savedComment || rating !== savedRating)

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
        ) : (saved || ratingFlow) ? (
          <div style={card}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💗</div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 26, color: '#4A3040', marginBottom: 8 }}>Thank you!</h1>
            {saved ? (
              <p style={{ color: '#7A5A6A', fontSize: 15, lineHeight: 1.7 }}>
                You told us you found us through <strong style={{ color: '#EC4899' }}>{saved}</strong>.
                That genuinely helps a small shop like ours.
              </p>
            ) : (
              <p style={{ color: '#7A5A6A', fontSize: 15, lineHeight: 1.7 }}>
                Your rating is in. Anything you&apos;d like to add is below.
              </p>
            )}

            {/* Rated but never told us where they found us: still worth asking, and still worth 5%. */}
            {!saved && (
              <div style={{ marginTop: 20, background: '#FFF8FC', border: '1px dashed #EC4899', borderRadius: 12, padding: '16px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>Get 5% off your next order</div>
                <div style={{ fontSize: 13, color: '#9C7A8E', margin: '4px 0 12px' }}>Just tell us how you found us.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {SOURCES.filter(x => x.key !== 'other').map(x => (
                    <button
                      key={x.key}
                      disabled={saving}
                      onClick={() => submit(x.key)}
                      style={{
                        padding: '7px 13px', borderRadius: 50, border: '1px solid #FFD6E8',
                        background: '#fff', color: '#4A3040', fontSize: 13, fontWeight: 600,
                        cursor: saving ? 'wait' : 'pointer',
                      }}
                    >
                      {x.emoji} {x.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!reward && (needsRating || needsSource) && (
              <div style={{ margin: '22px 0 4px', background: '#FFF8FC', border: '1px dashed #EC4899', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>&#127873; One step from 5% off</div>
                <div style={{ fontSize: 13, color: '#7A5A6A', marginTop: 4, lineHeight: 1.6 }}>
                  {needsRating
                    ? 'Rate your order below and the discount is yours.'
                    : 'Tell us how you found us above and the discount is yours.'}
                </div>
              </div>
            )}
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
                  {reward.isNew ? "We've emailed it to you as well. " : 'You earned this earlier. '}
                  It&apos;s saved to your account and applies automatically at checkout.
                </div>
              </div>
            )}
            <div style={{ marginTop: 24, borderTop: '1px solid #FFE4EF', paddingTop: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#4A3040', marginBottom: 2, textAlign: 'center' }}>
                {feedbackSent ? 'Thanks for the feedback!' : 'How did we do?'}
              </div>
              <div style={{ fontSize: 13, color: '#9C7A8E', marginBottom: 12, textAlign: 'center' }}>
                {feedbackSent ? 'We read every one of these.' : 'Optional \u2014 but it helps us get better.'}
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => { setRating(n); sendFeedback(n, comment, consent) }}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      fontSize: 30, lineHeight: 1, color: n <= rating ? '#F59E0B' : '#E5D3DC',
                    }}
                  >
                    &#9733;
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Anything you'd like us to know? (optional)"
                maxLength={1000}
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #FFD6E8',
                  fontSize: 14, fontFamily: 'inherit', resize: 'vertical',
                }}
              />
              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  style={{ marginTop: 3, accentColor: '#EC4899', width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontSize: 12, color: '#7A5A6A', lineHeight: 1.6 }}>
                  Cambodia Floral may share this on their website, with my first name.
                  Leave unticked and it stays private &mdash; only the shop will see it.
                </span>
              </label>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <button
                  onClick={() => sendFeedback(rating, comment, consent)}
                  disabled={sendingFeedback || (!rating && !comment.trim())}
                  style={{
                    padding: '10px 24px', borderRadius: 50, border: 'none', fontSize: 14, fontWeight: 700,
                    background: (rating || comment.trim()) ? '#EC4899' : '#F3D9E6', color: '#fff',
                    cursor: (rating || comment.trim()) ? 'pointer' : 'not-allowed',
                  }}
                >
                  {sendingFeedback ? 'Saving…' : unsaved ? 'Save my feedback' : feedbackSent ? 'Update feedback' : 'Send feedback'}
                </button>

                {/* Every save says so. Silence used to be indistinguishable
                    from failure, which is exactly how this read as broken. */}
                <div style={{ minHeight: 20, marginTop: 8, fontSize: 12 }}>
                  {feedbackError
                    ? <span style={{ color: '#EF4444' }}>{feedbackError}</span>
                    : justSaved
                      ? <span style={{ color: '#059669', fontWeight: 700 }}>&#10003; Saved &mdash; thank you</span>
                      : unsaved
                        ? <span style={{ color: '#B08AA0' }}>You have unsaved changes</span>
                        : feedbackSent
                          ? <span style={{ color: '#9C7A8E' }}>Your feedback is saved.</span>
                          : null}
                </div>
              </div>
            </div>

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
