'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EF 50%, #FECDD3 100%)',
        padding: 'clamp(48px, 8vw, 80px) 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 12,
        }}>
          About Cambodia Floral
        </h1>
        <p style={{ fontSize: 16, color: '#7A5A6A', maxWidth: 500, margin: '0 auto' }}>
          Connecting hearts across borders with the beauty of fresh flowers
        </p>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #FFE4EF',
          borderRadius: 16,
          padding: 'clamp(24px, 4vw, 40px)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#4A3040',
            marginBottom: 16,
          }}>
            Our Story
          </h2>
          <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, marginBottom: 20 }}>
            Cambodia Floral was born from a simple idea: no matter where you are in the world, you should be able to send love and joy to your family and friends in Cambodia. We partner with talented local florists across the country to create stunning, fresh arrangements that are hand-delivered with care.
          </p>

          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#4A3040',
            marginBottom: 16,
          }}>
            Our Mission
          </h2>
          <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, marginBottom: 20 }}>
            We believe every occasion deserves to be celebrated, every loved one deserves to feel special, and distance should never stand in the way. Whether it&apos;s a birthday in Phnom Penh, an anniversary in Siem Reap, or a heartfelt &ldquo;thinking of you&rdquo; in Battambang &mdash; we make it happen.
          </p>

          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#4A3040',
            marginBottom: 16,
          }}>
            Why Choose Us
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {[
              { title: 'Fresh & Local', desc: 'We source the freshest flowers from local Cambodian growers and markets.' },
              { title: 'Same-Day Delivery', desc: 'Order before noon for same-day delivery in Phnom Penh and major cities.' },
              { title: 'Hand-Crafted', desc: 'Every arrangement is crafted by skilled local florists with attention to detail.' },
              { title: 'Secure Payments', desc: 'Pay safely with PayPal from anywhere in the world.' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex',
                gap: 12,
                padding: '14px 16px',
                background: '#FFF8FC',
                borderRadius: 12,
                border: '1px solid #FFE4EF',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>✿</span>
                <div>
                  <strong style={{ fontSize: 14, color: '#4A3040' }}>{item.title}</strong>
                  <p style={{ fontSize: 13, color: '#9C7A8E', marginTop: 2 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#4A3040',
            marginBottom: 16,
          }}>
            Delivery Areas
          </h2>
          <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, marginBottom: 28 }}>
            We currently deliver to Phnom Penh, Siem Reap, Battambang, and Sihanoukville, with plans to expand across all provinces of Cambodia.
          </p>

          <div style={{ textAlign: 'center' }}>
            <Link href="/shop" style={{
              display: 'inline-block',
              background: '#EC4899',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(236,72,153,.3)',
            }}>
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
