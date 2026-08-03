'use client'

import { useState, useEffect, useCallback } from 'react'

interface PromoCode {
  id: string
  code: string
  discount_type: 'percent' | 'fixed' | 'free_delivery'
  discount_value: number
  min_subtotal: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  active: boolean
  created_at: string
}

const emptyForm = {
  code: '',
  discount_type: 'percent' as PromoCode['discount_type'],
  discount_value: '',
  min_subtotal: '',
  max_uses: '',
  expires_at: '',
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/promo-codes')
    if (res.ok) setCodes(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const create = async () => {
    setError('')
    if (!form.code.trim()) { setError('Enter a code'); return }
    if (form.discount_type !== 'free_delivery' && !form.discount_value) { setError('Enter a discount value'); return }
    setSaving(true)
    const res = await fetch('/api/promo-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      setForm(emptyForm)
      load()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to create code')
    }
  }

  const toggleActive = async (c: PromoCode) => {
    await fetch(`/api/promo-codes/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !c.active }),
    })
    load()
  }

  const remove = async (c: PromoCode) => {
    if (!confirm(`Delete promo code ${c.code}?`)) return
    await fetch(`/api/promo-codes/${c.id}`, { method: 'DELETE' })
    load()
  }

  const describe = (c: PromoCode) =>
    c.discount_type === 'percent' ? `${c.discount_value}% off`
    : c.discount_type === 'fixed' ? `$${Number(c.discount_value).toFixed(2)} off`
    : 'Free delivery'

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#9C7A8E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '2px solid #FFD6E8', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

  return (
    <div>
      {/* Create form */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24, marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 20 }}>Create Promo Code</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Code</label>
            <input style={inputStyle} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
          </div>
          <div>
            <label style={labelStyle}>Discount Type</label>
            <select style={inputStyle} value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value as PromoCode['discount_type'] })}>
              <option value="percent">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
              <option value="free_delivery">Free delivery</option>
            </select>
          </div>
          {form.discount_type !== 'free_delivery' && (
            <div>
              <label style={labelStyle}>{form.discount_type === 'percent' ? 'Percent (%)' : 'Amount ($)'}</label>
              <input style={inputStyle} type="number" min="0" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} placeholder={form.discount_type === 'percent' ? '10' : '5'} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Min Subtotal ($)</label>
            <input style={inputStyle} type="number" min="0" value={form.min_subtotal} onChange={e => setForm({ ...form, min_subtotal: e.target.value })} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Max Uses</label>
            <input style={inputStyle} type="number" min="1" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} placeholder="blank = unlimited · 1 = one-time" />
          </div>
          <div>
            <label style={labelStyle}>Expires</label>
            <input style={inputStyle} type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
          </div>
        </div>
        {error && <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600, marginTop: 14 }}>{error}</div>}
        <button onClick={create} disabled={saving} style={{ marginTop: 18, background: '#EC4899', color: '#fff', padding: '11px 26px', borderRadius: 50, fontSize: 14, fontWeight: 700, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Creating…' : 'Create Code'}
        </button>
      </div>

      {/* List */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FFE4EF', padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4A3040', marginBottom: 16 }}>Promo Codes</h2>
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : codes.length === 0 ? (
          <div className="admin-empty">No promo codes yet</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th><th>Discount</th><th>Min</th><th>Uses</th><th>Expires</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {codes.map(c => {
                  const spent = c.max_uses != null && c.used_count >= c.max_uses
                  const expired = c.expires_at ? new Date(c.expires_at).getTime() < Date.now() : false
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: '#4A3040', fontFamily: 'monospace' }}>{c.code}</td>
                      <td>{describe(c)}</td>
                      <td className="admin-sub-text">{Number(c.min_subtotal) > 0 ? `$${Number(c.min_subtotal).toFixed(2)}` : '—'}</td>
                      <td className="admin-sub-text">{c.used_count}{c.max_uses != null ? ` / ${c.max_uses}` : ''}</td>
                      <td className="admin-sub-text">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                      <td>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50,
                          background: (!c.active || spent || expired) ? '#FEE2E2' : '#D1FAE5',
                          color: (!c.active || spent || expired) ? '#991B1B' : '#065F46',
                        }}>
                          {!c.active ? 'Inactive' : spent ? 'Used up' : expired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                        <button onClick={() => toggleActive(c)} style={{ background: 'none', border: '1px solid #FFD6E8', color: '#9C7A8E', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', marginRight: 8 }}>
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => remove(c)} style={{ background: 'none', border: '1px solid #FECACA', color: '#DC2626', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
