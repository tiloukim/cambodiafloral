'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import type { Product } from '@/lib/types'

const CATEGORIES = ['bouquets', 'arrangements', 'baskets', 'wedding', 'sympathy', 'plants', 'cakes', 'gifts']
const OCCASIONS = ['Birthday', 'Anniversary', "Valentine's", 'Congratulations', 'Get Well', 'Sympathy']
const BADGES = ['NEW', 'BEST', 'POPULAR', 'SALE', 'LIMITED']

const EMPTY_FORM = { title: '', sku: '', cost: '', price: '', compare_price: '', category: 'bouquets', occasion: '', description: '', stock: '10', badge: '' }

async function fetchNextSku(category: string): Promise<string> {
  try {
    const res = await fetch(`/api/products?next_sku=${category}`)
    if (res.ok) {
      const data = await res.json()
      return data.sku || ''
    }
  } catch {}
  return ''
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'category' | 'stock'>('title')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSku, setEditSku] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editCost, setEditCost] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])
  const [editUploading, setEditUploading] = useState(false)
  const editFileRef = useRef<HTMLInputElement>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ ...EMPTY_FORM })
  const [addImages, setAddImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) setProducts(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Auto-generate SKU when add form opens or category changes
  useEffect(() => {
    if (showAdd) {
      fetchNextSku(addForm.category).then(sku => {
        if (sku) setAddForm(prev => ({ ...prev, sku }))
      })
    }
  }, [showAdd, addForm.category])

  const updateProduct = async (id: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchProducts()
        setEditing(null)
      }
    } catch { /* ignore */ }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Deactivate this product?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch { /* ignore */ }
  }

  const handleEditFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setEditUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('prefix', 'products')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const { url } = await res.json()
          setEditImages(prev => [...prev, url])
        }
      } catch { /* ignore */ }
    }
    setEditUploading(false)
    e.target.value = ''
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('prefix', 'products')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const { url } = await res.json()
          setAddImages(prev => [...prev, url])
        }
      } catch { /* ignore */ }
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleAddProduct = async () => {
    if (!addForm.title || !addForm.price || addImages.length === 0) {
      setAddError('Title, price, and at least one image are required')
      return
    }
    setAddError('')
    setAdding(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: addForm.title,
          sku: addForm.sku || null,
          cost: addForm.cost ? parseFloat(addForm.cost) : 0,
          price: parseFloat(addForm.price),
          compare_price: addForm.compare_price ? parseFloat(addForm.compare_price) : null,
          category: addForm.category,
          occasion: addForm.occasion || null,
          badge: addForm.badge || null,
          stock: parseInt(addForm.stock) || 10,
          image_url: addImages[0],
          image_urls: addImages,
          description: addForm.description,
        }),
      })
      if (res.ok) {
        setShowAdd(false)
        setAddForm({ ...EMPTY_FORM })
        setAddImages([])
        fetchProducts()
      } else {
        const data = await res.json()
        setAddError(data.error || 'Failed to add product')
      }
    } catch {
      setAddError('Failed to add product')
    }
    setAdding(false)
  }

  if (loading) return <div className="admin-loading">Loading products...</div>

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '2px solid #FFD6E8', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-dm-sans), sans-serif', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9C7A8E', display: 'block', marginBottom: 4 }

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products by name, SKU, or category..."
          style={{ width: '100%', padding: '12px 16px', border: '2px solid #FFD6E8', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-dm-sans), sans-serif', boxSizing: 'border-box', background: '#fff' }}
        />
      </div>

      <div className="admin-section-header" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="admin-sub-text">
          {categoryFilter === 'all' ? products.length : products.filter(p => p.category === categoryFilter).length} of {products.length} products
        </div>
        <button style={{ background: '#EC4899', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: '#fff', border: '1px solid #FFE4EF', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#4A3040' }}>New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} style={inputStyle} placeholder="Pink Rose Bouquet" />
            </div>
            <div>
              <label style={labelStyle}>Product Code (SKU) — Auto</label>
              <input value={addForm.sku} readOnly style={{ ...inputStyle, background: '#FFF5F9', color: '#9C7A8E', fontFamily: 'monospace', fontWeight: 700 }} />
            </div>
            <div>
              <label style={labelStyle}>Cost (Buy Price)</label>
              <input type="number" step="0.01" value={addForm.cost} onChange={e => setAddForm({ ...addForm, cost: e.target.value })} style={inputStyle} placeholder="15.00" />
            </div>
            <div>
              <label style={labelStyle}>Sell Price *</label>
              <input type="number" step="0.01" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} style={inputStyle} placeholder="29.99" />
            </div>
            <div>
              <label style={labelStyle}>Compare Price</label>
              <input type="number" step="0.01" value={addForm.compare_price} onChange={e => setAddForm({ ...addForm, compare_price: e.target.value })} style={inputStyle} placeholder="39.99" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Occasion</label>
              <select value={addForm.occasion} onChange={e => setAddForm({ ...addForm, occasion: e.target.value })} style={inputStyle}>
                <option value="">None</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <select value={addForm.badge} onChange={e => setAddForm({ ...addForm, badge: e.target.value })} style={inputStyle}>
                <option value="">None</option>
                {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <input type="number" value={addForm.stock} onChange={e => setAddForm({ ...addForm, stock: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Images * {addImages.length > 0 && `(${addImages.length})`}</label>
              {addImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {addImages.map((url, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#EC4899', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 6, letterSpacing: '1px' }}>COVER</div>}
                      <button onClick={() => setAddImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>&times;</button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ ...inputStyle, cursor: 'pointer', background: '#FFF8FC', textAlign: 'center', color: uploading ? '#C9A0B4' : '#9C7A8E', fontWeight: 600 }}>
                {uploading ? 'Uploading...' : '+ Upload Images'}
              </button>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Beautiful fresh flower arrangement..." />
            </div>
          </div>
          {addError && <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600, marginTop: 12 }}>{addError}</div>}
          <button style={{ background: '#EC4899', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 16 }} onClick={handleAddProduct} disabled={adding}>
            {adding ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      )}

      {/* Sort & Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px' }}>Category:</span>
          {['all', ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: categoryFilter === c ? '#EC4899' : '#FFF0F5',
                color: categoryFilter === c ? '#fff' : '#9C7A8E',
                textTransform: 'capitalize',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9C7A8E', textTransform: 'uppercase', letterSpacing: '1px' }}>Sort:</span>
          {(['title', 'price', 'category', 'stock'] as const).map(s => (
            <button
              key={s}
              onClick={() => { if (sortBy === s) { setSortDir(d => d === 'asc' ? 'desc' : 'asc') } else { setSortBy(s); setSortDir('asc') } }}
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: sortBy === s ? '#EC4899' : '#FFF0F5',
                color: sortBy === s ? '#fff' : '#9C7A8E',
                textTransform: 'capitalize',
              }}
            >
              {s} {sortBy === s ? (sortDir === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="admin-empty">No products found. Click &quot;+ Add Product&quot; to add flowers.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Cost</th>
                <th>Sell Price</th>
                <th>Profit</th>
                <th>Markup</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...products]
                .filter(p => {
                  if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
                  if (search) {
                    const q = search.toLowerCase()
                    return p.title.toLowerCase().includes(q) ||
                      (p.sku && p.sku.toLowerCase().includes(q)) ||
                      p.category.toLowerCase().includes(q)
                  }
                  return true
                })
                .sort((a, b) => {
                  const dir = sortDir === 'asc' ? 1 : -1
                  if (sortBy === 'title') return dir * a.title.localeCompare(b.title)
                  if (sortBy === 'price') return dir * (a.price - b.price)
                  if (sortBy === 'category') return dir * a.category.localeCompare(b.category)
                  if (sortBy === 'stock') return dir * (a.stock - b.stock)
                  return 0
                })
                .map(p => (
                <React.Fragment key={p.id}>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt={p.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10 }} />
                      <div>
                        {editing === p.id ? (
                          <>
                            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', padding: '4px 8px', border: '1px solid #FFD6E8', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 4 }} />
                            <input value={editSku} onChange={e => setEditSku(e.target.value)} style={{ width: '100%', padding: '4px 8px', border: '1px solid #FFD6E8', borderRadius: 6, fontSize: 11, color: '#9C7A8E' }} placeholder="SKU e.g. CF-001" />
                          </>
                        ) : (
                          <>
                            <div style={{ fontWeight: 600 }}>{p.title}</div>
                            {p.sku && <div className="admin-sub-text" style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.sku}</div>}
                          </>
                        )}
                        {p.occasion && <div className="admin-sub-text">{p.occasion}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {editing === p.id ? (
                      <input type="number" step="0.01" value={editCost} onChange={e => setEditCost(e.target.value)} placeholder="0" style={{ width: 70, padding: '4px 8px', border: '1px solid #FFD6E8', borderRadius: 6, fontSize: 13 }} />
                    ) : (
                      <span style={{ color: '#9C7A8E' }}>${(p.cost || 0).toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    {editing === p.id ? (
                      <input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ width: 70, padding: '4px 8px', border: '1px solid #FFD6E8', borderRadius: 6, fontSize: 13 }} />
                    ) : (
                      <div>
                        <strong>${p.price.toFixed(2)}</strong>
                        {p.compare_price && <div className="admin-sub-text" style={{ textDecoration: 'line-through' }}>${p.compare_price.toFixed(2)}</div>}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ color: (p.price - (p.cost || 0)) > 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                      ${(p.price - (p.cost || 0)).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: '#FFF0F5', color: '#EC4899', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                      {(p.cost || 0) > 0 ? Math.round(((p.price - p.cost) / p.cost) * 100) + '%' : '—'}
                    </span>
                  </td>
                  <td>
                    {editing === p.id ? (
                      <select value={editCategory} onChange={e => setEditCategory(e.target.value)} style={{ padding: '4px 8px', border: '1px solid #FFD6E8', borderRadius: 6, fontSize: 13, textTransform: 'capitalize' }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    ) : (
                      <span style={{ textTransform: 'capitalize' }}>{p.category}</span>
                    )}
                  </td>
                  <td>
                    {editing === p.id ? (
                      <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} style={{ width: 60, padding: '4px 8px', border: '1px solid #FFD6E8', borderRadius: 6, fontSize: 13 }} />
                    ) : (
                      <span style={{ color: p.stock < 5 ? '#EF4444' : p.stock < 15 ? '#F59E0B' : '#10B981', fontWeight: 700 }}>
                        {p.stock}
                      </span>
                    )}
                  </td>
                  <td>
                    {p.badge && (
                      <span style={{ background: '#FFF0F5', color: '#EC4899', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.5px' }}>
                        {p.badge}
                      </span>
                    )}
                  </td>
                  <td>
                    {editing === p.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => updateProduct(p.id, { title: editTitle, sku: editSku || null, cost: parseFloat(editCost) || 0, price: parseFloat(editPrice), stock: parseInt(editStock), category: editCategory, image_urls: editImages, image_url: editImages[0] || p.image_url })} style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: '#10B981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditing(null)} style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: '#F3F4F6', color: '#666', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditing(p.id); setEditTitle(p.title); setEditSku(p.sku || ''); setEditCost((p.cost || 0).toString()); setEditPrice(p.price.toString()); setEditStock(p.stock.toString()); setEditCategory(p.category); setEditImages(p.image_urls?.length > 0 ? [...p.image_urls] : [p.image_url]) }} style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: '#EC4899', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => deleteProduct(p.id)} style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: '#EF4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Remove</button>
                      </div>
                    )}
                  </td>
                </tr>
                {editing === p.id && (
                  <tr>
                    <td colSpan={9} style={{ padding: '12px 16px', background: '#FFF8FC' }}>
                      <label style={labelStyle}>Images ({editImages.length})</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {editImages.map((url, i) => (
                          <div key={i} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {i === 0 && <div style={{ position: 'absolute', bottom: 2, left: 2, background: '#EC4899', color: '#fff', fontSize: 7, fontWeight: 800, padding: '1px 4px', borderRadius: 4, letterSpacing: '0.5px' }}>COVER</div>}
                            <button onClick={() => setEditImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, lineHeight: 1 }}>&times;</button>
                          </div>
                        ))}
                        <input ref={editFileRef} type="file" accept="image/*" multiple hidden onChange={handleEditFileSelect} />
                        <button onClick={() => editFileRef.current?.click()} disabled={editUploading} style={{ width: 64, height: 64, borderRadius: 8, border: '2px dashed #FFD6E8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#C9A0B4', flexShrink: 0 }}>
                          {editUploading ? '...' : '+'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
