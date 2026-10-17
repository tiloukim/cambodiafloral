import { createServiceClient } from '@/lib/supabase/server'
import ShopClient from './ShopClient'

// The grid is prerendered for speed and SEO, which meant an edited price kept
// showing the old value until the next deploy — one page was found serving
// 3.5-day-old HTML. Saving a product now purges this page outright; this is
// the backstop for anything that changes products without going through the
// admin API (a direct database edit, say).
export const revalidate = 300

export default async function ShopPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('cf_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return <ShopClient products={data || []} />
}
