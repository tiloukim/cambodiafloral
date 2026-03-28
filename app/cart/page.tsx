'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cart-context'

const DELIVERY_FEE = 5
const FREE_DELIVERY_THRESHOLD = 100

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart()
  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const amountToFree = FREE_DELIVERY_THRESHOLD - total

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 32,
          fontWeight: 700,
          color: '#4A3040',
          marginBottom: 32,
        }}>
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Your cart is empty</h2>
            <p style={{ color: '#9C7A8E', marginBottom: 24 }}>Browse our beautiful flower collection</p>
            <Link href="/shop" style={{
              display: 'inline-block',
              background: '#EC4899',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Shop Flowers
            </Link>
          </div>
        ) : (
          <div className="grid-cart">
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: 16,
                  padding: 16,
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid #FFE4EF',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#4A3040', marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#DB2777', marginBottom: 12 }}>${item.price.toFixed(2)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        style={{
                          width: 32, height: 32, border: '1px solid #FFD6E8', borderRadius: '8px 0 0 8px',
                          background: '#FFF0F5', fontSize: 16, cursor: 'pointer', color: '#DB2777', fontWeight: 700,
                        }}
                      >-</button>
                      <div style={{
                        width: 40, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid #FFD6E8', borderLeft: 'none', borderRight: 'none',
                        fontSize: 14, fontWeight: 700, color: '#4A3040',
                      }}>{item.qty}</div>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        style={{
                          width: 32, height: 32, border: '1px solid #FFD6E8', borderRadius: '0 8px 8px 0',
                          background: '#FFF0F5', fontSize: 16, cursor: 'pointer', color: '#DB2777', fontWeight: 700,
                        }}
                      >+</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#4A3040' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none', border: 'none', color: '#EF4444', fontSize: 12,
                        fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #FFE4EF',
              padding: 24,
              position: 'sticky',
              top: 80,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Order Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#7A5A6A' }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#7A5A6A' }}>
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span style={{ color: '#10B981', fontWeight: 600 }}>FREE</span>
                ) : (
                  <span>${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              {deliveryFee === 0 ? (
                <div style={{ background: '#D1FAE5', color: '#065F46', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                  🎉 You qualify for free delivery!
                </div>
              ) : amountToFree > 0 ? (
                <div style={{ background: '#FFF0F5', color: '#DB2777', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>
                  🌸 Add ${amountToFree.toFixed(2)} more for free delivery!
                </div>
              ) : null}
              <div style={{ borderTop: '1px solid #FFE4EF', paddingTop: 16, display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#4A3040' }}>Total</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#DB2777' }}>${(total + deliveryFee).toFixed(2)}</span>
              </div>
              <Link href="/checkout" style={{
                display: 'block',
                textAlign: 'center',
                background: '#EC4899',
                color: '#fff',
                padding: '14px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
              }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
