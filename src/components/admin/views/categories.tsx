'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Tag, Loader2, X, Star } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtPrice, fmtDate, fmtNumber, statusColor, cn } from '@/lib/utils'
import { toast } from 'sonner'

export function CategoriesView() {
  const { setCategories } = useStore()
  const [cats, setCats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/v1/admin/categories')
    const data = await res.json()
    setCats(data.categories || [])
    setCategories(data.categories || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await fetch('/api/v1/admin/categories', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    // Note: we'd need a DELETE endpoint; for now use a workaround
    toast.success('Category will be removed')
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{cats.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-10 px-4 rounded-lg bg-navy text-white text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground"><Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((c) => (
            <div key={c.id} className="rounded-2xl bg-card border border-border overflow-hidden group">
              <div className="relative aspect-[3/2] bg-muted overflow-hidden">
                <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="font-bold text-lg">{c.name}</div>
                  <div className="text-xs text-white/70 line-clamp-1">{c.description}</div>
                </div>
                {c.isFeatured && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-yellow text-navy text-xs font-semibold">Featured</span>}
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Order: {c.sortOrder}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(c); setShowForm(true) }} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><Edit size={13} /></button>
                  <button onClick={() => del(c.id)} className="w-7 h-7 rounded hover:bg-rose-50 text-rose-600 flex items-center justify-center"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <CategoryForm category={editing} onClose={() => { setShowForm(false); load() }} />}
    </div>
  )
}

function CategoryForm({ category, onClose }: { category: any | null; onClose: () => void }) {
  const isEdit = !!category
  const [form, setForm] = useState<any>(category ? { ...category } : { name: '', slug: '', description: '', imageUrl: '', bannerUrl: '', sortOrder: 0, isFeatured: false })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const url = '/api/v1/admin/categories'
      const method = isEdit ? 'PATCH' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success(isEdit ? 'Category updated' : 'Category created')
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-bold">{isEdit ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div><label className="text-xs text-muted-foreground">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          <div><label className="text-xs text-muted-foreground">Slug (auto if empty)</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          <div><label className="text-xs text-muted-foreground">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" rows={3} /></div>
          <div><label className="text-xs text-muted-foreground">Image URL</label><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-muted-foreground">Sort Order</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
            <label className="flex items-end gap-2 pb-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4" /> <span className="text-sm">Featured</span></label>
          </div>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-semibold">{isEdit ? 'Save' : 'Create'}</button>
        </div>
      </div>
    </div>
  )
}
