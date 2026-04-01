import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Khmer Wedding Flowers & Bouquets | Traditional & Modern | Cambodia Floral',
  description: 'Beautiful wedding flowers for Khmer ceremonies and modern celebrations. Bridal bouquets, centerpieces, ceremony decorations & floral packages in Phnom Penh. Book your wedding florist today.',
  keywords: [
    'Khmer wedding flowers', 'Cambodian wedding bouquet', 'wedding flowers Phnom Penh',
    'កម្រងផ្កាអាពាហ៍ពិពាហ៍', 'Khmer ceremony flowers', 'wedding florist Cambodia',
    'bridal bouquet Cambodia', 'wedding centerpieces Phnom Penh', 'wedding decoration Cambodia',
    'traditional Khmer wedding', 'jasmine wedding flowers', 'lotus wedding Cambodia',
    'Cambodian wedding traditions', 'wedding flower packages Phnom Penh',
    'groom boutonniere Cambodia', 'wedding arch flowers Cambodia',
  ],
  alternates: { canonical: 'https://cambodiafloral.com/khmer-wedding-flowers' },
  openGraph: {
    title: 'Khmer Wedding Flowers & Bouquets | Traditional & Modern',
    description: 'Complete wedding floral services in Phnom Penh. Traditional Khmer ceremony flowers, modern bouquets, centerpieces & decoration packages.',
    url: 'https://cambodiafloral.com/khmer-wedding-flowers',
    type: 'article',
  },
}

