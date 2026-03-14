'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

const OCCASIONS = [
  { name: 'Birthday', emoji: '🎂', color: '#EC4899' },
  { name: 'Anniversary', emoji: '💕', color: '#DB2777' },
  { name: "Valentine's", emoji: '❤️', color: '#E11D48' },
  { name: 'Congratulations', emoji: '🎉', color: '#F472B6' },
  { name: 'Get Well', emoji: '🌻', color: '#FB923C' },
  { name: 'Sympathy', emoji: '🕊️', color: '#9CA3AF' },
]

const STEPS = [
  { num: '1', title: 'Choose Your Flowers', desc: 'Browse our curated collection of fresh bouquets, arrangements, and gift baskets.' },
  { num: '2', title: 'Add Recipient Details', desc: 'Tell us who to deliver to in Cambodia with a personal message and delivery date.' },
  { num: '3', title: 'We Deliver With Care', desc: 'Our local florists in Cambodia hand-deliver your flowers fresh and on time.' },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.slice(0, 8)))
      .catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EF 50%, #FECDD3 100%)',
        padding: 'clamp(60px, 10vw, 100px) 20px clamp(40px, 8vw, 80px)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#4A3040',
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Send Beautiful Flowers<br />to Cambodia
          </h1>
          <p style={{
            fontSize: 18,
            color: '#7A5A6A',
            marginBottom: 36,
            lineHeight: 1.6,
          }}>
            Surprise your loved ones with fresh, hand-crafted bouquets delivered anywhere in Cambodia. From Phnom Penh to Siem Reap, we bring joy to every doorstep.
          </p>
          <Link href="/shop" style={{
            display: 'inline-block',
            background: '#EC4899',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 50,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all .2s',
            boxShadow: '0 4px 20px rgba(236,72,153,.3)',
          }}>
            Shop Flowers
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 32,
              fontWeight: 700,
              color: '#4A3040',
              marginBottom: 10,
            }}>
              Our Bestsellers
            </h2>
            <p style={{ color: '#9C7A8E', fontSize: 15 }}>Hand-picked favorites loved by our customers</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
            gap: 24,
          }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/shop" style={{
              display: 'inline-block',
              border: '2px solid #EC4899',
              color: '#EC4899',
              padding: '12px 32px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Occasions */}
      <section style={{ background: '#FFF8FC', padding: '60px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 32,
              fontWeight: 700,
              color: '#4A3040',
              marginBottom: 10,
            }}>
              Shop by Occasion
            </h2>
            <p style={{ color: '#9C7A8E', fontSize: 15 }}>Find the perfect arrangement for every moment</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 45%), 1fr))',
            gap: 16,
          }}>
            {OCCASIONS.map(o => (
              <Link key={o.name} href={`/shop?occasion=${o.name}`} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: '28px 16px',
                background: '#fff',
                borderRadius: 16,
                textDecoration: 'none',
                border: '1px solid #FFE4EF',
                transition: 'all .2s',
              }}>
                <span style={{ fontSize: 36 }}>{o.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#4A3040' }}>{o.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#4A3040',
            marginBottom: 10,
          }}>
            How It Works
          </h2>
          <p style={{ color: '#9C7A8E', fontSize: 15 }}>Sending flowers to Cambodia is easy</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
          gap: 32,
        }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EC4899, #DB2777)',
                color: '#fff',
                fontSize: 22,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                {s.num}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#9C7A8E', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
