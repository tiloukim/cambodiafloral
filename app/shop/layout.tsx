import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Flowers & Cakes - Cambodia Floral',
  description: 'Browse our collection of fresh bouquets, flower arrangements, gift baskets, wedding flowers, cakes, and more. Same-day delivery in Phnom Penh. Other provinces coming soon!',
  openGraph: {
    title: 'Shop Flowers & Cakes | Cambodia Floral',
    description: 'Fresh bouquets, arrangements, cakes & gift baskets. Same-day delivery across Cambodia.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
