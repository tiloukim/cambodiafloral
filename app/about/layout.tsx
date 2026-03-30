import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Cambodia Floral',
  description: 'Cambodia Floral is Cambodia\'s premier online flower delivery service. We deliver fresh bouquets, arrangements, cakes, and gift baskets to Phnom Penh, Siem Reap, Battambang, and across Cambodia.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
