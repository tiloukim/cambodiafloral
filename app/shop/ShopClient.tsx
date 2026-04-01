'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

const CATEGORIES = ['All', 'Bouquets', 'Arrangements', 'Baskets', 'Wedding', 'Sympathy', 'Plants', 'Cakes', 'Gifts']

function ShopContent({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  const initialOccasion = searchParams.get('occasion') || ''

  const [category, setCategory] = useState(initialCategory)
  const [occasion] = useState(initialOccasion)

  const filtered = products.filter(p => {
    if (category !== 'All' && p.category.toLowerCase() !== category.toLowerCase()) return false
    if (occasion && p.occasion?.toLowerCase() !== occasion.toLowerCase()) return false
    return true
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

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
          {occasion ? `${occasion} Flowers` : 'Our Flower Collection'}
        </h1>
        <p style={{ color: '#9C7A8E', fontSize: 15 }}>
          Fresh flowers hand-delivered across Cambodia
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', flex: 1, width: '100%' }}>
        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '8px 20px',
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: category === c ? '#EC4899' : '#FFF0F5',
                color: category === c ? '#fff' : '#9C7A8E',
                transition: 'all .2s',
              }}
            >
              {c}
            </button>
          ))}
          <Link
            href="/custom-order"
            style={{
              padding: '8px 20px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 600,
              border: '2px solid #EC4899',
              background: '#fff',
              color: '#EC4899',
              textDecoration: 'none',
              transition: 'all .2s',
            }}
          >
            Custom Order
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9C7A8E' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
            <p>No flowers found in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
            gap: 24,
          }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function ShopClient({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-pink-400">Loading...</div>}>
      <ShopContent products={products} />
    </Suspense>
  )
}
