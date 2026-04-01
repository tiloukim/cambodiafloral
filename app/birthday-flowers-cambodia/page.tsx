import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Birthday Flowers & Gifts Cambodia | Same-Day Delivery | Cambodia Floral',
  description: 'Send beautiful birthday flowers and gifts in Cambodia. Same-day delivery in Phnom Penh & Siem Reap. Bouquets, roses, cakes & gift combos. Order online for a perfect birthday surprise!',
  keywords: [
    'birthday flowers Cambodia', 'birthday gift Phnom Penh', 'birthday delivery Cambodia',
    'send birthday flowers Cambodia', 'birthday bouquet Phnom Penh', 'birthday cake delivery Cambodia',
    'birthday roses Cambodia', 'birthday gift delivery Phnom Penh', 'happy birthday flowers Cambodia',
    'ផ្កាថ្ងៃកំណើត', 'កាដូថ្ងៃកំណើតភ្នំពេញ', 'surprise birthday delivery Cambodia',
    'birthday flowers and cake Cambodia', 'birthday gift ideas Cambodia',
  ],
  alternates: { canonical: 'https://cambodiafloral.com/birthday-flowers-cambodia' },
  openGraph: {
    title: 'Birthday Flowers & Gifts Cambodia | Same-Day Delivery',
    description: 'Beautiful birthday flowers, cakes & gifts delivered same-day in Phnom Penh. Surprise your loved ones with a stunning birthday bouquet!',
    url: 'https://cambodiafloral.com/birthday-flowers-cambodia',
    type: 'article',
  },
}

export default function BirthdayFlowersCambodiaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best birthday flowers to send in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The most popular birthday flowers in Cambodia include roses (especially pink and red), sunflowers for cheerfulness, mixed colorful bouquets, lilies for elegance, and gerbera daisies for fun. Orchids are also a sophisticated choice. The best flower depends on the recipient\'s personality and your relationship.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I add a birthday cake to my flower delivery in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Cambodia Floral offers birthday flower and cake combos. Choose from a variety of cakes including chocolate, fruit, red velvet, and custom designs. Cakes are freshly prepared by local bakeries and delivered together with your flowers for the perfect birthday surprise.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer same-day birthday flower delivery in Cambodia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer same-day delivery for orders placed before 2:00 PM Cambodia time (GMT+7). This applies to Phnom Penh and Siem Reap. For last-minute birthday orders, contact us directly and we\'ll do our best to accommodate you.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I write on a birthday card in Khmer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common Khmer birthday messages include "សួស្ដីថ្ងៃកំណើត" (Happy Birthday), "សូមឱ្យមានសុខភាពល្អ" (Wishing you good health), and "សូមអោយជោគជ័យគ្រប់បែបយ៉ាង" (Wishing you success in everything). Our team can help write a personalized Khmer message on your card.',
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
            Birthday Flowers &amp; Gifts Cambodia
          </h1>
          <p style={{ fontSize: 18, color: '#7A5A6A', maxWidth: 650, margin: '0 auto 12px', lineHeight: 1.6 }}>
            Make their birthday unforgettable with a stunning bouquet, a delicious cake, or a beautiful gift combo — delivered right to their door in Phnom Penh.
          </p>
          <p style={{ fontSize: 15, color: '#9C7A8E', marginBottom: 32 }}>
            ផ្កានិងកាដូថ្ងៃកំណើត — ដឹកជញ្ជូនថ្ងៃតែមួយក្នុងកម្ពុជា!
          </p>
          <Link href="/shop?occasion=birthday" style={{
            display: 'inline-block',
            background: '#EC4899',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Shop Birthday Flowers
          </Link>
        </section>

        {/* Why Send Birthday Flowers */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Why Birthday Flowers Are the Perfect Gift in Cambodia
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              Birthdays are celebrated with great enthusiasm in Cambodia, and flowers are one of the most cherished gifts you can give. Whether you are celebrating a family member, a friend, a partner, or a colleague, a beautiful birthday bouquet says &quot;I care about you&quot; in a way that no other gift can. Fresh flowers bring color, fragrance, and joy to the special day.
            </p>
            <p style={{ marginBottom: 16 }}>
              At <strong>Cambodia Floral</strong>, we make birthday gifting easy and delightful. Our curated collection of birthday bouquets, flower-and-cake combos, and gift baskets are designed to create unforgettable moments. And with <strong>same-day delivery</strong> throughout Phnom Penh and Siem Reap, even a last-minute gift idea can turn into a stunning surprise.
            </p>
            <p style={{ marginBottom: 16 }}>
              Whether you are in Cambodia or <Link href="/send-flowers-from-usa" style={{ color: '#EC4899', textDecoration: 'underline' }}>sending birthday flowers from the USA</Link>, our online ordering process is simple and our delivery is reliable. We even send you a <strong>photo confirmation</strong> so you can see the smile on their face.
            </p>
          </div>
        </section>

        {/* Popular Birthday Flowers */}
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
              Popular Birthday Flowers in Cambodia
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {[
                { emoji: '🌹', title: 'Roses', desc: 'The timeless birthday classic. Pink roses for appreciation, red for love, yellow for friendship, and mixed colors for a joyful celebration.', link: '/shop?category=bouquets' },
                { emoji: '🌻', title: 'Sunflowers', desc: 'Bright, cheerful, and impossible not to smile at. Sunflower bouquets are perfect for friends and colleagues with a sunny personality.', link: '/shop?category=bouquets' },
                { emoji: '🌸', title: 'Lilies', desc: 'Elegant and fragrant, lilies are a sophisticated birthday choice. Particularly popular for mothers, aunts, and women who appreciate classic beauty.', link: '/shop?category=arrangements' },
                { emoji: '💐', title: 'Mixed Bouquets', desc: 'A colorful medley of seasonal flowers creates a vibrant, joyful arrangement. Our florists select the freshest blooms for maximum impact.', link: '/shop?category=bouquets' },
                { emoji: '🌺', title: 'Orchids', desc: 'Luxurious and long-lasting, orchid plants make a distinguished birthday gift. They continue blooming for weeks, a lasting reminder of your love.', link: '/shop?category=arrangements' },
                { emoji: '🌼', title: 'Gerbera Daisies', desc: 'Fun, colorful, and youthful. Gerberas in bright pinks, oranges, and yellows are ideal for younger recipients and casual celebrations.', link: '/shop?category=bouquets' },
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

        {/* Age-Appropriate Guide */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Choosing the Right Birthday Flowers by Recipient
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              <strong>For Your Partner or Spouse:</strong> Red roses remain the gold standard for romantic birthday gifts. Consider a premium long-stem rose bouquet paired with chocolates. A dozen red roses with a heartfelt card is a beautiful way to say &quot;you are my everything.&quot; For an extra-special touch, add a <Link href="/shop?category=cakes" style={{ color: '#EC4899', textDecoration: 'underline' }}>birthday cake</Link>.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>For Mom or Grandmother:</strong> Pink roses, lilies, or elegant mixed arrangements work beautifully. Cambodian mothers appreciate traditional flowers with a personal message in Khmer. Consider adding a fruit basket or premium tea set for an extra-special gift.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>For Dad or Grandfather:</strong> While flowers might seem unexpected, a striking sunflower arrangement or tropical orchid plant is a sophisticated gift for Cambodian fathers. Pair it with a gift basket of premium snacks or wine.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>For a Friend:</strong> Bright, fun arrangements like sunflowers, gerbera daisies, or colorful mixed bouquets match the celebratory spirit of friendship. A flowers-and-cake combo is the ultimate friend birthday gift.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>For a Colleague:</strong> Professional yet thoughtful arrangements like a vase of white lilies, a mini orchid plant, or a cheerful desk-sized bouquet are perfect for office birthdays. Pair with a box of chocolates for added appeal.
            </p>
          </div>
        </section>

        {/* Combo Gifts */}
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
              Birthday Combo Gifts — Flowers + More
            </h2>
            <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, textAlign: 'center', maxWidth: 600, margin: '0 auto 28px' }}>
              Take your birthday surprise to the next level by combining flowers with these popular add-ons:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {[
                { emoji: '🎂', title: 'Flowers + Cake', desc: 'Our most popular birthday combo. Choose from chocolate, vanilla, fruit, red velvet, or custom cakes. Delivered together for maximum impact.', link: '/shop?category=cakes' },
                { emoji: '🍫', title: 'Flowers + Chocolates', desc: 'Premium chocolates paired with a beautiful bouquet. A sweet, romantic gift for partners and friends alike.', link: '/shop?category=baskets' },
                { emoji: '🧸', title: 'Flowers + Teddy Bear', desc: 'A cute stuffed animal paired with a bright bouquet — perfect for girlfriends, children, and young-at-heart recipients.', link: '/shop?category=baskets' },
                { emoji: '🧺', title: 'Flowers + Gift Basket', desc: 'Gourmet snacks, wine, fruit, or spa items combined with a floral arrangement for a luxurious birthday gift.', link: '/shop?category=baskets' },
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

        {/* Surprise Delivery Tips */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#4A3040',
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Tips for a Perfect Birthday Surprise Delivery
          </h2>
          <div style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              <strong>1. Schedule the delivery time.</strong> For the best surprise, choose a morning delivery so the birthday person starts their day with flowers. You can specify a preferred delivery window when placing your order.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>2. Coordinate with someone local.</strong> If you are ordering from abroad, ask a friend or family member in Cambodia to make sure the birthday person will be at the delivery address. This ensures a smooth surprise.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>3. Write a heartfelt message.</strong> Every order includes a free greeting card. Take time to write a meaningful message. If you want the message in Khmer script, our team can help translate your words.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>4. Consider their workplace.</strong> A birthday flower delivery to someone&#39;s office creates a wonderful moment in front of colleagues. It is one of the most popular surprise delivery options we handle.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>5. Order in advance for custom arrangements.</strong> While we offer same-day delivery, ordering 1-2 days ahead gives our florists time to create something truly special. Use our <Link href="/custom-order" style={{ color: '#EC4899', textDecoration: 'underline' }}>custom order form</Link> for personalized arrangements.
            </p>
          </div>
        </section>

        {/* Birthday Messages in Khmer */}
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
              Birthday Messages in Khmer
            </h2>
            <p style={{ fontSize: 15, color: '#7A5A6A', lineHeight: 1.8, textAlign: 'center', maxWidth: 600, margin: '0 auto 24px' }}>
              Add a personal touch with a Khmer birthday message on your card. Here are some popular options:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { khmer: 'សួស្ដីថ្ងៃកំណើត!', english: 'Happy Birthday!' },
                { khmer: 'សូមឱ្យមានសុខភាពល្អ និងជោគជ័យ', english: 'Wishing you good health and success' },
                { khmer: 'សូមអោយជោគជ័យគ្រប់បែបយ៉ាង', english: 'Wishing you success in everything' },
                { khmer: 'រីករាយថ្ងៃកំណើត ស្រឡាញ់ច្រើន!', english: 'Happy Birthday, much love!' },
                { khmer: 'សូមឱ្យសុបិន្តទាំងអស់ក្លាយជាការពិត', english: 'May all your dreams come true' },
                { khmer: 'ស្រឡាញ់ និងនឹកយ៉ាងខ្លាំង', english: 'Love and miss you so much' },
              ].map((msg, i) => (
                <div key={i} style={{
                  background: '#fff',
                  border: '1px solid #FFE4EF',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 16, color: '#4A3040', fontWeight: 600, marginBottom: 4 }}>{msg.khmer}</p>
                  <p style={{ fontSize: 13, color: '#9C7A8E' }}>{msg.english}</p>
                </div>
              ))}
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
            Birthday Flowers FAQ
          </h2>
          {[
            {
              q: 'What are the best birthday flowers to send in Cambodia?',
              a: 'The most popular birthday flowers include pink and red roses, sunflowers, lilies, mixed colorful bouquets, gerbera daisies, and orchids. For romantic partners, red roses are classic. For friends, sunflowers and mixed bouquets bring joy. For parents and elders, elegant lilies or orchid plants show respect and love.',
            },
            {
              q: 'Can I add a cake to my flower delivery?',
              a: 'Yes! Our flower-and-cake combos are our most popular birthday gifts. Choose from chocolate, vanilla, fruit, red velvet, cheesecake, and more. Cakes are freshly baked by trusted local bakeries and delivered together with your flowers. You can browse cake options in our shop.',
            },
            {
              q: 'Do you offer same-day birthday delivery?',
              a: 'Yes, we offer same-day delivery for orders placed before 2:00 PM Cambodia time (GMT+7). This applies to Phnom Penh and Siem Reap. For last-minute orders placed after the cutoff, contact us directly and we\'ll do our best to help. For guaranteed same-day delivery on busy days, order as early as possible.',
            },
            {
              q: 'What should I write on a birthday card?',
              a: 'We include a free greeting card with every order. Write from the heart — the message matters more than perfection. If you want your message in Khmer, our team can help translate. Popular messages include "Happy Birthday" (សួស្ដីថ្ងៃកំណើត), "Wishing you health and happiness" (សូមឱ្យមានសុខភាពល្អ), and "Love and miss you" (ស្រឡាញ់ និងនឹកយ៉ាងខ្លាំង).',
            },
            {
              q: 'Can I send birthday flowers to Cambodia from abroad?',
              a: 'Absolutely! Many of our birthday orders come from loved ones in the USA, Australia, France, and other countries. Pay securely with PayPal and we handle the rest. Visit our guide to sending flowers from the USA for detailed instructions.',
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
            Make Their Birthday Bloom!
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Order birthday flowers, cakes, and gifts for same-day delivery in Phnom Penh and Siem Reap.
          </p>
          <Link href="/shop?occasion=birthday" style={{
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
            Shop Birthday Gifts
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
            Custom Birthday Order
          </Link>
        </section>

        <Footer />
      </div>
    </>
  )
}
