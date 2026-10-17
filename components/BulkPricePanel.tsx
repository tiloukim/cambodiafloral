'use client'

import { useState, useEffect, useCallback } from 'react'

const CATEGORIES = ['all', 'bouquets', 'arrangements', 'baskets', 'wedding', 'sympathy', 'plants', 'cakes', 'gifts']

interface Change { sku: string | null; title: string; from: number; to: number }
interface Preview { label: string; count: number; sample: Change[]; totalBefore: number; totalAfter: number }
interface LastAdjustment { id: string; description: string; created_at: string; product_count: number }

/**
 * Repricing every product at once. Deliberately two steps — preview, then
 * apply — with the previous prices snapshotted so a mistyped percentage can
 * be put back.
 */
export default function BulkPricePanel({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'percent' | 'fixed'>('percent')
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase')
  const [value, setValue] = useState('10')
  const [category, setCategory] = useState('all')
  const [rounding, setRounding] = useState<'none' | 'whole' | 'nearest5' | 'end99'>('whole')
  const [adjustCompare, setAdjustCompare] = useState(true)

  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [last, setLast] = useState<LastAdjustment | null>(null)

  const loadLast = useCallback(() => {
    fetch('/api/products/bulk-price').then(r => r.json()).then(d => setLast(d.last || null)).catch(() => {})
  }, [])
  useEffect(() => { if (open) loadLast() }, [open, loadLast])

  const body = () => ({
    mode, value: Number(value), direction, category,
    rounding, adjustCompare,
  })

  const doPreview = async () => {
    setBusy(true); setError(''); setResult(''); setPreview(null)
    try {
      const res = await fetch('/api/products/bulk-price', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body(), dryRun: true }),
      })
      const d = await res.json()
      if (res.ok) setPreview(d)
      else setError(d.error || 'Could not preview')
    } catch { setError('Could not preview') }
    setBusy(false)
  }

  const apply = async () => {
    if (!preview) return
    if (!confirm(`Apply ${preview.label}?\n\nThis changes ${preview.count} live prices. You can undo it afterwards.`)) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/products/bulk-price', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body()),
      })
      const d = await res.json()
      if (res.ok) { setResult(`Updated ${d.updated} products — ${d.label}`); setPreview(null); loadLast(); onDone() }
      else setError(d.error || 'Could not apply')
    } catch { setError('Could not apply') }
    setBusy(false)
  }

  const undo = async () => {
    if (!last) return
    if (!confirm(`Undo "${last.description}"?\n\nEvery price goes back to what it was.`)) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/products/bulk-price/undo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment_id: last.id }),
      })
      const d = await res.json()
      if (res.ok) { setResult(`Reverted ${d.restored} products`); setLast(null); onDone() }
      else setError(d.error || 'Could not undo')
    } catch { setError('Could not undo') }
    setBusy(false)
  }

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 4 }
  const field: React.CSSProperties = { padding: '8px 10px', borderRadius: 8, border: '1px solid #FFD6E8', fontSize: 13, width: '100%', boxSizing: 'border-box' }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        background: '#fff', color: '#EC4899', border: '1px solid #FFD6E8', borderRadius: 10,
        padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
      }}>
        💲 Bulk price change
      </button>
    )
  }

  return (
    // Full width so it wraps onto its own line instead of squeezing into the toolbar.
    <div style={{ width: '100%', background: '#fff', border: '1px solid #FFD6E8', borderRadius: 14, padding: 20, margin: '4px 0 8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#4A3040', margin: 0 }}>💲 Bulk price change</h3>
        <button onClick={() => { setOpen(false); setPreview(null); setError(''); setResult('') }}
          style={{ background: 'none', border: 'none', color: '#9C7A8E', fontSize: 13, cursor: 'pointer' }}>Close</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={label}>Direction</label>
          <select value={direction} onChange={e => { setDirection(e.target.value as 'increase' | 'decrease'); setPreview(null) }} style={field}>
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>
        </div>
        <div>
          <label style={label}>By</label>
          <select value={mode} onChange={e => { setMode(e.target.value as 'percent' | 'fixed'); setPreview(null) }} style={field}>
            <option value="percent">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <div>
          <label style={label}>{mode === 'percent' ? 'Percent' : 'Amount ($)'}</label>
          <input type="number" step="0.01" value={value} onChange={e => { setValue(e.target.value); setPreview(null) }} style={field} />
        </div>
        <div>
          <label style={label}>Apply to</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setPreview(null) }} style={field}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All products' : c}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Round to</label>
          <select value={rounding} onChange={e => { setRounding(e.target.value as typeof rounding); setPreview(null) }} style={field}>
            <option value="whole">Whole dollar</option>
            <option value="none">Exact cents</option>
            <option value="nearest5">Nearest $5</option>
            <option value="end99">End in .99</option>
          </select>
        </div>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#7A5A6A', marginBottom: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={adjustCompare} onChange={e => { setAdjustCompare(e.target.checked); setPreview(null) }} style={{ accentColor: '#EC4899' }} />
        Move the “was” price too, so it stays above the new price
      </label>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={doPreview} disabled={busy} style={{
          background: '#4A3040', color: '#fff', border: 'none', borderRadius: 10,
          padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: busy ? 'wait' : 'pointer',
        }}>{busy ? 'Working…' : 'Preview'}</button>

        {preview && preview.count > 0 && (
          <button onClick={apply} disabled={busy} style={{
            background: '#EC4899', color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: busy ? 'wait' : 'pointer',
          }}>Apply to {preview.count} products</button>
        )}

        {last && (
          <button onClick={undo} disabled={busy} style={{
            background: '#FFF0F5', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: busy ? 'wait' : 'pointer', marginLeft: 'auto',
          }}>↩ Undo “{last.description}”</button>
        )}
      </div>

      {error && <div style={{ color: '#DC2626', fontSize: 13, marginTop: 12, fontWeight: 600 }}>{error}</div>}
      {result && <div style={{ color: '#059669', fontSize: 13, marginTop: 12, fontWeight: 700 }}>✓ {result}</div>}

      {preview && (
        <div style={{ marginTop: 16, background: '#FFF8FC', border: '1px solid #FFE4EF', borderRadius: 12, padding: 16 }}>
          {preview.count === 0 ? (
            <div style={{ fontSize: 13, color: '#9C7A8E' }}>Nothing would change with those settings.</div>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#4A3040', marginBottom: 2 }}>
                {preview.count} products · {preview.label}
              </div>
              <div style={{ fontSize: 12, color: '#7A5A6A', marginBottom: 10 }}>
                Catalogue total ${preview.totalBefore.toFixed(2)} → <strong style={{ color: '#059669' }}>${preview.totalAfter.toFixed(2)}</strong>
              </div>
              {preview.sample.map(c => (
                <div key={c.sku || c.title} style={{ fontSize: 12, color: '#4A3040', lineHeight: 1.8 }}>
                  {c.sku && <span style={{ fontFamily: 'monospace', color: '#EC4899', fontWeight: 700 }}>[{c.sku}]</span>}{' '}
                  {c.title} — <span style={{ color: '#9C7A8E' }}>${c.from.toFixed(2)}</span> → <strong>${c.to.toFixed(2)}</strong>
                </div>
              ))}
              {preview.count > preview.sample.length && (
                <div style={{ fontSize: 11, color: '#C9A0B4', marginTop: 6 }}>
                  …and {preview.count - preview.sample.length} more
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
