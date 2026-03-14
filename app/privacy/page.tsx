'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide when placing an order, creating an account, or contacting us. This includes your name, email address, phone number, delivery addresses, and payment information processed through PayPal.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to process and deliver orders, communicate about your purchases, send order confirmations and tracking updates, and improve our services. We do not sell your personal information to third parties.',
  },
  {
    title: '3. Payment Security',
    content: 'All payments are processed securely through PayPal. We do not store your credit card or PayPal account details on our servers. PayPal\'s security measures protect your financial information.',
  },
  {
    title: '4. Cookies',
    content: 'We use essential cookies to maintain your shopping cart and authentication session. These cookies are necessary for the website to function properly and cannot be switched off.',
  },
  {
    title: '5. Data Storage',
    content: 'Your account and order data is stored securely using industry-standard encryption. We retain your data for as long as your account is active or as needed to provide you services and comply with legal obligations.',
  },
  {
    title: '6. Recipient Information',
    content: 'When you place an order, we collect the recipient\'s name, phone number, and delivery address solely for the purpose of fulfilling the flower delivery. This information is shared only with our local delivery partners.',
  },
  {
    title: '7. Your Rights',
    content: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us. You can also update your account information through your account settings page.',
  },
  {
    title: '8. Third-Party Services',
    content: 'We use Supabase for authentication and data storage, and PayPal for payment processing. These services have their own privacy policies governing how they handle your data.',
  },
  {
    title: '9. Children\'s Privacy',
    content: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13 years of age.',
  },
  {
    title: '10. Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify registered users of any significant changes via email or a notice on our website.',
  },
  {
    title: '11. Contact Us',
    content: 'If you have questions about this privacy policy or your personal data, please contact us at support@cambodiafloral.com.',
  },
]

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: '#9C7A8E' }}>Effective Date: March 14, 2026</p>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #FFE4EF',
          borderRadius: 16,
          padding: 'clamp(24px, 4vw, 40px)',
        }}>
          <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, marginBottom: 28 }}>
            Cambodia Floral (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our website and services.
          </p>

          {SECTIONS.map(s => (
            <div key={s.title} style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#4A3040',
                marginBottom: 8,
              }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.7 }}>
                {s.content}
              </p>
            </div>
          ))}

          <div style={{
            display: 'flex',
            gap: 12,
            marginTop: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <Link href="/contact" style={{
              display: 'inline-block',
              background: '#EC4899',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Contact Us
            </Link>
            <Link href="/shop" style={{
              display: 'inline-block',
              border: '2px solid #EC4899',
              color: '#EC4899',
              padding: '12px 28px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Back to Shop
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
