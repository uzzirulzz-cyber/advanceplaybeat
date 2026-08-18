'use client'

import { useEffect, useState } from 'react'
import {
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Eye, EyeOff,
  Package, Loader2, Tag, X, Upload, Star,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtPrice, fmtDate, fmtNumber, discountPct, statusColor, cn } from '@/lib/utils'
import { Badge } from '@/components/storefront/common'
import { toast } from 'sonner'

export function ProductsView() {
  const { categories } = useStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterCat !== 'all') params.set('category', filterCat)
    if (filterStatus !== 'all') params.set('status', filterStatus)
    const res = await fetch(`/api/v1/admin/products?${params}`)
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search, filterCat, filterStatus])

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return
    await fetch(`/api/v1/admin/products/${id}`, { method: 'DELETE' })
    toast.success('Product deleted')
    load()
  }

  const duplicate = async (p: any) => {
    const { id, ...rest } = p
    await fetch('/api/v1/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, title: `${p.title} (Copy)`, slug: undefined, sku: undefined }),
    })
    toast.success('Product duplicated')
    load()
  }

  const togglePublish = async (p: any) => {
    const newStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    await fetch(`/api/v1/admin/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    toast.success(`Product ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}`)
    load()
  }

  const bulkAction = async (action: string) => {
    if (selected.length === 0) { toast.error('Select products first'); return }
    for (const id of selected) {
      const p = products.find((x) => x.id === id)
      if (!p) continue
      if (action === 'publish') await fetch(`/api/v1/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'PUBLISHED' }) })
      else if (action === 'unpublish') await fetch(`/api/v1/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'DRAFT' }) })
      else if (action === 'archive') await fetch(`/api/v1/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'ARCHIVED' }) })
      else if (action === 'delete') await fetch(`/api/v1/admin/products/${id}`, { method: 'DELETE' })
    }
    toast.success(`Bulk action completed on ${selected.length} products`)
    setSelected([])
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{products.length} products</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-10 px-4 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card border border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm">
          <option value="all">All status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        {selected.length > 0 && (
          <div className="flex items-center gap-1 ml-auto pl-2 border-l border-border">
            <span className="text-xs text-muted-foreground px-2">{selected.length} selected</span>
            <button onClick={() => bulkAction('publish')} className="h-9 px-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium hover:bg-emerald-200">Publish</button>
            <button onClick={() => bulkAction('unpublish')} className="h-9 px-2 rounded-lg bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200">Unpublish</button>
            <button onClick={() => bulkAction('archive')} className="h-9 px-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200">Archive</button>
            <button onClick={() => bulkAction('delete')} className="h-9 px-2 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium hover:bg-rose-200">Delete</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground"><Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" /> Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12"><Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No products found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3"><input type="checkbox" checked={selected.length === products.length} onChange={(e) => setSelected(e.target.checked ? products.map((p) => p.id) : [])} className="w-4 h-4" /></th>
                  <th className="p-3">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Inventory</th>
                  <th>Sales</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, p.id] : selected.filter((x) => x !== p.id))} className="w-4 h-4" /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium line-clamp-1">{p.title}</div>
                          <div className="text-xs text-muted-foreground">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="capitalize">{p.categorySlug.replace('-', ' ')}</td>
                    <td>
                      <div className="font-bold">{fmtPrice(p.salePrice || p.basePrice)}</div>
                      {p.salePrice && p.salePrice < p.basePrice && <div className="text-xs text-muted-foreground line-through">{fmtPrice(p.basePrice)}</div>}
                    </td>
                    <td>
                      <span className={cn('text-xs px-2 py-0.5 rounded', p.availableInventory === 0 ? 'bg-rose-100 text-rose-700' : p.availableInventory < 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>{p.availableInventory}</span>
                    </td>
                    <td>{fmtNumber(p.salesCount)}</td>
                    <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(p.status))}>{p.status}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => togglePublish(p)} title={p.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center">
                          {p.status === 'PUBLISHED' ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button onClick={() => duplicate(p)} title="Duplicate" className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><Copy size={13} /></button>
                        <button onClick={() => { setEditing(p); setShowForm(true) }} title="Edit" className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><Edit size={13} /></button>
                        <button onClick={() => deleteProduct(p.id)} title="Delete" className="w-7 h-7 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 flex items-center justify-center"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {showForm && <ProductForm product={editing} categories={categories} onClose={() => { setShowForm(false); load() }} />}
    </div>
  )
}

