'use client'

import { useState, useEffect, useCallback } from 'react'

interface Review {
  id: string
  product_id: string
  author_name: string
  rating: number
  title: string | null
  body: string | null
  approved: boolean
  created_at: string
  cf_products?: { title: string }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/reviews?admin=1')
    if (res.ok) setReviews(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const toggle = async (r: Review) => {
    await fetch(`/api/reviews/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: !r.approved }),
    })
    load()
  }

  const remove = async (r: Review) => {
    if (!confirm('Delete this review permanently?')) return
    await fetch(`/api/reviews/${r.id}`, { method: 'DELETE' })
    load()
  }

  const stars = (n: number) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n)

  // Pending first: these are the ones waiting on a decision.
  const sorted = [...reviews].sort((a, b) =>
    a.approved === b.approved
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : (a.approved ? 1 : -1),
  )
  const pending = reviews.filter(r => !r.approved).length

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', margin: 0 }}>Product Reviews</h2>
        {pending > 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '3px 10px', borderRadius: 50 }}>
            {pending} awaiting approval
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#9C7A8E', marginTop: -8, marginBottom: 16 }}>
        New reviews stay hidden until you approve them — nothing reaches a product page unread.
      </p>
      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty">No reviews yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sorted.map(r => (
            <div key={r.id} style={{ border: '1px solid #FFE4EF', borderRadius: 12, padding: 16, opacity: r.approved ? 1 : 0.55 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: '#F59E0B', fontSize: 15 }}>{stars(r.rating)}</span>
                  <strong style={{ color: '#4A3040', fontSize: 14 }}>{r.author_name}</strong>
                  <span className="admin-sub-text">on {r.cf_products?.title || 'product'}</span>
                  {!r.approved && <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '2px 8px', borderRadius: 50 }}>Pending approval</span>}
                </div>
                <span className="admin-sub-text">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.title && <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>{r.title}</div>}
              {r.body && <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.6, margin: '4px 0 10px' }}>{r.body}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggle(r)} style={{
                  background: r.approved ? 'none' : '#EC4899',
                  border: r.approved ? '1px solid #FFD6E8' : 'none',
                  color: r.approved ? '#9C7A8E' : '#fff',
                  fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                }}>
                  {r.approved ? 'Hide' : 'Approve & publish'}
                </button>
                <button onClick={() => remove(r)} style={{ background: 'none', border: '1px solid #FECACA', color: '#DC2626', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
