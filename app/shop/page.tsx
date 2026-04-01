import { createServiceClient } from '@/lib/supabase/server'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('cf_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return <ShopClient products={data || []} />
}
