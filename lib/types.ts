export interface Product {
  id: string
  sku: string | null
  title: string
  cost: number
  price: number
  compare_price: number | null
  category: string
  occasion: string | null
  description: string
  image_url: string
  image_urls: string[]
  stock: number
  badge: string | null
  is_active: boolean
  created_at: string
}

export interface CartItem {
  id: string
  sku: string | null
  title: string
  price: number
  qty: number
  img: string
}

export interface Customer {
  id: string
  auth_id: string | null
  email: string
  name: string
  phone: string | null
  country: string | null
  is_admin: boolean
  created_at: string
}

export interface Order {
  id: string
  customer_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string | null
  payment_id: string | null
  sender_name: string
  sender_email: string
  sender_phone: string | null
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  recipient_city: string
  delivery_date: string | null
  delivery_time: string | null
  delivery_notes: string | null
  card_message: string | null
  tracking_number: string | null
  discount: number | null
  promo_code: string | null
  heard_from: string | null
  heard_from_detail: string | null
  feedback_rating: number | null
  feedback_comment: string | null
  review_requested_at: string | null
  payment_fee: number | null
  payment_net: number | null
  cogs?: number
  fee?: number
  feeEstimated?: boolean
  profit?: number
  delivered_at: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  sku: string | null
  title: string
  price: number
  quantity: number
  image_url: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  order_id: string | null
  is_read: boolean
  created_at: string
}
