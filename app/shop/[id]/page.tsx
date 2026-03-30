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

export default function ProductPage() {
  return <ProductDetail />
}
