import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className="pc" style={{
      display: 'block',
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid #FFE4EF',
      textDecoration: 'none',
    }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt={product.title}
          className="pi"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {product.badge && (
          <span style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: '#EC4899',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 20,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            {product.badge}
          </span>
        )}
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#4A3040', marginBottom: 6, lineHeight: 1.3 }}>
          {product.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#DB2777' }}>
            ${product.price.toFixed(2)}
          </span>
          {product.compare_price && (
            <span style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'line-through' }}>
              ${product.compare_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
