import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Send Flowers to Cambodia from the USA | Same-Day Delivery | Cambodia Floral',
  description: 'Send beautiful flowers to Cambodia from the USA. Same-day delivery in Phnom Penh & Siem Reap. Pay with PayPal. Perfect for birthdays, anniversaries & holidays. Order online today!',
  keywords: [
    'send flowers to Cambodia from USA', 'order flowers Cambodia from abroad',
    'international flower delivery Cambodia', 'send flowers from US to Cambodia',
    'flowers to Phnom Penh from America', 'Cambodia flower delivery international',
    'send roses to Cambodia', 'overseas flower delivery Cambodia',
    'expat flowers Cambodia', 'long distance flower delivery Cambodia',
    'send birthday flowers to Cambodia', 'send anniversary flowers Cambodia',
    'flowers from USA to Phnom Penh', 'Cambodia florist international orders',
  ],
  alternates: { canonical: 'https://cambodiafloral.com/send-flowers-from-usa' },
  openGraph: {
    title: 'Send Flowers to Cambodia from the USA | Same-Day Delivery',
    description: 'Order flowers online from the USA for delivery in Cambodia. Same-day delivery, PayPal accepted. Fresh bouquets, roses & gift baskets.',
    url: 'https://cambodiafloral.com/send-flowers-from-usa',
    type: 'article',
  },
}