export default function KhmerWeddingFlowersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What flowers are traditional for a Khmer wedding?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Traditional Khmer weddings feature jasmine (phka malik) for purity, lotus flowers (phka chhouk) for spiritual enlightenment, marigolds for prosperity, and orchids for elegance. Jasmine garlands are essential for the hair-cutting ceremony (Kat Sah), and banana blossoms symbolize fertility. These flowers hold deep cultural significance in Cambodian wedding traditions.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much do wedding flowers cost in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Wedding flower costs in Cambodia vary: bridal bouquets start at $60-$150, centerpieces from $30-$80 each, ceremony decorations from $200-$800, and full wedding packages range from $500-$3,000 depending on venue size and flower choices. Contact us for a custom quote based on your wedding vision.',
        },
      },
      {
        '@type': 'Question',
        name: 'When should I order wedding flowers in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend booking your wedding florist at least 2-4 weeks before the wedding for standard orders, and 1-2 months in advance for large ceremonies or peak wedding season (November to February). For custom or imported flowers, 6-8 weeks advance notice is ideal.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you combine traditional Khmer and modern Western wedding flowers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! Many Cambodian couples today blend traditional and modern styles. We can create traditional jasmine garlands for the Khmer ceremony and modern rose bouquets for the reception. This fusion style is one of our most popular requests.',
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
            Khmer Wedding Flowers &amp; Bouquets
          </h1>
          <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 650, margin: '0 auto 12px', lineHeight: 1.6 }}>
            From traditional Khmer ceremony flowers to modern bridal bouquets — we make your wedding day unforgettable with stunning floral designs.
          </p>
          <p style={{ fontSize: 15, color: '#9C7A8E', marginBottom: 32 }}>
            កម្រងផ្កាអាពាហ៍ពិពាហ៍ — ផ្កាសម្រាប់ពិធីខ្មែរនិងទំនើប
          </p>
          <Link href="/shop?category=wedding" style={{
            display: 'inline-block',
            background: '#EC4899',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            marginRight: 12,
          }}>
            View Wedding Flowers
          </Link>
          <Link href="/custom-order" style={{
            display: 'inline-block',
            border: '2px solid #EC4899',
            color: '#EC4899',
            padding: '14px 36px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Request Wedding Quote
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
            The Beauty of Flowers in Khmer Weddings
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Flowers are at the heart of every Cambodian wedding. In Khmer culture, a wedding is not just a union of two people — it is a sacred ceremony steeped in tradition, spirituality, and symbolism. From the fragrant jasmine garlands draped during the hair-cutting ceremony to the elegant lotus arrangements adorning the altar, every bloom carries deep meaning and cultural significance.
            </p>
            <p style={{ marginBottom: 16 }}>
              At <strong>Cambodia Floral</strong>, we specialize in creating wedding flower arrangements that honor Khmer traditions while embracing modern aesthetics. Whether you are planning a traditional multi-day Khmer wedding ceremony, a contemporary celebration at a Phnom Penh hotel, or a destination wedding in Siem Reap, our experienced florists will bring your vision to life.
            </p>
            <p style={{ marginBottom: 16 }}>
              We work closely with couples, wedding planners, and families to ensure every floral detail is perfect. From the first consultation to the final petal placed on your wedding day, we are committed to making your celebration as beautiful as your love story.
            </p>
          </div>
        </section>

        {/* Traditional Flowers */}
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
              Traditional Flowers in Khmer Wedding Ceremonies
            </h2>
            <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                A traditional Khmer wedding (ពិធីអាពាហ៍ពិពាហ៍ខ្មែរ) typically spans two to three days and includes several distinct ceremonies, each with its own floral traditions:
              </p>

              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
                Jasmine (ផ្កាម្លិះ — Phka Malik)
              </h3>
              <p style={{ marginBottom: 16 }}>
                Jasmine is the most sacred flower in Khmer weddings. Its pure white color symbolizes purity, innocence, and devotion. Jasmine buds are strung into garlands (ក្រវ៉ាន់) and used during the Kat Sah (hair-cutting ceremony), where they are gently placed in the couple&#39;s hair. Jasmine is also scattered in blessing water and worn as hairpieces by bridesmaids. The intoxicating fragrance of jasmine fills the ceremony space, creating an atmosphere of spiritual purity.
              </p>

              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
                Lotus (ផ្កាឈូក — Phka Chhouk)
              </h3>
              <p style={{ marginBottom: 16 }}>
                The lotus holds profound spiritual significance in Cambodian Buddhist culture. Growing from muddy water to bloom in pristine beauty, the lotus represents spiritual awakening, purity of heart, and the triumph of beauty over adversity. At weddings, lotus flowers are placed on altar arrangements, used in monk blessing ceremonies, and often featured in the bride&#39;s bouquet. Pink and white lotus varieties are most popular.
              </p>

              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
                Marigolds (ផ្កាកំប៉ៅ — Phka Kampao)
              </h3>
              <p style={{ marginBottom: 16 }}>
                Bright marigolds represent prosperity, good fortune, and positive energy. They are commonly used in the Gaat Sah ceremony and to decorate the entrance and ceremonial space. Their vibrant golden color is believed to attract wealth and happiness for the newlywed couple.
              </p>

              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 20, color: '#4A3040', marginBottom: 12 }}>
                Banana Blossoms &amp; Betel Leaves
              </h3>
              <p style={{ marginBottom: 16 }}>
                While not traditional cut flowers, banana blossoms symbolize fertility and abundance in Khmer weddings. They appear in the ceremony offerings alongside areca nuts and betel leaves, which represent the enduring bond between husband and wife. These elements are essential in the traditional Sla Doh ceremony (betel nut offering).
              </p>
            </div>
          </div>
        </section>

        {/* Modern Wedding Flowers */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 36,
          }}>
            Modern Wedding Flower Styles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { emoji: '💐', title: 'Bridal Bouquets', desc: 'Hand-tied, cascade, or posy-style bouquets with roses, peonies, orchids, and local blooms. Custom colors to match your wedding palette.', price: 'From $60' },
              { emoji: '🌸', title: 'Centerpieces', desc: 'Low and tall centerpiece options for reception tables. Elegant vase arrangements, candle surrounds, and floating flower designs.', price: 'From $30/table' },
              { emoji: '💒', title: 'Ceremony Decor', desc: 'Wedding arches, aisle markers, altar arrangements, and backdrop flowers for both indoor and outdoor venues.', price: 'From $200' },
              { emoji: '🌹', title: 'Boutonniere & Corsage', desc: 'Matching groom boutonniere, groomsmen pins, and mother-of-bride corsages coordinated with the bridal bouquet.', price: 'From $15' },
              { emoji: '🎀', title: 'Flower Girl Baskets', desc: 'Petite baskets and floral crowns for flower girls, plus bridesmaid bouquets in complementary styles.', price: 'From $25' },
              { emoji: '✨', title: 'Full Packages', desc: 'Complete wedding floral packages including bride, bridal party, ceremony, and reception flowers at bundled pricing.', price: 'From $500' },
            ].map((item) => (
              <div key={item.title} style={{
                background: '#FFF8FC',
                border: '1px solid #FFE4EF',
                borderRadius: 14,
                padding: 20,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5, marginBottom: 8 }}>{item.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#EC4899' }}>{item.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Color Guide */}
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
              Popular Wedding Color Palettes in Cambodia
            </h2>
            <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                Choosing the right color palette sets the tone for your entire wedding. Here are the most popular wedding flower color combinations we create for Cambodian weddings:
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Classic Red &amp; Gold:</strong> The traditional Khmer wedding palette. Deep red roses paired with gold-accented arrangements symbolize love, passion, and prosperity. Perfect for traditional ceremonies.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Blush Pink &amp; White:</strong> The most popular modern choice. Soft pink roses, white peonies, and baby&#39;s breath create a romantic, elegant atmosphere. Ideal for hotel ballroom receptions.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Lavender &amp; Ivory:</strong> A sophisticated combination featuring purple orchids, lavender roses, and ivory hydrangeas. Beautiful for garden weddings and outdoor venues.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Tropical Bright:</strong> Vibrant orchids, bird of paradise, and frangipanis in bold colors. Perfect for destination weddings in Siem Reap or beach ceremonies in Sihanoukville.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>All White:</strong> Pure white roses, lilies, orchids, and jasmine for an ethereal, minimalist look. Increasingly popular with modern Cambodian couples.
              </p>
            </div>
          </div>
        </section>

        {/* Planning Timeline */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Wedding Flower Planning Timeline
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              <strong>2-3 months before:</strong> Initial consultation. Share your wedding vision, color palette, venue details, and budget. We will create a proposal with recommended flowers and arrangements.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>1-2 months before:</strong> Finalize your flower selections, quantities, and design details. Confirm the timeline for setup and delivery. Place your deposit to secure your date.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>1-2 weeks before:</strong> Final confirmation of all details, delivery addresses, and contact persons. Any last-minute adjustments to quantities or styles.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Wedding day:</strong> Our team arrives early to set up all ceremony and reception flowers. We ensure everything is perfect before guests arrive and remain available for any adjustments.
            </p>
            <p style={{ marginBottom: 16 }}>
              For couples planning from abroad (especially <Link href="/send-flowers-from-usa" style={{ color: '#EC4899', textDecoration: 'underline' }}>from the USA</Link>), we offer virtual consultations via video call and share photos throughout the planning process.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#4A3040',
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Wedding Flowers FAQ
            </h2>
            {[
              {
                q: 'What flowers are traditional for a Khmer wedding?',
                a: 'Traditional Khmer weddings prominently feature jasmine (phka malik) for purity, lotus flowers (phka chhouk) for spiritual enlightenment, and marigolds for prosperity. Jasmine garlands are essential for the hair-cutting ceremony, while lotus appears in altar arrangements and monk blessings. Banana blossoms symbolize fertility, and orchids add elegance to both traditional and modern setups.',
              },
              {
                q: 'How much do wedding flowers cost in Cambodia?',
                a: 'Wedding flower costs vary based on your needs. Bridal bouquets range from $60-$150, individual centerpieces from $30-$80, ceremony decorations from $200-$800, and comprehensive wedding packages from $500-$3,000. We work with every budget and can suggest beautiful options at every price point. Contact us for a personalized quote.',
              },
              {
                q: 'When should I order my wedding flowers?',
                a: 'We recommend booking 2-4 weeks in advance for standard weddings and 1-2 months for large ceremonies during peak season (November to February). If you need imported flowers or have a very specific vision, 6-8 weeks is ideal. However, we can accommodate rush orders as well — just contact us.',
              },
              {
                q: 'Can you combine traditional Khmer and modern Western wedding styles?',
                a: 'Absolutely — fusion weddings are our specialty! Many couples have a traditional Khmer ceremony in the morning with jasmine garlands and lotus, followed by a modern reception with rose bouquets and elegant centerpieces. We create cohesive designs that honor both traditions beautifully.',
              },
              {
                q: 'Do you provide wedding flower setup and decoration?',
                a: 'Yes, our full-service wedding packages include delivery, setup, and styling. Our team arrives at your venue early on the wedding day to arrange everything perfectly. We handle ceremony flowers, reception centerpieces, photo area decorations, and entrance arrangements.',
              },
              {
                q: 'Can I order wedding flowers from abroad?',
                a: 'Yes! Many of our wedding clients plan from the USA, Australia, France, and other countries. We offer virtual consultations, share design photos, and accept PayPal for international payments. Visit our page on sending flowers from the USA for more details.',
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
          </div>
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
            Let Us Create Your Dream Wedding Flowers
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            From intimate ceremonies to grand celebrations, our florists will make your wedding day bloom with beauty.
          </p>
          <Link href="/shop?category=wedding" style={{
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
            Browse Wedding Flowers
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
            Get a Wedding Quote
          </Link>
        </section>

        <Footer />
      </div>
    </>
  )
}
