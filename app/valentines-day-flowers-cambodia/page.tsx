import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Valentine's Day Flowers Cambodia | Roses & Romantic Bouquets | Cambodia Floral",
  description: "Order Valentine's Day flowers in Cambodia. Red roses, romantic bouquets & gift combos with same-day delivery in Phnom Penh. Surprise your love with the perfect Valentine's gift!",
  keywords: [
    "Valentine's Day flowers Cambodia", 'roses Phnom Penh', "Valentine's delivery Cambodia",
    'romantic flowers Cambodia', "Valentine's Day roses Cambodia", 'red roses Phnom Penh',
    "Valentine's gift Cambodia", 'romantic bouquet Cambodia', "February 14 flowers Cambodia",
    'love flowers Phnom Penh', "Valentine's Day gift delivery Cambodia",
    'roses and chocolates Cambodia', "ផ្កាថ្ងៃបុណ្យនៃក្តីស្រឡាញ់",
    "Valentine's Day Phnom Penh", 'long stem roses Cambodia',
  ],
  alternates: { canonical: 'https://cambodiafloral.com/valentines-day-flowers-cambodia' },
  openGraph: {
    title: "Valentine's Day Flowers Cambodia | Roses & Romantic Bouquets",
    description: "Red roses, romantic bouquets & Valentine's gift combos. Same-day delivery in Phnom Penh & Siem Reap. Order the perfect Valentine's surprise!",
    url: 'https://cambodiafloral.com/valentines-day-flowers-cambodia',
    type: 'article',
  },
}

export default function ValentinesDayFlowersCambodiaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "What are the best Valentine's Day flowers to send in Cambodia?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Red roses are the classic Valentine's Day choice in Cambodia, symbolizing deep romantic love. Other popular options include pink roses (admiration and gratitude), a mix of red and white roses (unity), tulips (perfect love), and orchids (luxury and elegance). Rose bouquets paired with chocolates or teddy bears are the most popular Valentine's gifts.",
        },
      },
      {
        '@type': 'Question',
        name: "How early should I order Valentine's Day flowers in Cambodia?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "We strongly recommend ordering at least 3-5 days before February 14th. Valentine's Day is the busiest day of the year for florists in Cambodia, and popular arrangements sell out quickly. Early ordering guarantees your preferred bouquet and delivery time slot. We do accept same-day orders on Valentine's Day, but availability is limited.",
        },
      },
      {
        '@type': 'Question',
        name: "Can you deliver flowers on February 14th in Phnom Penh?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes! We offer delivery throughout Valentine's Day from early morning to evening. You can choose a preferred time window: morning surprise (8-11 AM), afternoon delivery (11 AM-3 PM), or evening romantic delivery (3-7 PM). Pre-orders are strongly recommended to secure your preferred time slot.",
        },
      },
      {
        '@type': 'Question',
        name: 'What do different rose colors mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Red roses mean deep romantic love and passion. Pink roses express admiration, gratitude, and gentle affection. White roses symbolize purity, innocence, and new beginnings. Yellow roses represent friendship and joy. Lavender roses convey enchantment and love at first sight. A mix of red and white roses symbolizes unity and togetherness.",
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
          background: 'linear-gradient(135deg, #FFF0F5, #FFE4EF)',
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
            Valentine&#39;s Day Flowers Cambodia
          </h1>
          <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 650, margin: '0 auto 12px', lineHeight: 1.6 }}>
            Say &quot;I love you&quot; with the most romantic flowers in Cambodia. Red roses, stunning bouquets, and heartfelt gifts delivered to your Valentine&#39;s door.
          </p>
          <p style={{ fontSize: 15, color: '#9C7A8E', marginBottom: 32 }}>
            ផ្កាថ្ងៃបុណ្យនៃក្តីស្រឡាញ់ — ដឹកជញ្ជូនក្នុងភ្នំពេញ!
          </p>
          <Link href="/shop?occasion=valentine" style={{
            display: 'inline-block',
            background: '#EC4899',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Shop Valentine&#39;s Flowers
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
            Valentine&#39;s Day in Cambodia — A Growing Celebration of Love
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Valentine&#39;s Day has become one of the most celebrated occasions in Cambodia, especially among young couples in Phnom Penh, Siem Reap, and other cities. Every February 14th, the streets bloom with romance — couples exchange gifts, share meals at special restaurants, and surprise each other with beautiful flowers. Red roses are everywhere, and flower shops across the capital are bustling with love.
            </p>
            <p style={{ marginBottom: 16 }}>
              At <strong>Cambodia Floral</strong>, Valentine&#39;s Day is our most special time of year. We prepare weeks in advance to source the finest roses and romantic flowers, ensuring every bouquet we deliver is absolutely perfect. Whether you are in Phnom Penh planning a surprise for your partner, or <Link href="/send-flowers-from-usa" style={{ color: '#EC4899', textDecoration: 'underline' }}>sending Valentine&#39;s flowers from the USA</Link> to someone special in Cambodia, we make your romantic gesture unforgettable.
            </p>
            <p style={{ marginBottom: 16 }}>
              Our Valentine&#39;s collection features premium long-stem red roses, mixed romantic bouquets, rose-and-chocolate combos, and luxury gift packages. Every arrangement is hand-crafted with care and delivered with a personal message from you.
            </p>
          </div>
        </section>

        {/* Rose Color Guide */}
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
              The Meaning Behind Rose Colors
            </h2>
            <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, textAlign: 'center', maxWidth: 600, margin: '0 auto 28px' }}>
              Roses speak a language of their own. Choose the color that perfectly expresses your feelings:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {[
                { color: '#DC2626', emoji: '🌹', title: 'Red Roses', meaning: 'Deep romantic love, passion, desire', desc: 'The quintessential Valentine\'s flower. Nothing says "I love you" more powerfully than a bouquet of red roses. Perfect for partners, spouses, and the love of your life.' },
                { color: '#EC4899', emoji: '🌸', title: 'Pink Roses', meaning: 'Admiration, gratitude, gentle love', desc: 'A softer expression of love and appreciation. Ideal for new relationships, close friends, or expressing gratitude to someone who makes your life beautiful.' },
                { color: '#FAFAFA', emoji: '🤍', title: 'White Roses', meaning: 'Purity, innocence, new beginnings', desc: 'Symbolizing the purity of your love. Beautiful for new couples, proposals, or paired with red roses to create a stunning contrast of passion and purity.' },
                { color: '#EAB308', emoji: '💛', title: 'Yellow Roses', meaning: 'Friendship, joy, warmth', desc: 'A cheerful choice for friends, family members, or colleagues. Yellow roses brighten any day and express warmth without romantic connotations.' },
                { color: '#A855F7', emoji: '💜', title: 'Lavender Roses', meaning: 'Enchantment, love at first sight', desc: 'A unique and enchanting choice that says "I was captivated by you from the first moment." Perfect for expressing that magical, fairytale feeling.' },
                { color: '#FB923C', emoji: '🧡', title: 'Orange Roses', meaning: 'Enthusiasm, desire, excitement', desc: 'Bold and energetic, orange roses express passionate enthusiasm. Great for someone who brings excitement and energy to your life.' },
              ].map((item) => (
                <div key={item.title} style={{
                  background: '#fff',
                  border: '1px solid #FFE4EF',
                  borderRadius: 14,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ fontSize: 12, color: '#EC4899', fontWeight: 600, marginBottom: 8 }}>{item.meaning}</p>
                  <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Valentine's Gifts */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 36,
          }}>
            Popular Valentine&#39;s Day Gifts
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { emoji: '🌹', title: 'Dozen Red Roses', desc: 'The classic Valentine\'s gift. 12 premium long-stem red roses beautifully wrapped with greenery and a love note.', price: 'From $55', link: '/shop?category=bouquets' },
              { emoji: '💐', title: 'Romantic Bouquets', desc: 'Curated mix of roses, lilies, and seasonal flowers in romantic pink, red, and white tones.', price: 'From $45', link: '/shop?category=bouquets' },
              { emoji: '🍫', title: 'Roses + Chocolates', desc: 'Our bestselling Valentine\'s combo: a gorgeous rose bouquet paired with premium Belgian chocolates.', price: 'From $65', link: '/shop?category=baskets' },
              { emoji: '🧸', title: 'Roses + Teddy Bear', desc: 'A charming combo of red roses with a plush teddy bear. Especially loved by girlfriends and younger partners.', price: 'From $60', link: '/shop?category=baskets' },
              { emoji: '🎂', title: 'Roses + Cake', desc: 'Celebrate love with flowers and a heart-shaped cake. Available in chocolate, red velvet, and strawberry.', price: 'From $75', link: '/shop?category=cakes' },
              { emoji: '👑', title: 'Luxury Package', desc: 'Premium 50-stem roses, champagne, chocolates, and a personalized love letter. The ultimate Valentine\'s surprise.', price: 'From $150', link: '/shop?category=bouquets' },
            ].map((item) => (
              <Link key={item.title} href={item.link} style={{
                background: '#FFF8FC',
                border: '1px solid #FFE4EF',
                borderRadius: 14,
                padding: 20,
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all .2s',
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4A3040', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#9C7A8E', lineHeight: 1.5, marginBottom: 8 }}>{item.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#EC4899' }}>{item.price}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Ordering Tips */}
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
              Valentine&#39;s Day Ordering Tips
            </h2>
            <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                <strong>1. Order early — at least 3-5 days before February 14th.</strong> Valentine&#39;s Day is the busiest day of the year for flower delivery in Cambodia. Premium roses and popular arrangements sell out fast. Ordering early guarantees you get exactly what you want and your preferred delivery time slot.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>2. Choose your delivery time wisely.</strong> We offer three Valentine&#39;s delivery windows: morning surprise (8-11 AM) for waking up to flowers, afternoon (11 AM-3 PM) for office deliveries, and evening (3-7 PM) for pre-dinner romance. Morning deliveries are the most popular, so book early.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>3. Add a personal touch.</strong> Every order includes a free greeting card. Take time to write a heartfelt message — it makes the gift so much more meaningful than flowers alone. If you want the message in Khmer, our team can help with the script.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>4. Consider a combo gift.</strong> Flowers alone are wonderful, but pairing them with chocolates, a <Link href="/shop?category=cakes" style={{ color: '#EC4899', textDecoration: 'underline' }}>cake</Link>, or a teddy bear creates a truly memorable Valentine&#39;s surprise. Our combo packages are our best sellers.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>5. For last-minute orders — contact us directly.</strong> If it is February 14th and you have not ordered yet, do not panic. Contact us immediately and we will do our best to prepare and deliver something beautiful. We keep emergency stock for last-minute romantics, but selection may be limited.
              </p>
            </div>
          </div>
        </section>

        {/* Romantic Messages */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Romantic Messages for Your Valentine&#39;s Card
          </h2>
          <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, textAlign: 'center', maxWidth: 600, margin: '0 auto 24px' }}>
            Need inspiration? Here are some heartfelt messages in English and Khmer:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { english: 'You are the love of my life. Happy Valentine\'s Day!', khmer: 'អ្នកជាក្តីស្រឡាញ់នៃជីវិតខ្ញុំ។ រីករាយថ្ងៃបុណ្យនៃក្តីស្រឡាញ់!' },
              { english: 'Every day with you is Valentine\'s Day.', khmer: 'រៀងរាល់ថ្ងៃជាមួយអ្នកគឺជាថ្ងៃបុណ្យនៃក្តីស្រឡាញ់។' },
              { english: 'My heart belongs to you, today and always.', khmer: 'បេះដូងរបស់ខ្ញុំជារបស់អ្នក ថ្ងៃនេះនិងជានិច្ច។' },
              { english: 'To the most beautiful person in my world.', khmer: 'ជូនមនុស្សស្រស់ស្អាតជាងគេក្នុងពិភពលោករបស់ខ្ញុំ។' },
              { english: 'Distance cannot diminish my love for you.', khmer: 'ចម្ងាយមិនអាចបន្ថយក្តីស្រឡាញ់ដែលខ្ញុំមានចំពោះអ្នកបានឡើយ។' },
              { english: 'You make my life more beautiful every day.', khmer: 'អ្នកធ្វើឱ្យជីវិតខ្ញុំកាន់តែស្រស់ស្អាតរៀងរាល់ថ្ងៃ។' },
            ].map((msg, i) => (
              <div key={i} style={{
                background: '#FFF8FC',
                border: '1px solid #FFE4EF',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 14, color: '#4A3040', fontWeight: 500, marginBottom: 6 }}>&quot;{msg.english}&quot;</p>
                <p style={{ fontSize: 13, color: '#9C7A8E' }}>{msg.khmer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sending from Abroad */}
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
              Sending Valentine&#39;s Flowers from Abroad
            </h2>
            <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                If your Valentine is in Cambodia while you are in the USA, Europe, or elsewhere, we make it easy to bridge the distance with a beautiful surprise. Many of our Valentine&#39;s Day orders come from Cambodian Americans, expats, and international partners who want to show their love across the miles.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>How it works:</strong> Order online, pay with PayPal, and we deliver fresh flowers locally in Cambodia. Since Cambodia is 12-15 hours ahead of US time zones, you can order on the evening of February 13th (US time) and have flowers delivered on Valentine&#39;s morning in Cambodia. Read our complete <Link href="/send-flowers-from-usa" style={{ color: '#EC4899', textDecoration: 'underline' }}>guide to sending flowers from the USA</Link>.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Important for international orders:</strong> Order by February 10th to guarantee availability, especially for premium rose bouquets. We send photo confirmation of delivery so you can see your Valentine&#39;s smile from anywhere in the world.
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
            Valentine&#39;s Day Flowers FAQ
          </h2>
          {[
            {
              q: "What are the best Valentine's Day flowers to send in Cambodia?",
              a: "Red roses are the undisputed champion of Valentine's Day flowers in Cambodia. A dozen long-stem red roses is the classic choice. Other popular options include pink roses for a softer expression of love, mixed romantic bouquets combining roses with lilies and orchids, and luxury arrangements with 50+ stems for a truly grand gesture.",
            },
            {
              q: "How early should I order Valentine's Day flowers?",
              a: "We strongly recommend ordering 3-5 days before February 14th. Valentine's Day is our busiest day, and premium roses and popular combos sell out quickly. For international orders (especially from the USA), order by February 10th. Early birds get the best selection and guaranteed delivery time slots.",
            },
            {
              q: 'Can you deliver flowers on February 14th in Phnom Penh?',
              a: "Absolutely! We deliver throughout Valentine's Day in three time windows: morning (8-11 AM), afternoon (11 AM-3 PM), and evening (3-7 PM). Morning delivery is most popular for the 'wake up to roses' surprise, while evening delivery pairs perfectly with dinner plans. Pre-order to secure your slot.",
            },
            {
              q: 'What do different rose colors mean?',
              a: 'Red roses symbolize deep romantic love and passion. Pink roses express admiration and gentle affection. White roses mean purity and new beginnings. Yellow roses represent friendship and joy. Lavender roses convey enchantment and love at first sight. Orange roses express enthusiasm and desire. A mix of red and white means unity and togetherness.',
            },
            {
              q: "What if I forgot to order and it's already Valentine's Day?",
              a: "Contact us immediately! We keep emergency stock specifically for last-minute Valentine's orders. While our full catalog may not be available, we can create a beautiful romantic bouquet with whatever premium flowers we have. Call or message us as early as possible on February 14th for the best options.",
            },
            {
              q: "Can I send Valentine's flowers to Cambodia from the USA?",
              a: "Yes! Many of our Valentine's orders come from abroad. Order online, pay with PayPal, and we deliver fresh flowers locally. Thanks to the time zone difference, you can order on Feb 13th evening (US time) for delivery on Valentine's morning in Cambodia. We send photo confirmation so you can share the moment.",
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
          background: 'linear-gradient(135deg, #EC4899, #DC2626)',
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
            Make This Valentine&#39;s Day Unforgettable
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Premium roses, romantic bouquets, and heartfelt gifts delivered with love. Order now to secure your Valentine&#39;s delivery.
          </p>
          <Link href="/shop?occasion=valentine" style={{
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
            Shop Valentine&#39;s Collection
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
            Custom Romantic Order
          </Link>
        </section>

        <Footer />
      </div>
    </>
  )
}
