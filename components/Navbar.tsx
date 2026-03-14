'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { user, customer, signOut } = useAuth()
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #FFE4EF',
      padding: '0 20px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 22,
          fontWeight: 700,
          color: '#DB2777',
          textDecoration: 'none',
        }}>
          Cambodia Floral
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/shop" style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#4A3040',
            textDecoration: 'none',
          }}>
            Shop
          </Link>

          <Link href="/track" style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#4A3040',
            textDecoration: 'none',
          }}>
            Track Order
          </Link>

          <Link href="/cart" style={{
            position: 'relative',
            fontSize: 20,
            textDecoration: 'none',
            color: '#4A3040',
          }}>
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -10,
                background: '#EC4899',
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: '#FFF0F5',
                  border: '1px solid #FFD6E8',
                  borderRadius: 50,
                  padding: '6px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#DB2777',
                  cursor: 'pointer',
                }}
              >
                {customer?.name || 'Account'}
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #FFE4EF',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,.08)',
                  minWidth: 160,
                  overflow: 'hidden',
                  zIndex: 60,
                }}>
                  <Link href="/account" onClick={() => setMenuOpen(false)} style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontSize: 13,
                    color: '#4A3040',
                    textDecoration: 'none',
                    borderBottom: '1px solid #FFF0F5',
                  }}>
                    My Account
                  </Link>
                  <Link href="/account/orders" onClick={() => setMenuOpen(false)} style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontSize: 13,
                    color: '#4A3040',
                    textDecoration: 'none',
                    borderBottom: '1px solid #FFF0F5',
                  }}>
                    My Orders
                  </Link>
                  {customer?.is_admin && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                      display: 'block',
                      padding: '10px 16px',
                      fontSize: 13,
                      color: '#DB2777',
                      fontWeight: 600,
                      textDecoration: 'none',
                      borderBottom: '1px solid #FFF0F5',
                    }}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={async () => { setMenuOpen(false); await signOut(); window.location.href = '/' }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: 13,
                      color: '#EF4444',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{
              background: '#EC4899',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
