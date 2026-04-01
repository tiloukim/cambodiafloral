import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Google Merchant Center Product Feed (RSS/XML)
// URL: https://cambodiafloral.com/api/feed
export async function GET() {
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('cf_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const items = (products || []).map(p => {
    const imageUrl = p.image_url?.startsWith('http')
      ? p.image_url
      : `https://cambodiafloral.com${p.image_url || '/og-image.png'}`

    const category = (p.category || 'bouquets').toLowerCase()
    const googleCategory = categoryMap[category] || 'Home & Garden > Plants > Flowers'

    return `    <item>
      <g:id>${p.id}</g:id>
      <title><![CDATA[${p.title}]]></title>
      <description><![CDATA[${p.description || `${p.title} - Fresh flowers from Cambodia Floral. Order online for same-day delivery in Phnom Penh.`}]]></description>
      <link>https://cambodiafloral.com/shop/${p.id}</link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${Number(p.price).toFixed(2)} USD</g:price>${p.compare_price ? `\n      <g:sale_price>${Number(p.price).toFixed(2)} USD</g:sale_price>` : ''}
      <g:brand>Cambodia Floral</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type>${capitalize(category)}</g:product_type>
      <g:shipping>
        <g:country>KH</g:country>
        <g:service>Same-Day Delivery</g:service>
        <g:price>0 USD</g:price>
      </g:shipping>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Cambodia Floral - Products</title>
    <link>https://cambodiafloral.com</link>
    <description>Fresh flowers, bouquets, cakes and gift baskets delivered in Phnom Penh, Cambodia</description>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

const categoryMap: Record<string, string> = {
  bouquets: 'Home & Garden > Plants > Flowers',
  arrangements: 'Home & Garden > Plants > Flowers',
  baskets: 'Food, Beverages & Tobacco > Food Items > Bakery > Cakes & Desserts',
  wedding: 'Home & Garden > Plants > Flowers',
  sympathy: 'Home & Garden > Plants > Flowers',
  plants: 'Home & Garden > Plants',
  cakes: 'Food, Beverages & Tobacco > Food Items > Bakery > Cakes & Desserts',
  gifts: 'Arts & Entertainment > Party & Celebration > Gift Giving > Gift Baskets',
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
