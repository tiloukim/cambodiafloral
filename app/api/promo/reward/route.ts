import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { findUsableReward } from '@/lib/rewards'

// The signed-in customer's own reward, so checkout can show the discount
// before they pay. Checkout applies it server-side regardless — this endpoint
// only exists so the total on screen matches the total they're charged.
export async function GET() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ reward: null })

  const supabase = createServiceClient()
  const { data: customer } = await supabase
    .from('cf_customers')
    .select('id')
    .eq('auth_id', user.id)
    .maybeSingle()

  if (!customer) return NextResponse.json({ reward: null })

  const reward = await findUsableReward(supabase, customer.id)
  return NextResponse.json({ reward })
}
