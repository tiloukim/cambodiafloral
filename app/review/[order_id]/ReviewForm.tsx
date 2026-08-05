'use client'

import { useState } from 'react'

interface Item { product_id: string; title: string; image_url: string }

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 30, lineHeight: 1, color: n <= value ? '#F59E0B' : '#E5D3DC' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function ItemReview({ item, orderId, defaultAuthor, done }: { item: Item; orderId: string; defaultAuthor: string; done: boolean }) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState(defaultAuthor)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>(done ? 'saved' : 'idle')
  const [error, setError] = useState('')

  const submit = async () => {
    if (rating < 1) { setError('Please pick a star rating'); return }
    setState('saving'); setError('')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, product_id: item.product_id, rating, title, body, author_name: author }),
    })
    if (res.ok) setState('saved')
    else { const d = await res.json(); setError(d.error || 'Could not save review'); setState('error') }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '2px solid #FFD6E8', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image_url} alt={item.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: '#4A3040' }}>{item.title}</div>
      </div>

      {state === 'saved' ? (
        <div style={{ background: '#F0FDF4', color: '#065F46', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontWeight: 600 }}>
          ✓ Thank you — your review has been submitted!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Stars value={rating} onChange={setRating} />
          <input style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name (shown with the review)" />
          <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" />
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={body} onChange={e => setBody(e.target.value)} placeholder="Tell others what you thought…" />
          {error && <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600 }}>{error}</div>}
          <button onClick={submit} disabled={state === 'saving'} style={{ alignSelf: 'flex-start', background: '#EC4899', color: '#fff', padding: '10px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, border: 'none', cursor: state === 'saving' ? 'default' : 'pointer', opacity: state === 'saving' ? 0.6 : 1 }}>
            {state === 'saving' ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function ReviewForm({ orderId, items, reviewedProductIds, defaultAuthor }: { orderId: string; items: Item[]; reviewedProductIds: string[]; defaultAuthor: string }) {
  const reviewed = new Set(reviewedProductIds)
  return (
    <div>
      {items.map(item => (
        <ItemReview key={item.product_id} item={item} orderId={orderId} defaultAuthor={defaultAuthor} done={reviewed.has(item.product_id)} />
      ))}
    </div>
  )
}
