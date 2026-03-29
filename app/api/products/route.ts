import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const supabase = createServiceClient()

  // If ?next_sku=category is passed, return the next SKU for that category
  const nextSkuCategory = req.nextUrl.searchParams.get('next_sku')
  if (nextSkuCategory) {
    if (!await isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const sku = await generateSku(supabase, nextSkuCategory)
    return NextResponse.json({ sku })
  }

  const { data, error } = await supabase
    .from('cf_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

const CATEGORY_PREFIXES: Record<string, string> = {
  bouquets: 'BQ',
  arrangements: 'AR',
  baskets: 'BK',
  wedding: 'WD',
  sympathy: 'SY',
  plants: 'PL',
  cakes: 'CK',
  gifts: 'GF',
}

async function generateSku(supabase: ReturnType<typeof createServiceClient>, category: string): Promise<string> {
  const prefix = CATEGORY_PREFIXES[category] || 'GN'

  // Find the highest existing SKU number for this category prefix
  // Support both old format (CF-XX-NNN) and new format (XX-NNN)
  const { data: existing } = await supabase
    .from('cf_products')
    .select('sku')
    .or(`sku.like.${prefix}-%,sku.like.CF-${prefix}-%`)
    .order('sku', { ascending: false })
    .limit(10)

  let maxNum = 0
  if (existing) {
    for (const row of existing) {
      if (!row.sku) continue
      const match = row.sku.match(/(?:CF-)?[A-Z]{2,3}-(\d+)/)
      if (match) {
        const num = parseInt(match[1])
        if (num > maxNum) maxNum = num
      }
    }
  }

  return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`
}

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const supabase = createServiceClient()

  // Auto-generate SKU if not provided
  const sku = body.sku || await generateSku(supabase, body.category || 'bouquets')

  const { data, error } = await supabase
    .from('cf_products')
    .insert({
      title: body.title,
      sku,
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
