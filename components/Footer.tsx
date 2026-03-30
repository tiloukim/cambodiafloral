import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#4A3040',
      color: '#C9A0B4',
      padding: '48px 20px 24px',
    }}>
      <div className="footer-grid" style={{
        maxWidth: 1000,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        gap: 64,
        flexWrap: 'wrap',
        marginBottom: 32,
      }}>
<div className="footer-col">
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F9A8D4', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Shop</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/shop" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>All Flowers</Link>
            <Link href="/shop?category=bouquets" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Bouquets</Link>
            <Link href="/shop?category=arrangements" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Arrangements</Link>
            <Link href="/shop?category=baskets" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Gift Baskets</Link>
            <Link href="/shop?category=gifts" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Gifts</Link>
            <Link href="/custom-order" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Custom Order</Link>
          </div>
        </div>
        <div className="footer-col">
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F9A8D4', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/about" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>About Us</Link>
            <Link href="/contact" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Contact</Link>
            <Link href="/privacy" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/track" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Track Order</Link>
            <Link href="/account" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>My Account</Link>
          </div>
        </div>
        <div className="footer-col">
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F9A8D4', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/phnom-penh-flower-delivery" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Phnom Penh Delivery</Link>
            <Link href="/send-flowers-to-cambodia" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Send from Abroad</Link>
            <span style={{ fontSize: 12, color: '#9C7A8E', fontStyle: 'italic' }}>Other provinces coming soon</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(201,160,180,.2)', paddingTop: 20, textAlign: 'center', fontSize: 12 }}>
        &copy; {new Date().getFullYear()} Cambodia Floral. All rights reserved.
      </div>
    </footer>
  )
}
