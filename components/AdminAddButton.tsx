'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminAddButton() {
  const { customer } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Hide on admin pages (already has product management)
  if (!customer?.is_admin || pathname.startsWith('/admin')) return null

  return (
    <button
      onClick={() => router.push('/admin/products')}
      className="admin-fab"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        padding: '14px 24px',
        background: '#EC4899',
        color: '#fff',
        border: 'none',
        borderRadius: 50,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 6px 24px rgba(236,72,153,.4)',
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'inherit',
        transition: 'transform .2s, box-shadow .2s',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
      Add Product
    </button>
  )
}
