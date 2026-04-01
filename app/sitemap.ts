import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('cf_products')
    .select('id, category, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const productUrls = (products ?? []).map((p) => ({
    url: `https://cambodiafloral.com/shop/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categories = ['bouquets', 'arrangements', 'baskets', 'wedding', 'sympathy', 'plants', 'cakes', 'gifts']
  const categoryUrls = categories.map((c) => ({
    url: `https://cambodiafloral.com/shop?category=${c}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const occasions = ['Birthday', 'Anniversary', "Valentine's", 'Congratulations', 'Get Well', 'Sympathy']
  const occasionUrls = occasions.map((o) => ({
    url: `https://cambodiafloral.com/shop?occasion=${encodeURIComponent(o)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    { url: 'https://cambodiafloral.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://cambodiafloral.com/shop', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://cambodiafloral.com/send-flowers-to-cambodia', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://cambodiafloral.com/phnom-penh-flower-delivery', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://cambodiafloral.com/send-flowers-from-usa', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://cambodiafloral.com/khmer-wedding-flowers', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://cambodiafloral.com/birthday-flowers-cambodia', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://cambodiafloral.com/sympathy-funeral-flowers-cambodia', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://cambodiafloral.com/valentines-day-flowers-cambodia', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: 'https://cambodiafloral.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://cambodiafloral.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://cambodiafloral.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://cambodiafloral.com/track', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ...categoryUrls,
    ...occasionUrls,
    ...productUrls,
  ]
}
