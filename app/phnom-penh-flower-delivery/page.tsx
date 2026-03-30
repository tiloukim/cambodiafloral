import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Phnom Penh Flower Delivery - Same Day | Cambodia Floral',
  description: 'Same-day flower delivery in Phnom Penh. Fresh bouquets, roses, arrangements, cakes & gift baskets. Free delivery on orders over $100. Order online now!',
  keywords: [
    'phnom penh flower delivery', 'flower delivery phnom penh', 'florist phnom penh',
    'flowers phnom penh', 'same day flower delivery phnom penh', 'roses phnom penh',
    'bouquet phnom penh', 'cake delivery phnom penh', 'gift delivery phnom penh',
    'ផ្កាភ្នំពេញ', 'ដឹកជញ្ជូនផ្កាភ្នំពេញ', 'ហាងផ្កាភ្នំពេញ',
    'phnom penh florist', 'best florist phnom penh', 'flower shop phnom penh',
  ],
  openGraph: {
    title: 'Phnom Penh Flower Delivery - Same Day | Cambodia Floral',
    description: 'Fresh flowers delivered same-day in Phnom Penh. Bouquets, roses, cakes & gifts. Free delivery over $100!',
    url: 'https://cambodiafloral.com/phnom-penh-flower-delivery',
  },
}

export default function PhnomPenhDeliveryPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #FFF0F5, #FDE8EF)',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 42,
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Phnom Penh Flower Delivery
        </h1>
        <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 600, margin: '0 auto 12px', lineHeight: 1.6 }}>
          Fresh flowers delivered to any address in Phnom Penh — same-day!
        </p>
        <p style={{ fontSize: 15, color: '#9C7A8E', marginBottom: 32 }}>
          ដឹកជញ្ជូនផ្កាស្រស់ទៅគ្រប់ទីកន្លែងក្នុងភ្នំពេញ — ថ្ងៃតែមួយ!
        </p>
        <Link href="/shop" style={{
          display: 'inline-block',
          background: '#EC4899',
          color: '#fff',
          padding: '16px 40px',
          borderRadius: 50,
          fontSize: 16,
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          Order Now
        </Link>
      </section>

      {/* Delivery Areas */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#4A3040',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          We Deliver Across All of Phnom Penh
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, maxWidth: 700, margin: '0 auto' }}>
          {[
            'BKK1 (Boeung Keng Kang)',
            'Tonle Bassac',
            'Toul Kork',
            'Chamkar Mon',
            'Daun Penh',
            'Chroy Changvar',
            'Russian Market area',
            'Diamond Island',
            'Aeon Mall area',
            'US Embassy area',
            'French Embassy area',
            'Riverside / Sisowath Quay',
            'Toul Tom Poung',
            'Sen Sok',
            'Meanchey',
            'Por Senchey',
          ].map((area) => (
            <div key={area} style={{
              background: '#FFF8FC',
              border: '1px solid #FFE4EF',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 13,
              color: '#4A3040',
              fontWeight: 500,
              textAlign: 'center',
            }}>
              📍 {area}
            </div>
          ))}
        </div>
      </section>

      {/* What We Deliver */}
      <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 36,
          }}>
            What We Deliver in Phnom Penh
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { emoji: '💐', title: 'Bouquets', desc: 'Hand-tied roses, mixed flowers, and premium bouquets starting at $38', link: '/shop?category=bouquets' },
              { emoji: '🌺', title: 'Arrangements', desc: 'Elegant vase and basket arrangements for homes and offices', link: '/shop?category=arrangements' },
              { emoji: '🧺', title: 'Gift Baskets', desc: 'Flowers paired with wine, chocolates, and gourmet treats', link: '/shop?category=baskets' },
              { emoji: '🎂', title: 'Cakes', desc: 'Beautiful birthday, anniversary, and celebration cakes', link: '/shop?category=cakes' },
              { emoji: '💒', title: 'Wedding Flowers', desc: 'Bridal bouquets, centerpieces, and ceremony arrangements', link: '/shop?category=wedding' },
              { emoji: '🕊️', title: 'Sympathy Flowers', desc: 'Respectful tributes and condolence arrangements', link: '/shop?category=sympathy' },
            ].map((cat) => (
              <Link key={cat.title} href={cat.link} style={{
                background: '#fff',
                border: '1px solid #FFE4EF',
                borderRadius: 14,
                padding: 20,
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all .2s',
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{cat.title}</h3>
                <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5 }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#4A3040',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Delivery Information
        </h2>
        <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>
            <strong>⏰ Same-Day Delivery</strong> — Order before 2:00 PM (Cambodia time, GMT+7) for same-day delivery. Orders after 2PM are delivered the next morning.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>🆓 Free Delivery</strong> — Free delivery on all orders over $100 within Phnom Penh. Orders under $100 have a flat $5 delivery fee.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>📸 Photo Confirmation</strong> — We send you a photo of the delivered arrangement so you can see exactly how beautiful it looks.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>🏢 Office & Embassy Delivery</strong> — We deliver to offices, hotels, embassies, hospitals, and residences across Phnom Penh.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>📝 Personalized Messages</strong> — Add a free handwritten card with your personal message to make your gift extra special.
          </p>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/shop" style={{
            display: 'inline-block',
            background: '#EC4899',
            color: '#fff',
            padding: '14px 36px',
            borderRadius: 50,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            marginRight: 12,
          }}>
            Order Flowers Now
          </Link>
          <Link href="/contact" style={{
            display: 'inline-block',
            border: '2px solid #EC4899',
            color: '#EC4899',
            padding: '12px 36px',
            borderRadius: 50,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Florist',
            name: 'Cambodia Floral - Phnom Penh Flower Delivery',
            url: 'https://cambodiafloral.com/phnom-penh-flower-delivery',
            description: 'Same-day flower delivery in Phnom Penh. Fresh bouquets, roses, cakes & gift baskets.',
            address: { '@type': 'PostalAddress', addressLocality: 'Phnom Penh', addressCountry: 'KH' },
            areaServed: { '@type': 'City', name: 'Phnom Penh' },
            priceRange: '$38 - $250',
            paymentAccepted: 'PayPal, ABA PayWay, Wing Money, ACLEDA',
            currenciesAccepted: 'USD, KHR',
          }),
        }}
      />
    </div>
  )
}
