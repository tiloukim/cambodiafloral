import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import AdminAddButton from '@/components/AdminAddButton'
import ChatWidget from '@/components/ChatWidget'
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
  title: 'Cambodia Floral - Send Flowers to Cambodia',
  description: 'Send beautiful flowers to your loved ones in Cambodia. Fresh bouquets, arrangements, and gift baskets delivered across Phnom Penh, Siem Reap, Battambang, and Sihanoukville.',
  keywords: ['flowers cambodia', 'send flowers to cambodia', 'flower delivery cambodia', 'phnom penh florist', 'cambodia bouquet'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <AdminAddButton />
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