function ProductForm({ product, categories, onClose }: { product: any | null; categories: any[]; onClose: () => void }) {
  const isEdit = !!product
  const [form, setForm] = useState<any>(product ? {
    ...product,
    galleryUrls: product.galleryUrls || [],
    features: product.features || [],
    specifications: product.specifications || [],
    faqs: product.faqs || [],
    tags: product.tags || [],
    variants: product.variants || [],
  } : {
    title: '', slug: '', shortDesc: '', description: '', type: 'DIGITAL', categorySlug: categories[0]?.slug || 'gaming',
    basePrice: 0, salePrice: null, sku: '', imageUrl: '', galleryUrls: [], features: [], specifications: [],
    faqs: [], tags: [], isFeatured: false, isTrending: false, isBestSeller: false, isDeal: false,
    status: 'DRAFT', deliveryMethod: 'INSTANT', licenseType: '', isVisible: true, variants: [],
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title || !form.description || !form.imageUrl) {
      toast.error('Title, description and image URL are required')
      return
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/v1/admin/products/${product.id}` : '/api/v1/admin/products'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice), salePrice: form.salePrice ? Number(form.salePrice) : null }),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Product updated' : 'Product created')
        onClose()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background p-5 border-b border-border flex items-center justify-between z-10">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display), system-ui' }}>{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Slug (auto-generated if empty)</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Short Description</label>
              <input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
          </div>

          {/* Category, type, status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="w-full h-10 px-2 rounded-lg border border-input bg-background text-sm">
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-2 rounded-lg border border-input bg-background text-sm">
                <option value="DIGITAL">Digital</option><option value="SUBSCRIPTION">Subscription</option><option value="SERVICE">Service</option><option value="DOWNLOAD">Download</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-2 rounded-lg border border-input bg-background text-sm">
                <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Base Price ($)</label>
              <input type="number" step="0.01" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Sale Price ($)</label>
              <input type="number" step="0.01" value={form.salePrice || ''} onChange={(e) => setForm({ ...form, salePrice: e.target.value || null })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">License Type</label>
              <input value={form.licenseType || ''} onChange={(e) => setForm({ ...form, licenseType: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Image URL *</label>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 w-32 h-20 rounded-lg object-cover border border-border" />}
          </div>

          {/* Flags */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { k: 'isFeatured', l: 'Featured' }, { k: 'isTrending', l: 'Trending' },
              { k: 'isBestSeller', l: 'Best Seller' }, { k: 'isDeal', l: 'Deal' },
            ].map((f) => (
              <label key={f.k} className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer">
                <input type="checkbox" checked={form[f.k] || false} onChange={(e) => setForm({ ...form, [f.k]: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs">{f.l}</span>
              </label>
            ))}
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Variants / Durations</label>
              <button onClick={() => setForm({ ...form, variants: [...form.variants, { name: '', durationDays: 0, price: 0, stock: 0 }] })} className="text-xs text-brand hover:underline flex items-center gap-1"><Plus size={12} /> Add variant</button>
            </div>
            {form.variants.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/30">No variants — base price will be used.</p>
            ) : (
              <div className="space-y-2">
                {form.variants.map((v: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4"><input value={v.name} onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...v, name: e.target.value }; setForm({ ...form, variants: nv }) }} placeholder="Variant name" className="w-full h-9 px-2 rounded-lg border border-input bg-background text-sm" /></div>
                    <div className="col-span-2"><input type="number" value={v.durationDays} onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...v, durationDays: Number(e.target.value) }; setForm({ ...form, variants: nv }) }} placeholder="Days" className="w-full h-9 px-2 rounded-lg border border-input bg-background text-sm" /></div>
                    <div className="col-span-2"><input type="number" step="0.01" value={v.price} onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...v, price: Number(e.target.value) }; setForm({ ...form, variants: nv }) }} placeholder="Price" className="w-full h-9 px-2 rounded-lg border border-input bg-background text-sm" /></div>
                    <div className="col-span-2"><input type="number" value={v.stock} onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...v, stock: Number(e.target.value) }; setForm({ ...form, variants: nv }) }} placeholder="Stock" className="w-full h-9 px-2 rounded-lg border border-input bg-background text-sm" /></div>
                    <div className="col-span-1"><button onClick={() => setForm({ ...form, variants: form.variants.filter((_: any, j: number) => j !== i) })} className="w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center"><Trash2 size={14} /></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Features</label>
              <button onClick={() => setForm({ ...form, features: [...form.features, ''] })} className="text-xs text-brand hover:underline flex items-center gap-1"><Plus size={12} /> Add</button>
            </div>
            {form.features.map((f: string, i: number) => (
              <div key={i} className="flex gap-2 mb-1">
                <input value={f} onChange={(e) => { const nf = [...form.features]; nf[i] = e.target.value; setForm({ ...form, features: nf }) }} className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm" />
                <button onClick={() => setForm({ ...form, features: form.features.filter((_: string, j: number) => j !== i) })} className="w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
            <input value={form.tags.join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          </div>
        </div>

        <div className="sticky bottom-0 bg-background p-5 border-t border-border flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}
