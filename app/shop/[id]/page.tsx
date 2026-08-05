import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import ProductDetail from './ProductDetail'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('cf_products')
    .select('title, description, price, category, occasion, image_url')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const title = `${product.title} - $${product.price.toFixed(2)}`
  const description = product.description || `${product.title} - Beautiful ${product.category} from Cambodia Floral. Order online for delivery across Cambodia.`

  return {
    title,
    description,
    openGraph: {
      title: `${product.title} | Cambodia Floral`,
      description,
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 800, alt: product.title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('cf_products')
    .select('title, description, price, category, occasion, image_url')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  // Real, approved reviews → aggregateRating + review schema (star rich results)
  const { data: reviewRows } = await supabase
    .from('cf_reviews')
    .select('author_name, rating, title, body, created_at')
    .eq('product_id', id)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(20)
  const reviews = reviewRows || []
  const reviewCount = reviews.length
  const avgRating = reviewCount ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10 : 0

  const reviewSchema = reviewCount > 0 ? {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map(r => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { '@type': 'Person', name: r.author_name },
      ...(r.body ? { reviewBody: r.body } : {}),
      ...(r.title ? { name: r.title } : {}),
      datePublished: r.created_at,
    })),
  } : {}

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `${product.title} - Beautiful ${product.category} from Cambodia Floral`,
    image: product.image_url || 'https://cambodiafloral.com/og-image.png',
    url: `https://cambodiafloral.com/shop/${id}`,
    brand: {
      '@type': 'Brand',
      name: 'Cambodia Floral',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Cambodia Floral',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'KH',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
        },
      },
    },
    category: product.category,
    ...reviewSchema,
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetail />
    </>
  )
}
