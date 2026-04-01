import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Sympathy & Funeral Flowers Cambodia | Express Condolences | Cambodia Floral',
  description: 'Send respectful sympathy and funeral flowers in Cambodia. White chrysanthemums, lilies, wreaths & standing sprays. Same-day condolence delivery in Phnom Penh. Buddhist funeral customs guide.',
  keywords: [
    'funeral flowers Cambodia', 'sympathy flowers Phnom Penh', 'condolence flowers Cambodia',
    'ផ្កាសោកនាដកម្ម', 'funeral wreaths Cambodia', 'sympathy delivery Cambodia',
    'Buddhist funeral flowers', 'condolence arrangement Phnom Penh', 'memorial flowers Cambodia',
    'standing spray Cambodia', 'white flowers funeral Cambodia', 'grief flowers Cambodia',
    'sympathy gift Cambodia', 'funeral flower delivery Phnom Penh', 'bereavement flowers Cambodia',
  ],
  alternates: { canonical: 'https://cambodiafloral.com/sympathy-funeral-flowers-cambodia' },
  openGraph: {
    title: 'Sympathy & Funeral Flowers Cambodia | Express Condolences',
    description: 'Respectful sympathy and funeral flower arrangements for delivery in Phnom Penh. Buddhist customs guide, same-day delivery, wreaths & condolence bouquets.',
    url: 'https://cambodiafloral.com/sympathy-funeral-flowers-cambodia',
    type: 'article',
  },
}

export default function SympathyFuneralFlowersCambodiaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What flowers are appropriate for a Cambodian funeral?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'White flowers are most appropriate for Cambodian funerals. White chrysanthemums, white lilies, white orchids, and white roses are the most common choices. Yellow chrysanthemums are also acceptable. Avoid bright red or pink flowers, as these are associated with celebrations and joy, not mourning.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are Buddhist funeral flower customs in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In Cambodian Buddhist funerals, white flowers symbolize purity and the cycle of rebirth. Lotus flowers represent spiritual enlightenment. Flowers are typically placed at the cremation site and around the portrait of the deceased. During Pchum Ben, flowers are offered at pagodas to honor ancestors. Wreaths and standing sprays are common for the funeral hall.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I send condolence flowers in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Order online at cambodiafloral.com and select from our sympathy collection. Include the funeral hall or family home address, your condolence message, and the name of the deceased. We offer same-day delivery in Phnom Penh for orders before 2 PM. For deliveries to funeral homes and pagodas, provide as much location detail as possible.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I send same-day funeral flowers in Phnom Penh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer same-day delivery for sympathy flowers ordered before 2:00 PM Cambodia time. We understand that condolence situations are time-sensitive, so we prioritize funeral flower deliveries. For urgent orders after the cutoff, please contact us directly.',
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
          background: 'linear-gradient(135deg, #F8F4F6, #F0EBF0)',
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
            Sympathy &amp; Funeral Flowers Cambodia
          </h1>
          <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 650, margin: '0 auto 12px', lineHeight: 1.6 }}>
            Express your heartfelt condolences with beautiful, respectful flower arrangements delivered to funeral homes, pagodas, and family residences across Cambodia.
          </p>
          <p style={{ fontSize: 15, color: '#9C7A8E', marginBottom: 32 }}>
            ផ្កាសោកនាដកម្ម — បង្ហាញការសោកស្ដាយនិងការគោរពរបស់អ្នក
          </p>
          <Link href="/shop?category=sympathy" style={{
            display: 'inline-block',
            background: '#4A3040',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            View Sympathy Flowers
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
            Expressing Condolences Through Flowers
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              In times of loss, flowers offer a gentle way to express what words often cannot. In Cambodia, sending sympathy flowers is a deeply respected tradition that shows the grieving family that they are not alone. Whether you are mourning a close family member, a friend, or a colleague, a thoughtful floral tribute brings comfort and dignity to the occasion.
            </p>
            <p style={{ marginBottom: 16 }}>
              At <strong>Cambodia Floral</strong>, we understand the sensitivity of bereavement. Our experienced florists create elegant, respectful sympathy arrangements using appropriate flowers and colors that honor Cambodian Buddhist customs. We handle every order with the utmost care, ensuring timely delivery to funeral homes, pagodas, cremation sites, and family residences throughout Phnom Penh and beyond.
            </p>
            <p style={{ marginBottom: 16 }}>
              If you are <Link href="/send-flowers-from-usa" style={{ color: '#9C7A8E', textDecoration: 'underline' }}>sending condolence flowers from abroad</Link>, we make the process simple and dignified. Our team coordinates delivery timing and placement so you can express your sympathy even when you cannot be present in person.
            </p>
          </div>
        </section>

        {/* Appropriate Flowers */}
        <section style={{ background: '#F8F6F8', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 36,
            }}>
              Appropriate Flowers for Cambodian Funerals
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {[
                { emoji: '🤍', title: 'White Chrysanthemums', desc: 'The most traditional funeral flower in Cambodia and across Asia. White chrysanthemums symbolize grief, mourning, and lamentation. They are the primary flower in wreaths and standing sprays.' },
                { emoji: '🕊️', title: 'White Lilies', desc: 'Representing the restored innocence of the departed soul, white lilies are elegant and dignified. Stargazer and Asiatic lilies are popular choices for condolence arrangements.' },
                { emoji: '🪷', title: 'Lotus Flowers', desc: 'The lotus holds deep Buddhist significance, representing enlightenment and the cycle of rebirth. White and pale pink lotus are placed at altars and offered during Buddhist funeral prayers.' },
                { emoji: '🌿', title: 'White Orchids', desc: 'Orchids symbolize eternal love and respect. White phalaenopsis orchids in elegant arrangements are a sophisticated way to pay tribute to the deceased.' },
                { emoji: '🌹', title: 'White Roses', desc: 'White roses represent reverence, humility, and purity. A spray of white roses conveys deep respect and can be used in both Western and Buddhist funeral settings.' },
                { emoji: '🌼', title: 'Yellow Chrysanthemums', desc: 'In some Cambodian traditions, yellow chrysanthemums represent sorrow and grief. They are acceptable as funeral flowers and are often mixed with white blooms in wreaths.' },
              ].map((item) => (
                <div key={item.title} style={{
                  background: '#fff',
                  border: '1px solid #E8E0E5',
                  borderRadius: 14,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buddhist Customs */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Buddhist Funeral Customs &amp; Flower Etiquette in Cambodia
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Cambodia is a predominantly Theravada Buddhist country, and funeral customs reflect deep spiritual beliefs about death, rebirth, and the afterlife. Understanding these traditions will help you choose appropriate flowers and express your condolences respectfully.
            </p>

            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              The Funeral Period
            </h3>
            <p style={{ marginBottom: 16 }}>
              Cambodian Buddhist funerals typically last 3 to 7 days, during which monks chant prayers and the family receives visitors at the funeral home or family residence. Flowers are displayed prominently around the casket and portrait of the deceased throughout this period. Sending flowers early in the funeral period is most appropriate, but tributes are welcome at any point.
            </p>

            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              Colors to Use and Avoid
            </h3>
            <p style={{ marginBottom: 16 }}>
              <strong>Appropriate colors:</strong> White is the primary mourning color in Cambodia. Arrangements in white, cream, pale yellow, and soft green are all respectful choices. White represents purity and the journey to the next life.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Colors to avoid:</strong> Bright red, hot pink, orange, and other vibrant colors are associated with celebrations, joy, and luck. They are not appropriate for funerals. Dark red (maroon) is acceptable in some contexts but white is always the safest and most respectful choice.
            </p>

            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              Wreaths and Standing Sprays
            </h3>
            <p style={{ marginBottom: 16 }}>
              Large wreaths (ត្រែ) on standing easels are the most common funeral flower format in Cambodia. They are displayed at the entrance of the funeral hall and around the casket. A wreath typically includes white chrysanthemums, lilies, and orchids arranged in a circular or heart shape with a ribbon bearing the sender&#39;s name and condolence message.
            </p>

            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
              Pchum Ben — Honoring Ancestors
            </h3>
            <p style={{ marginBottom: 16 }}>
              During Pchum Ben (Festival of the Dead), Cambodians visit pagodas to make offerings for deceased ancestors. Flowers, especially lotus and jasmine, are brought to the temple along with food offerings. If you wish to honor a recently departed loved one during Pchum Ben, we can prepare appropriate floral offerings for delivery to any pagoda in Phnom Penh.
            </p>
          </div>
        </section>

        {/* Arrangement Types */}
        <section style={{ background: '#F8F6F8', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 36,
            }}>
              Sympathy Arrangement Types
            </h2>
            <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                <strong>Funeral Wreaths:</strong> Circular arrangements on standing easels, displayed at the funeral hall. Available in various sizes from standard ($80-$120) to premium ($150-$250). Includes a ribbon with your condolence message.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Standing Sprays:</strong> One-sided arrangements designed to be placed on an easel near the casket. These impressive displays use a mix of white flowers and greenery. Starting from $100.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Condolence Baskets:</strong> Smaller, more intimate arrangements suitable for the family home after the funeral. White flowers in a basket or vase, often with a comfort message. From $50-$90.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Casket Sprays:</strong> Long, elegant arrangements designed to be placed on top of the casket during the ceremony. These are typically ordered by immediate family. From $120-$200.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Temple Offerings:</strong> Flower arrangements appropriate for pagoda offerings during funeral ceremonies and Pchum Ben. Lotus, jasmine, and white chrysanthemums arranged in traditional formats. From $40-$80.
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Etiquette */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Sympathy Flower Delivery Etiquette
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              <strong>Timing:</strong> Sympathy flowers should ideally be sent within the first 1-2 days of the funeral period. However, it is never too late to send flowers — condolence arrangements delivered to the family home in the weeks following the funeral are also deeply appreciated.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>The condolence message:</strong> Keep your message brief, sincere, and respectful. Common phrases include &quot;With deepest sympathy,&quot; &quot;In loving memory of [name],&quot; or &quot;Our thoughts are with your family.&quot; In Khmer, appropriate messages include &quot;សូមចូលរួមរំលែកទុក្ខ&quot; (expressing shared sorrow) and &quot;សូមវិញ្ញាណក្ខន្ធទទួលសុគតិ&quot; (wishing the soul a good rebirth).
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Delivery location:</strong> Provide the funeral hall name and address, or the family residence. If delivering to a pagoda, include the pagoda name and district. Our delivery team is familiar with major funeral halls and pagodas throughout Phnom Penh.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>From abroad:</strong> If you are sending sympathy flowers from overseas, include your full name and relationship to the deceased on the ribbon or card. This helps the family identify who sent the tribute. Pay with PayPal and we handle everything locally with care and respect.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: '#F8F6F8', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Sympathy Flowers FAQ
            </h2>
            {[
              {
                q: 'What flowers are appropriate for a Cambodian funeral?',
                a: 'White flowers are most appropriate. White chrysanthemums are the traditional choice, followed by white lilies, white orchids, white roses, and lotus flowers. Yellow chrysanthemums are also acceptable. Avoid bright, celebratory colors like red, hot pink, and orange.',
              },
              {
                q: 'What are Buddhist funeral flower customs in Cambodia?',
                a: 'In Cambodian Buddhist funerals, white symbolizes purity and the journey to rebirth. Lotus flowers represent spiritual enlightenment. Flowers are placed around the casket and portrait throughout the 3-7 day funeral period. Monks chant prayers while family and visitors pay respects. During cremation, flowers are offered as a final tribute.',
              },
              {
                q: 'How do I send condolence flowers in Cambodia?',
                a: 'Browse our sympathy collection online, select an appropriate arrangement, and enter the delivery address (funeral hall, pagoda, or family home). Include your condolence message and the name of the deceased. Pay with PayPal (international) or local payment methods. We deliver with discretion and respect.',
              },
              {
                q: 'Can I send same-day funeral flowers in Phnom Penh?',
                a: 'Yes, we prioritize sympathy flower deliveries and offer same-day service for orders placed before 2:00 PM Cambodia time. For urgent situations, contact us directly — we will do everything possible to accommodate time-sensitive deliveries to funeral homes and family residences.',
              },
              {
                q: 'How much do funeral flowers cost in Cambodia?',
                a: 'Condolence baskets start at $50, funeral wreaths from $80-$250, standing sprays from $100, and casket sprays from $120-$200. We offer options at every price point so you can express your sympathy within your budget. Contact us for custom arrangements.',
              },
              {
                q: 'What should I write on a sympathy card in Khmer?',
                a: 'Common Khmer condolence messages include "សូមចូលរួមរំលែកទុក្ខ" (We share in your sorrow), "សូមវិញ្ញាណក្ខន្ធទទួលសុគតិ" (May the soul rest in peace), and "សូមឱ្យគ្រួសារមានកម្លាំងចិត្ត" (Wishing the family strength). Our team can help write an appropriate message in Khmer script.',
              },
            ].map((faq, i) => (
              <div key={i} style={{
                borderBottom: '1px solid #E8E0E5',
                padding: '20px 0',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: '#7A5A6A', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: '#4A3040',
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
            Send Your Condolences with Care
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Our team handles every sympathy order with the utmost respect and sensitivity. Same-day delivery available in Phnom Penh.
          </p>
          <Link href="/shop?category=sympathy" style={{
            display: 'inline-block',
            background: '#fff',
            color: '#4A3040',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            marginRight: 12,
          }}>
            View Sympathy Flowers
          </Link>
          <Link href="/contact" style={{
            display: 'inline-block',
            border: '2px solid #fff',
            color: '#fff',
            padding: '14px 36px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Contact Us
          </Link>
        </section>

        <Footer />
      </div>
    </>
  )
}
