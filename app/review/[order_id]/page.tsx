import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServiceClient } from '@/lib/supabase/server'
import ReviewForm from './ReviewForm'

export const metadata = { title: 'Leave a Review', robots: { index: false } }

interface Props {
  params: Promise<{ order_id: string }>
}

const ELIGIBLE = ['confirmed', 'preparing', 'out_for_delivery', 'delivered']

export default async function ReviewPage({ params }: Props) {
  const { order_id } = await params
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('cf_orders')
    .select('id, status, sender_name, cf_order_items(product_id, title, image_url)')
    .eq('id', order_id)
    .maybeSingle()

  const { data: existing } = await supabase
    .from('cf_reviews')
    .select('product_id')
    .eq('order_id', order_id)

  const wrap = (msg: string, sub: string) => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>{msg}</h1>
        <p style={{ color: '#9C7A8E' }}>{sub}</p>
      </div>
      <Footer />
    </div>
  )

  if (!order) return wrap('Order not found', 'This review link is invalid.')
  if (!ELIGIBLE.includes(order.status)) return wrap('Not ready for review yet', 'You can review your flowers once the order is confirmed.')

  // Dedupe items by product (an order may list the same product once)
  const seen = new Set<string>()
  const items = (order.cf_order_items || []).filter(i => {
    if (seen.has(i.product_id)) return false
    seen.add(i.product_id)
    return true
  })
  const reviewed = new Set((existing || []).map(r => r.product_id))
  const firstName = (order.sender_name || '').split(' ')[0] || ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 30, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>
          How were your flowers? 🌸
        </h1>
        <p style={{ color: '#9C7A8E', marginBottom: 32 }}>
          Your feedback helps other customers and means a lot to us. Reviewing order #{order.id.slice(0, 8)}.
        </p>
        <ReviewForm
          orderId={order.id}
          items={items}
          reviewedProductIds={Array.from(reviewed)}
          defaultAuthor={firstName}
        />
      </div>
      <Footer />
    </div>
  )
}
