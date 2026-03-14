'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useAuth } from '@/lib/auth-context'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
    }
  }
}

export default function LoginPage() {
  const { supabase } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const renderCaptcha = useCallback(() => {
    if (window.turnstile && captchaRef.current && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(captchaRef.current, {
        sitekey: '0x4AAAAAACq7DsjA4vjgSMuc',
        callback: (token: string) => setCaptchaToken(token),
        'expired-callback': () => setCaptchaToken(''),
        theme: 'light',
      })
    }
  }, [])

  useEffect(() => {
    renderCaptcha()
  }, [renderCaptcha])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } })
    if (err) {
      setError(err.message)
      setLoading(false)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
        setCaptchaToken('')
      }
    } else {
      window.location.href = '/account'
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
        padding: 'clamp(32px, 5vw, 48px) clamp(20px, 5vw, 40px)',
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
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#4A3040', marginTop: 20, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: '#9C7A8E' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C7A8E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C7A8E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="Your password" />
          </div>
          <div ref={captchaRef} />
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#9C7A8E' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#EC4899', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onLoad={renderCaptcha}
      />
    </div>
  )
}
