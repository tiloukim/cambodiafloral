import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import AdminAddButton from '@/components/AdminAddButton'
import ChatWidget from '@/components/ChatWidget'
import TelegramButton from '@/components/TelegramButton'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cambodia Floral - Send Flowers to Cambodia | Flower Delivery Phnom Penh',
    template: '%s | Cambodia Floral',
  },
  description: 'Send beautiful flowers to your loved ones in Phnom Penh, Cambodia. Fresh bouquets, roses, arrangements, cakes, and gift baskets delivered same-day. Other provinces coming soon! Order online today!',
  keywords: [
    'flowers cambodia', 'send flowers to cambodia', 'flower delivery cambodia',
    'phnom penh florist', 'cambodia bouquet', 'roses cambodia', 'flower shop phnom penh',
    'send flowers phnom penh', 'cambodia flower delivery', 'birthday flowers cambodia',
    'valentine flowers cambodia', 'wedding flowers cambodia', 'sympathy flowers cambodia',
    'cake delivery cambodia', 'gift baskets cambodia', 'same day flower delivery cambodia',
    'ផ្កា', 'ផ្កាកម្ពុជា', 'ដឹកជញ្ជូនផ្កា', 'ផ្កាភ្នំពេញ',
  ],
  metadataBase: new URL('https://cambodiafloral.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Cambodia Floral - Send Flowers to Cambodia',
    description: 'Fresh bouquets, roses, arrangements, cakes & gift baskets delivered same-day in Phnom Penh. Order online!',
    url: 'https://cambodiafloral.com',
    siteName: 'Cambodia Floral',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Cambodia Floral - Flower Delivery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cambodia Floral - Send Flowers to Cambodia',
    description: 'Fresh bouquets, roses, cakes & gift baskets delivered same-day in Phnom Penh.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  verification: {},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Florist',
              name: 'Cambodia Floral',
              url: 'https://cambodiafloral.com',
              logo: 'https://cambodiafloral.com/logo.png',
              description: 'Send beautiful flowers, bouquets, cakes and gift baskets in Phnom Penh, Cambodia. Same-day delivery available. Other provinces coming soon.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Phnom Penh',
                addressCountry: 'KH',
              },
              areaServed: [
                { '@type': 'City', name: 'Phnom Penh' },
              ],
              priceRange: '$45 - $250',
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '08:00',
                closes: '20:00',
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <AdminAddButton />
            <TelegramButton />
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
