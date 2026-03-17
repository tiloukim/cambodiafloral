'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { user, customer, signOut } = useAuth()
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinkStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: '#DC2626',
    textDecoration: 'none',
    background: '#FEE2E2',
    padding: '8px 20px',
    borderRadius: 50,
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #FFE4EF',
      padding: '8px 20px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Cambodia Floral" style={{ height: 144, objectFit: 'contain' }} />
        </Link>

        {/* Desktop nav */}
        <div className="nav-links">
          <Link href="/shop" style={navLinkStyle}>Shop</Link>
          <Link href="/custom-order" style={navLinkStyle}>Custom Order</Link>
          <Link href="/about" style={navLinkStyle}>About</Link>
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
          <Link href="/track" style={navLinkStyle}>Track Order</Link>

          <Link href="/cart" style={{
            position: 'relative',
            fontSize: 27,
            textDecoration: 'none',
            color: '#4A3040',
          }}>
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -12,
                background: '#EC4899',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                width: 20,
                height: 20,
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
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: '#FFF0F5',
                  border: '1px solid #FFD6E8',
                  borderRadius: 50,
                  padding: '9px 22px',
                  fontSize: 18,
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
                  top: 50,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #FFE4EF',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,.08)',
                  minWidth: 180,
                  overflow: 'hidden',
                  zIndex: 60,
                }}>
                  <Link href="/account" onClick={() => setMenuOpen(false)} style={{
                    display: 'block', padding: '12px 18px', fontSize: 15, color: '#4A3040',
                    textDecoration: 'none', borderBottom: '1px solid #FFF0F5',
                  }}>My Account</Link>
                  <Link href="/account/orders" onClick={() => setMenuOpen(false)} style={{
                    display: 'block', padding: '12px 18px', fontSize: 15, color: '#4A3040',
                    textDecoration: 'none', borderBottom: '1px solid #FFF0F5',
                  }}>My Orders</Link>
                  {customer?.is_admin && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                      display: 'block', padding: '12px 18px', fontSize: 15, color: '#DB2777',
                      fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #FFF0F5',
                    }}>Admin Panel</Link>
                  )}
                  <button
                    onClick={async () => { setMenuOpen(false); await signOut(); window.location.href = '/' }}
                    style={{
                      display: 'block', width: '100%', padding: '12px 18px', fontSize: 15,
                      color: '#EF4444', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{
              background: '#EC4899', color: '#fff', padding: '11px 28px', borderRadius: 50,
              fontSize: 18, fontWeight: 700, textDecoration: 'none',
            }}>Sign In</Link>
          )}
        </div>

        {/* Mobile hamburger + cart */}
        <div className="nav-hamburger">
          <Link href="/cart" style={{ position: 'relative', fontSize: 20, textDecoration: 'none', color: '#4A3040' }}>
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -10, background: '#EC4899', color: '#fff',
                fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#4A3040', padding: 4 }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link href="/shop" onClick={() => setMobileOpen(false)} style={navLinkStyle}>Shop</Link>
        <Link href="/custom-order" onClick={() => setMobileOpen(false)} style={navLinkStyle}>Custom Order</Link>
        <Link href="/about" onClick={() => setMobileOpen(false)} style={navLinkStyle}>About</Link>
        <Link href="/contact" onClick={() => setMobileOpen(false)} style={navLinkStyle}>Contact</Link>
        <Link href="/track" onClick={() => setMobileOpen(false)} style={navLinkStyle}>Track Order</Link>
        {user ? (
          <>
            <Link href="/account" onClick={() => setMobileOpen(false)} style={navLinkStyle}>My Account</Link>
            <Link href="/account/orders" onClick={() => setMobileOpen(false)} style={navLinkStyle}>My Orders</Link>
            {customer?.is_admin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} style={{ ...navLinkStyle, color: '#DB2777' }}>Admin Panel</Link>
            )}
            <button
              onClick={async () => { setMobileOpen(false); await signOut(); window.location.href = '/' }}
              style={{ ...navLinkStyle, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >Sign Out</button>
          </>
        ) : (
          <Link href="/login" onClick={() => setMobileOpen(false)} style={{
            display: 'inline-block', background: '#EC4899', color: '#fff', padding: '10px 24px',
            borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center',
          }}>Sign In</Link>
        )}
      </div>
    </nav>
  )
}
