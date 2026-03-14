'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function SignupPage() {
  const { supabase } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #FFD6E8',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color .2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '48px 40px',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 8px 32px rgba(236,72,153,.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#DB2777',
            textDecoration: 'none',
          }}>
            Cambodia Floral
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#4A3040', marginTop: 20, marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: '#9C7A8E' }}>Join us to send beautiful flowers to Cambodia</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💌</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 8 }}>Check Your Email</h2>
            <p style={{ fontSize: 14, color: '#9C7A8E', lineHeight: 1.6 }}>
              We&apos;ve sent a confirmation link to <strong>{email}</strong>. Please click the link to activate your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C7A8E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Your name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C7A8E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C7A8E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="At least 6 characters" />
            </div>
            {error && <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              background: '#EC4899',
              color: '#fff',
              padding: '14px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: 8,
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#9C7A8E' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#EC4899', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
