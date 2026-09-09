'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Reward {
  code: string
  percent: number
  expiresAt: string | null
}

/**
 * "You have a discount waiting." Shown on the account once a customer has
 * earned the survey reward and not yet spent it — so it lives somewhere they
 * can find it, rather than only in an email they may have deleted.
 */
export default function RewardCard() {
  const [reward, setReward] = useState<Reward | null>(null)

  useEffect(() => {
    fetch('/api/promo/reward')
      .then(r => r.json())
      .then(d => setReward(d.reward || null))
      .catch(() => {})
  }, [])

  if (!reward) return null

  const expiry = reward.expiresAt
    ? new Date(reward.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF0F5, #FFE4EF)',
      border: '2px dashed #EC4899',
      borderRadius: 16,
      padding: 24,
      marginBottom: 32,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 32, lineHeight: 1 }}>🎁</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#EC4899', margin: '10px 0 4px' }}>
        You have {reward.percent}% off waiting
      </h2>
      <p style={{ fontSize: 14, color: '#7A5A6A', margin: '0 0 16px', lineHeight: 1.6 }}>
        Earned for rating your order and telling us how you found us. Thank you — it genuinely helps.
      </p>

      <div style={{
        display: 'inline-block', background: '#fff', border: '2px dashed #EC4899', borderRadius: 10,
        padding: '10px 22px', fontFamily: 'monospace', fontSize: 18, fontWeight: 800,
        color: '#4A3040', letterSpacing: 2,
      }}>
        {reward.code}
      </div>

      <p style={{ fontSize: 12, color: '#9C7A8E', margin: '12px 0 0', lineHeight: 1.6 }}>
        Applied automatically at your next checkout — you don&apos;t need to enter it.
        {expiry && <> Valid until {expiry}.</>}
      </p>

      <div style={{ marginTop: 16 }}>
        <Link href="/shop" style={{
          display: 'inline-block', background: '#EC4899', color: '#fff', textDecoration: 'none',
          padding: '11px 26px', borderRadius: 50, fontSize: 14, fontWeight: 700,
        }}>
          Use it now
        </Link>
      </div>
    </div>
  )
}
