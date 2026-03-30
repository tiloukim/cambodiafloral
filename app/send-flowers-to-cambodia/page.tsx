import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Send Flowers to Cambodia from USA, UK, Australia & Abroad',
  description: 'Send beautiful flowers to your loved ones in Phnom Penh, Cambodia from anywhere in the world. Same-day delivery, fresh bouquets, roses, cakes & gift baskets. Order online — we deliver for you!',
  keywords: [
    'send flowers to cambodia', 'send flowers to phnom penh', 'flower delivery cambodia from usa',
    'flowers to cambodia from abroad', 'cambodia flower delivery international',
    'send roses to cambodia', 'send gift to cambodia', 'flowers phnom penh delivery',
    'cambodia florist online', 'order flowers cambodia', 'international flower delivery cambodia',
    'send flowers to cambodia from uk', 'send flowers to cambodia from australia',
  ],
  openGraph: {
    title: 'Send Flowers to Cambodia from Anywhere in the World',
    description: 'Fresh bouquets, roses, cakes & gift baskets delivered same-day in Phnom Penh. Order online from the USA, UK, or anywhere!',
    url: 'https://cambodiafloral.com/send-flowers-to-cambodia',
  },
}

export default function SendFlowersToCambodiaPage() {
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
          Send Flowers to Cambodia <br />from Anywhere in the World
        </h1>
        <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Surprise your loved ones in Phnom Penh with fresh, beautiful flowers.
          Order from the USA, UK, Australia, or anywhere — we handle the delivery.
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
          Browse Flowers & Order Now
        </Link>
      </section>

      {/* How It Works */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 30,
          fontWeight: 700,
          color: '#4A3040',
          textAlign: 'center',
          marginBottom: 40,
        }}>
          How It Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { emoji: '🌐', title: 'Order Online', desc: 'Browse our collection from anywhere in the world. Choose bouquets, arrangements, cakes, or gift baskets.' },
            { emoji: '💳', title: 'Pay Securely', desc: 'Pay with PayPal, credit card, or local Cambodia payment methods (ABA, Wing, ACLEDA).' },
            { emoji: '💐', title: 'We Deliver', desc: 'Our team in Phnom Penh hand-delivers your fresh flowers same-day. Other provinces coming soon!' },
          ].map((step, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #FFE4EF',
              borderRadius: 16,
              padding: 28,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{step.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perfect For */}
      <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 30,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 40,
          }}>
            Perfect For
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { emoji: '🇺🇸', title: 'US Embassy Staff', desc: 'Brighten a colleague\'s day or celebrate with your team in Phnom Penh' },
              { emoji: '🌍', title: 'Expats & Diplomats', desc: 'Send flowers to friends, partners, or staff across Phnom Penh' },
              { emoji: '✈️', title: 'Family Abroad', desc: 'Living overseas? Send love to your family in Cambodia with fresh flowers' },
              { emoji: '💕', title: 'Long-Distance Love', desc: 'Surprise your partner in Phnom Penh with roses and a heartfelt gift' },
              { emoji: '🎂', title: 'Birthday & Celebrations', desc: 'Never miss a birthday — we deliver cakes and flowers same-day' },
              { emoji: '🤝', title: 'Business & Corporate', desc: 'Impress clients or thank partners with elegant arrangements' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #FFE4EF',
                borderRadius: 14,
                padding: 20,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 30,
          fontWeight: 700,
          color: '#4A3040',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Why Cambodia Floral?
        </h2>
        <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
          <p style={{ marginBottom: 16 }}>
            <strong>🌸 Fresh & Local</strong> — All our flowers are sourced fresh daily from local farms and markets in Cambodia. No wilted imports.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>⚡ Same-Day Delivery</strong> — Order before 2PM and we deliver the same day anywhere in Phnom Penh. No extra fees for orders over $100.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>💳 Easy International Payment</strong> — Pay with PayPal from anywhere in the world. We also accept local payments (ABA, Wing, ACLEDA) for residents.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>📸 Photo Confirmation</strong> — We send you a photo of the delivered flowers so you know your gift arrived beautifully.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>🎀 Beautiful Presentation</strong> — Every bouquet and arrangement is hand-wrapped with care, gift-ready with a personalized message card.
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
          }}>
            Shop Now — Delivery in Phnom Penh
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 30,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 32,
          }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: 'Can I send flowers to Cambodia from the USA?', a: 'Yes! Simply order online at cambodiafloral.com, pay with PayPal or credit card, and we deliver fresh flowers same-day in Phnom Penh.' },
            { q: 'How fast is delivery?', a: 'Same-day delivery for orders placed before 2PM (Cambodia time, GMT+7). Otherwise, delivery is the next day.' },
            { q: 'What payment methods do you accept?', a: 'PayPal (international), plus ABA PayWay, Wing Money, and ACLEDA for local payments in Cambodia.' },
            { q: 'Do you deliver outside Phnom Penh?', a: 'Currently we deliver within Phnom Penh only. Delivery to Siem Reap, Battambang, and other provinces is coming soon!' },
            { q: 'Can I include a message with my flowers?', a: 'Yes! Add a personalized message during checkout and we\'ll include a beautiful card with your flowers.' },
            { q: 'Do you deliver to the US Embassy in Phnom Penh?', a: 'Yes, we deliver to the US Embassy compound and all embassies in Phnom Penh. Just provide the delivery details at checkout.' },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* FAQ Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Can I send flowers to Cambodia from the USA?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Simply order online at cambodiafloral.com, pay with PayPal or credit card, and we deliver fresh flowers same-day in Phnom Penh.' } },
              { '@type': 'Question', name: 'How fast is delivery?', acceptedAnswer: { '@type': 'Answer', text: 'Same-day delivery for orders placed before 2PM Cambodia time. Otherwise next-day delivery.' } },
              { '@type': 'Question', name: 'Do you deliver outside Phnom Penh?', acceptedAnswer: { '@type': 'Answer', text: 'Currently we deliver within Phnom Penh only. Other provinces coming soon.' } },
              { '@type': 'Question', name: 'Do you deliver to the US Embassy?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, we deliver to the US Embassy and all embassies in Phnom Penh.' } },
            ],
          }),
        }}
      />
    </div>
  )
}
