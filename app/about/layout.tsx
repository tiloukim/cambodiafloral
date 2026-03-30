import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Cambodia Floral',
  description: 'Cambodia Floral is Cambodia\'s premier online flower delivery service. We deliver fresh bouquets, arrangements, cakes, and gift baskets in Phnom Penh. Expanding to other provinces soon!',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