export default function SendFlowersFromUSAPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I send flowers from the US to Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply visit cambodiafloral.com, browse our flower collection, select your arrangement, enter the recipient\'s address in Cambodia, and pay securely with PayPal. We handle the rest and deliver fresh flowers directly to your loved one\'s door in Phnom Penh, Siem Reap, or other cities.',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods can I use to send flowers to Cambodia from the USA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept PayPal for all international orders, which supports credit cards, debit cards, and PayPal balance. PayPal provides buyer protection and secure transactions. For orders within Cambodia, we also accept ABA PayWay, Wing Money, and ACLEDA bank transfers.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does flower delivery take in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer same-day delivery for orders placed before 2:00 PM Cambodia time (GMT+7), which is 2:00 AM Eastern Time or 11:00 PM Pacific Time the previous day. Orders placed after the cutoff are delivered the next morning. All flowers are arranged fresh locally in Cambodia.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I send same-day flowers to Cambodia from the USA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Since Cambodia is 12-15 hours ahead of US time zones, you can place an order in the evening (US time) and have it delivered the same day in Cambodia. Order before 2:00 PM Cambodia time for same-day delivery in Phnom Penh and Siem Reap.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            Send Flowers to Cambodia from the USA
          </h1>
          <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 650, margin: '0 auto 12px', lineHeight: 1.6 }}>
            Surprise your loved ones in Cambodia with fresh, beautiful flowers — delivered same-day to their doorstep, no matter the distance.
          </p>
          <p style={{ fontSize: 15, color: '#9C7A8E', marginBottom: 32 }}>
            បញ្ជាទិញផ្កាពីអាមេរិកទៅកម្ពុជា — ដឹកជញ្ជូនថ្ងៃតែមួយ!
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
            Order Flowers Now
          </Link>
        </section>

        {/* Intro */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            The Easiest Way to Send Flowers from America to Cambodia
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Whether you are a Cambodian American living in Long Beach, Lowell, or anywhere across the United States, staying connected to family and friends back home is important. Sending flowers to Cambodia from the USA used to be complicated and unreliable, but <strong>Cambodia Floral</strong> makes it simple, affordable, and beautiful.
            </p>
            <p style={{ marginBottom: 16 }}>
              Unlike international flower delivery services that ship flowers across borders (arriving wilted and damaged), we operate as a <strong>local florist in Cambodia</strong>. When you place an order from the US, our team in Phnom Penh arranges your flowers fresh using locally sourced blooms and delivers them directly to your recipient. This means fresher flowers, lower prices, and reliable same-day delivery.
            </p>
            <p style={{ marginBottom: 16 }}>
              Our service is trusted by hundreds of Cambodian Americans and expats who regularly send flowers for <Link href="/birthday-flowers-cambodia" style={{ color: '#EC4899', textDecoration: 'underline' }}>birthdays</Link>, <Link href="/khmer-wedding-flowers" style={{ color: '#EC4899', textDecoration: 'underline' }}>weddings</Link>, <Link href="/valentines-day-flowers-cambodia" style={{ color: '#EC4899', textDecoration: 'underline' }}>Valentine&#39;s Day</Link>, Pchum Ben, Khmer New Year, and other important occasions. We understand the cultural significance of these moments and ensure every arrangement reflects the care and love you want to express.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 36,
            }}>
              How to Send Flowers to Cambodia from the USA
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {[
                { step: '1', title: 'Browse & Choose', desc: 'Visit our online shop and select from dozens of fresh bouquets, roses, arrangements, and gift baskets. Filter by occasion or budget.' },
                { step: '2', title: 'Add Delivery Details', desc: 'Enter the recipient\'s address in Cambodia, your personal message, and preferred delivery date. We deliver to Phnom Penh, Siem Reap, and more.' },
                { step: '3', title: 'Pay Securely with PayPal', desc: 'Complete your order using PayPal — no Cambodian bank account needed. Your payment is protected by PayPal\'s buyer guarantee.' },
                { step: '4', title: 'We Deliver & Confirm', desc: 'Our local florists arrange your flowers fresh and deliver them. You receive a photo confirmation so you can see the smile you created.' },
              ].map((item) => (
                <div key={item.step} style={{
                  background: '#fff',
                  border: '1px solid #FFE4EF',
                  borderRadius: 14,
                  padding: 24,
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', background: '#EC4899', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, margin: '0 auto 12px',
                  }}>{item.step}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Time Zone Guide */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Understanding the Time Difference
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Cambodia is in the ICT time zone (GMT+7), which is <strong>12 to 15 hours ahead</strong> of US time zones depending on the season. This actually works in your favor for same-day delivery. Here is a quick reference:
            </p>
            <div style={{
              background: '#FFF8FC', border: '1px solid #FFE4EF', borderRadius: 12, padding: 24, marginBottom: 24,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { us: 'Eastern Time (ET)', cambodia: '+12 hours' },
                  { us: 'Central Time (CT)', cambodia: '+13 hours' },
                  { us: 'Mountain Time (MT)', cambodia: '+14 hours' },
                  { us: 'Pacific Time (PT)', cambodia: '+15 hours' },
                ].map((tz) => (
                  <div key={tz.us} style={{ padding: '8px 0', borderBottom: '1px solid #FFE4EF' }}>
                    <strong style={{ color: '#4A3040' }}>{tz.us}</strong>
                    <span style={{ color: '#9C7A8E' }}> — Cambodia is {tz.cambodia}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ marginBottom: 16 }}>
              <strong>Pro tip:</strong> If you order in the evening (US time), your flowers can often be delivered the same calendar day in Cambodia. For example, ordering at 9:00 PM Pacific Time means it is 12:00 PM noon in Cambodia — well within our same-day delivery window.
            </p>
            <p style={{ marginBottom: 16 }}>
              Our same-day delivery cutoff is <strong>2:00 PM Cambodia time</strong>. Orders after this time are delivered first thing the next morning.
            </p>
          </div>
        </section>

        {/* Popular Occasions */}
        <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 36,
            }}>
              Popular Occasions for Sending Flowers to Cambodia
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {[
                { emoji: '🎂', title: 'Birthdays', desc: 'Surprise your mom, dad, or friend with a beautiful birthday bouquet delivered right to their door.', link: '/birthday-flowers-cambodia' },
                { emoji: '❤️', title: 'Valentine\'s Day', desc: 'Send roses and romantic flowers to your partner in Cambodia, even from thousands of miles away.', link: '/valentines-day-flowers-cambodia' },
                { emoji: '💒', title: 'Weddings & Engagements', desc: 'Celebrate a family wedding with elegant floral arrangements and traditional Khmer ceremony flowers.', link: '/khmer-wedding-flowers' },
                { emoji: '🕊️', title: 'Sympathy & Funerals', desc: 'Express your condolences with respectful sympathy flowers when you cannot be there in person.', link: '/sympathy-funeral-flowers-cambodia' },
                { emoji: '🎊', title: 'Khmer New Year', desc: 'Celebrate Choul Chnam Thmey with festive flower arrangements that bring joy and blessings.', link: '/shop?occasion=holiday' },
                { emoji: '🙏', title: 'Pchum Ben', desc: 'Honor ancestors during Pchum Ben with traditional offerings and appropriate floral tributes.', link: '/shop?occasion=sympathy' },
              ].map((item) => (
                <Link key={item.title} href={item.link} style={{
                  background: '#fff',
                  border: '1px solid #FFE4EF',
                  borderRadius: 14,
                  padding: 20,
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all .2s',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5 }}>{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Payment & Delivery */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Payment Methods & Delivery Areas
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              Secure International Payments
            </h3>
            <p style={{ marginBottom: 16 }}>
              For customers ordering from the USA, <strong>PayPal</strong> is our recommended payment method. PayPal allows you to pay using your US credit card, debit card, or PayPal balance without needing a Cambodian bank account. All transactions are processed in US dollars, so there are no currency conversion surprises. PayPal also provides buyer protection, giving you peace of mind with every order.
            </p>
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              Delivery Areas in Cambodia
            </h3>
            <p style={{ marginBottom: 16 }}>
              We deliver flowers throughout <strong>Phnom Penh</strong> (including BKK, Tonle Bassac, Toul Kork, Chamkar Mon, Daun Penh, and all districts), <strong>Siem Reap</strong> (city center and surrounding areas), and <strong>Sihanoukville</strong>. For deliveries to other provinces, please <Link href="/contact" style={{ color: '#EC4899', textDecoration: 'underline' }}>contact us</Link> to arrange delivery.
            </p>
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              Delivery Confirmation with Photos
            </h3>
            <p style={{ marginBottom: 16 }}>
              We know that when you send flowers from abroad, you want to be sure they arrived safely and looked beautiful. That is why we send a <strong>photo confirmation</strong> of every delivery. You will receive a photo showing your arrangement at the recipient&#39;s door or in their hands, so you can share in the joy even from across the ocean.
            </p>
          </div>
        </section>

        {/* Tips Section */}
        <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Tips for Sending Flowers from the USA to Cambodia
            </h2>
            <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                <strong>1. Order ahead for holidays.</strong> During popular occasions like Khmer New Year (mid-April), Pchum Ben (September/October), and Valentine&#39;s Day, demand is high. Place your order at least 2-3 days in advance to guarantee availability of your preferred arrangement.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>2. Include a Khmer message.</strong> A personal message written in Khmer can make your gift even more meaningful, especially for older family members. If you need help with a Khmer message, our team can assist you — just mention it in the order notes.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>3. Double-check the address.</strong> Cambodian addresses can be different from US addresses. Include as many details as possible: street number, street name, village, sangkat (commune), khan (district), and any landmarks. A phone number for the recipient is very helpful for our delivery team.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>4. Consider adding extras.</strong> Make your gift extra special by adding a <Link href="/shop?category=cakes" style={{ color: '#EC4899', textDecoration: 'underline' }}>cake</Link>, chocolates, or a <Link href="/shop?category=baskets" style={{ color: '#EC4899', textDecoration: 'underline' }}>gift basket</Link> to your flower order. Combo gifts are our most popular option for birthdays and celebrations.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>5. Use our custom order option.</strong> If you have a specific vision for your arrangement or need something not in our catalog, use our <Link href="/custom-order" style={{ color: '#EC4899', textDecoration: 'underline' }}>custom order form</Link> and our florists will create exactly what you need.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 32,
          }}>
            Frequently Asked Questions
          </h2>
          {[
            {
              q: 'How do I send flowers from the US to Cambodia?',
              a: 'Simply browse our online shop at cambodiafloral.com, choose your arrangement, enter the recipient\'s address in Cambodia, add a personal message, and pay with PayPal. Our local florists in Cambodia will arrange the flowers fresh and deliver them directly. The entire process takes just a few minutes online.',
            },
            {
              q: 'What payment methods do you accept for international orders?',
              a: 'We accept PayPal for all international orders from the USA and other countries. PayPal supports Visa, Mastercard, American Express, Discover, and PayPal balance. All prices are in US dollars. For customers in Cambodia, we also accept ABA PayWay, Wing Money, and ACLEDA bank transfers.',
            },
            {
              q: 'How long does delivery take?',
              a: 'We offer same-day delivery for orders placed before 2:00 PM Cambodia time (GMT+7). Since Cambodia is 12-15 hours ahead of US time zones, you can often order in the evening US time and have flowers delivered the same day in Cambodia. Orders after the cutoff are delivered the next morning.',
            },
            {
              q: 'Can I send same-day flowers from the USA to Cambodia?',
              a: 'Yes! Thanks to the time zone difference, same-day delivery is very achievable. If you order at 9 PM Pacific Time, it is noon in Cambodia — still within our same-day window. We deliver within 2-4 hours of the order being confirmed for Phnom Penh addresses.',
            },
            {
              q: 'Do you deliver outside of Phnom Penh?',
              a: 'Yes, we deliver to Siem Reap, Sihanoukville, and other major cities. Delivery to Phnom Penh and Siem Reap is available same-day. For other provinces, delivery may take an additional day. Contact us for specific delivery areas.',
            },
            {
              q: 'Will I receive confirmation when my flowers are delivered?',
              a: 'Absolutely! We send a photo confirmation of every delivery so you can see your beautiful arrangement and know it arrived safely. This is especially important for our international customers who cannot be there in person.',
            },
          ].map((faq, i) => (
            <div key={i} style={{
              borderBottom: '1px solid #FFE4EF',
              padding: '20px 0',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #EC4899, #D946A8)',
          padding: '60px 20px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 30,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
          }}>
            Ready to Send Flowers to Cambodia?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Browse our collection of fresh bouquets, roses, and gifts. Same-day delivery available. PayPal accepted.
          </p>
          <Link href="/shop" style={{
            display: 'inline-block',
            background: '#fff',
            color: '#EC4899',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            marginRight: 12,
          }}>
            Shop All Flowers
          </Link>
          <Link href="/custom-order" style={{
            display: 'inline-block',
            border: '2px solid #fff',
            color: '#fff',
            padding: '14px 36px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Custom Order
          </Link>
        </section>

        <Footer />
      </div>
    </>
  )
}
