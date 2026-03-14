import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#4A3040',
      color: '#C9A0B4',
      padding: '48px 20px 24px',
    }}>
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
        gap: 32,
        marginBottom: 32,
      }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 20,
            fontWeight: 700,
            color: '#F9A8D4',
            marginBottom: 12,
          }}>
            Cambodia Floral
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Delivering fresh, beautiful flowers across Cambodia. Bringing smiles from anywhere in the world to your loved ones.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F9A8D4', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Shop</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/shop" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>All Flowers</Link>
            <Link href="/shop?category=bouquets" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Bouquets</Link>
            <Link href="/shop?category=arrangements" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Arrangements</Link>
            <Link href="/shop?category=baskets" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Gift Baskets</Link>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F9A8D4', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Help</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/track" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>Track Order</Link>
            <Link href="/account" style={{ fontSize: 13, color: '#C9A0B4', textDecoration: 'none' }}>My Account</Link>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F9A8D4', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Areas</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13 }}>Phnom Penh</span>
            <span style={{ fontSize: 13 }}>Siem Reap</span>
            <span style={{ fontSize: 13 }}>Battambang</span>
            <span style={{ fontSize: 13 }}>Sihanoukville</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(201,160,180,.2)', paddingTop: 20, textAlign: 'center', fontSize: 12 }}>
        &copy; {new Date().getFullYear()} Cambodia Floral. All rights reserved.
      </div>
    </footer>
  )
}
