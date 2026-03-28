'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: Product[]) => {
        const found = data.find(p => p.id === id)
        setProduct(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      sku: product.sku || null,
      title: product.title,
      price: product.price,
      qty,
      img: product.image_url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 100, color: '#9C7A8E' }}>Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: 100 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌷</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Product Not Found</h1>
          <p style={{ color: '#9C7A8E', marginBottom: 24 }}>This flower arrangement may no longer be available.</p>
          <button onClick={() => router.push('/shop')} style={{
            background: '#EC4899', color: '#fff', padding: '10px 24px', borderRadius: 50,
            fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>Browse Flowers</button>
        </div>
      </div>
    )
  }

  const images = product.image_urls?.length > 0 ? product.image_urls : [product.image_url]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <button onClick={() => router.back()} style={{
          background: 'none', border: 'none', color: '#9C7A8E', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          &larr; Back
        </button>

        <div className="grid-product-detail">
          {/* Images */}
          <div>
            <div style={{
              aspectRatio: '1',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#FFF0F5',
              marginBottom: 12,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImage]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: selectedImage === i ? '3px solid #EC4899' : '2px solid #FFE4EF',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'none',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.badge && (
              <span style={{
                display: 'inline-block',
                background: '#FFF0F5',
                color: '#EC4899',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 20,
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {product.badge}
              </span>
            )}

            <h1 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 32,
              fontWeight: 700,
              color: '#4A3040',
              marginBottom: 12,
              lineHeight: 1.2,
            }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#DB2777' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price && (
                <span style={{ fontSize: 18, color: '#C9A0B4', textDecoration: 'line-through' }}>
                  ${product.compare_price.toFixed(2)}
                </span>
              )}
            </div>

            {product.description && (
              <p style={{
                fontSize: 15,
                color: '#7A5A6A',
                lineHeight: 1.7,
                marginBottom: 28,
              }}>
                {product.description}
              </p>
            )}

            {product.category && (
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Category:
                </span>
                <span style={{ marginLeft: 8, fontSize: 14, color: '#4A3040', fontWeight: 500, textTransform: 'capitalize' }}>
                  {product.category}
                </span>
              </div>
            )}

            {product.occasion && (
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Occasion:
                </span>
                <span style={{ marginLeft: 8, fontSize: 14, color: '#4A3040', fontWeight: 500, textTransform: 'capitalize' }}>
                  {product.occasion}
                </span>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C7A8E', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    width: 40, height: 40, border: '2px solid #FFD6E8', borderRadius: '10px 0 0 10px',
                    background: '#FFF0F5', fontSize: 18, cursor: 'pointer', color: '#DB2777', fontWeight: 700,
                  }}
                >
                  -
                </button>
                <div style={{
                  width: 56, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #FFD6E8', borderLeft: 'none', borderRight: 'none',
                  fontSize: 15, fontWeight: 700, color: '#4A3040',
                }}>
                  {qty}
                </div>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    width: 40, height: 40, border: '2px solid #FFD6E8', borderRadius: '0 10px 10px 0',
                    background: '#FFF0F5', fontSize: 18, cursor: 'pointer', color: '#DB2777', fontWeight: 700,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                border: 'none',
                cursor: product.stock < 1 ? 'not-allowed' : 'pointer',
                background: added ? '#10B981' : product.stock < 1 ? '#E5E7EB' : '#EC4899',
                color: '#fff',
                transition: 'all .2s',
                marginBottom: 12,
              }}
            >
              {product.stock < 1 ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            <div style={{
              background: '#FFF8FC',
              borderRadius: 12,
              padding: '16px 20px',
              marginTop: 16,
            }}>
              <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.6 }}>
                🌸 Free delivery in Phnom Penh for orders over $100<br />
                🚚 Delivery available to Siem Reap, Battambang & Sihanoukville<br />
                💐 Same-day delivery available for orders placed before 2PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
