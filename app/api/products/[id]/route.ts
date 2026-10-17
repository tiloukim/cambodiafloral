import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('cf_products')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // /shop and the landing pages are statically cached, so an edit saved to the
  // database would otherwise keep showing the old price until the next deploy.
  purgeStorefront(id)

  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('cf_products')
    .update({ is_active: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Hiding a product has to drop it from the cached grid too.
  purgeStorefront(id)

  return NextResponse.json({ success: true })
}

/** Drop the cached storefront pages that show this product. */
function purgeStorefront(id: string) {
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath(`/shop/${id}`)
  // Landing pages list products too; a layout-level purge covers them all.
  revalidatePath('/', 'layout')
}
