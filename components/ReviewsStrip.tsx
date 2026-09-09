'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  author_name: string
  rating: number
  title: string | null
  body: string | null
  created_at: string
  product_id: string
  product_title: string | null
}

// Approved reviews, shown above the footer on every page. Renders nothing at
// all until there's something to show, so a new shop never displays an empty
// "what our customers say" shell.
export default function ReviewsStrip() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/reviews?all=1&limit=8')
      .then(r => r.json())
      .then(d => setReviews(d.reviews || []))
      .catch(() => {})
  }, [])

  if (reviews.length === 0) return null

  const average = Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10

  return (
    <section style={{ background: '#FFF8FC', borderTop: '1px solid #FFE4EF', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 26, fontWeight: 700, color: '#4A3040', margin: '0 0 6px',
          }}>
            What our customers say
          </h2>
          <div style={{ fontSize: 14, color: '#9C7A8E' }}>
            <span style={{ color: '#F59E0B', letterSpacing: 1 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ color: n <= Math.round(average) ? '#F59E0B' : '#E5D3DC' }}>★</span>
              ))}
            </span>{' '}
            <strong style={{ color: '#4A3040' }}>{average.toFixed(1)}</strong> from real orders
          </div>
        </div>

        <div className="reviews-strip">
          {reviews.map(r => (
            <div key={r.id} style={{
              background: '#fff', border: '1px solid #FFE4EF', borderRadius: 14,
              padding: 18, display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ color: '#F59E0B', fontSize: 14, letterSpacing: 1 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} style={{ color: n <= r.rating ? '#F59E0B' : '#E5D3DC' }}>★</span>
                ))}
              </div>
              {r.title && <div style={{ fontSize: 14, fontWeight: 700, color: '#4A3040' }}>{r.title}</div>}
              {r.body && (
                <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.6, margin: 0 }}>
                  &ldquo;{r.body}&rdquo;
                </p>
              )}
              <div style={{ marginTop: 'auto', paddingTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3040' }}>{r.author_name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#F0FDF4', padding: '2px 8px', borderRadius: 50 }}>
                  Verified buyer
                </span>
              </div>
              {r.product_title && (
                <Link href={`/shop/${r.product_id}`} style={{ fontSize: 12, color: '#EC4899', textDecoration: 'none', fontWeight: 600 }}>
                  {r.product_title} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
