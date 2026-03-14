'use client'

import { useState, useEffect } from 'react'

interface CustomerRow {
  id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  is_admin: boolean
  created_at: string
  order_count: number
  total_spent: number
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<CustomerRow>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/customers')
        if (!res.ok) return
        setCustomers(await res.json())
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [])

  const startEdit = (c: CustomerRow) => {
    setEditing(c.id)
    setEditForm({ name: c.name, email: c.email, phone: c.phone || '', country: c.country || '' })
    setExpanded(c.id)
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditForm({})
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        const updated = await res.json()
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
        setEditing(null)
        setEditForm({})
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const deleteCustomer = async (id: string) => {
    const c = customers.find(x => x.id === id)
    if (!confirm(`Delete customer "${c?.name}"? This will also remove all their orders. This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCustomers(prev => prev.filter(x => x.id !== id))
        if (expanded === id) setExpanded(null)
        if (editing === id) cancelEdit()
      }
    } catch { /* ignore */ }
    setDeleting(null)
  }

  if (loading) return <div className="admin-loading">Loading customers...</div>

  return (
    <div>
      <div className="admin-section-header" style={{ marginBottom: 20 }}>
        <div className="admin-sub-text">{customers.length} customers</div>
      </div>

      {customers.length === 0 ? (
        <div className="admin-empty">No customers yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Since</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} onClick={() => { if (editing !== c.id) setExpanded(expanded === c.id ? null : c.id) }} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="admin-sub-text">{c.email}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{c.phone || '--'}</td>
                  <td>{c.country || '--'}</td>
                  <td><strong>{c.order_count}</strong></td>
                  <td style={{ color: '#10B981', fontWeight: 700 }}>${c.total_spent.toFixed(2)}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => startEdit(c)}
                        style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: '#EC4899', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomer(c.id)}
                        disabled={deleting === c.id}
                        style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: '#EF4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: deleting === c.id ? 0.5 : 1 }}
                      >
                        {deleting === c.id ? '...' : 'Remove'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expanded && (() => {
            const c = customers.find(x => x.id === expanded)
            if (!c) return null

            if (editing === c.id) {
              return (
                <div style={{ background: '#FFF8FC', border: '1px solid #FFE4EF', borderRadius: 12, padding: 20, marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#4A3040' }}>Edit Customer</h3>
                    <button onClick={cancelEdit} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9C7A8E' }}>&times;</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                    {[
                      { label: 'Name', key: 'name' },
                      { label: 'Email', key: 'email' },
                      { label: 'Phone', key: 'phone' },
                      { label: 'Country', key: 'country' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{f.label}</label>
                        <input
                          type="text"
                          value={(editForm as Record<string, string>)[f.key] || ''}
                          onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          style={{ width: '100%', padding: '8px 10px', fontSize: 13, border: '1px solid #FFD6E8', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
                    <button onClick={cancelEdit} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, background: '#FFF0F5', color: '#9C7A8E', border: '1px solid #FFD6E8', borderRadius: 8, cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button onClick={() => saveEdit(c.id)} disabled={saving} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, background: '#EC4899', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div style={{ background: '#FFF8FC', border: '1px solid #FFE4EF', borderRadius: 12, padding: 20, marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#4A3040' }}>{c.name}</h3>
                  <button onClick={() => setExpanded(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9C7A8E' }}>&times;</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px', fontSize: 13 }}>
                  <div><span style={{ color: '#9C7A8E', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</span><div style={{ marginTop: 2, color: '#4A3040' }}>{c.email}</div></div>
                  <div><span style={{ color: '#9C7A8E', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</span><div style={{ marginTop: 2, color: '#4A3040' }}>{c.phone || '--'}</div></div>
                  <div><span style={{ color: '#9C7A8E', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Country</span><div style={{ marginTop: 2, color: '#4A3040' }}>{c.country || '--'}</div></div>
                  <div><span style={{ color: '#9C7A8E', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Orders</span><div style={{ marginTop: 2, color: '#4A3040' }}>{c.order_count}</div></div>
                  <div><span style={{ color: '#9C7A8E', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spent</span><div style={{ marginTop: 2, color: '#10B981', fontWeight: 700 }}>${c.total_spent.toFixed(2)}</div></div>
                  <div><span style={{ color: '#9C7A8E', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</span><div style={{ marginTop: 2, color: '#4A3040' }}>{new Date(c.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div></div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
