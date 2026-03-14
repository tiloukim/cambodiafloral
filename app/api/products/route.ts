import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('cf_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('cf_products')
    .insert({
      title: body.title,
      price: body.price,
      compare_price: body.compare_price || null,
      category: body.category,
      occasion: body.occasion || null,
      image_url: body.image_urls?.[0] || body.image_url,
      image_urls: body.image_urls || (body.image_url ? [body.image_url] : []),
      description: body.description || '',
      badge: body.badge || null,
      stock: body.stock || 10,
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
