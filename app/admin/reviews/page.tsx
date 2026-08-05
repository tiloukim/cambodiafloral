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

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 16 }}>Product Reviews</h2>
      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty">No reviews yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ border: '1px solid #FFE4EF', borderRadius: 12, padding: 16, opacity: r.approved ? 1 : 0.55 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: '#F59E0B', fontSize: 15 }}>{stars(r.rating)}</span>
                  <strong style={{ color: '#4A3040', fontSize: 14 }}>{r.author_name}</strong>
                  <span className="admin-sub-text">on {r.cf_products?.title || 'product'}</span>
                  {!r.approved && <span style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', background: '#FEE2E2', padding: '2px 8px', borderRadius: 50 }}>Hidden</span>}
                </div>
                <span className="admin-sub-text">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.title && <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>{r.title}</div>}
              {r.body && <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.6, margin: '4px 0 10px' }}>{r.body}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggle(r)} style={{ background: 'none', border: '1px solid #FFD6E8', color: '#9C7A8E', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>
                  {r.approved ? 'Hide' : 'Show'}
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
