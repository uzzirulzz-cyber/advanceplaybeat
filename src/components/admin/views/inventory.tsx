'use client'

import { useEffect, useState } from 'react'
import { Boxes, Loader2, Plus, AlertTriangle, Check, X, Key, Upload, Download } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtPrice, fmtNumber, cn } from '@/lib/utils'
import { toast } from 'sonner'

export function InventoryView() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [showAddKeys, setShowAddKeys] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/v1/admin/inventory')
    const data = await res.json()
    setItems(data.inventory || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const stats = items.reduce((acc, it) => {
    acc.totalAvailable += it.availableKeys || 0
    acc.totalUsed += it.usedKeys || 0
    acc.totalReserved += it.reservedKeys || 0
    acc.lowStock += (it.availableKeys || 0) > 0 && (it.availableKeys || 0) < 5 ? 1 : 0
    acc.outOfStock += (it.availableKeys || 0) === 0 ? 1 : 0
    return acc
  }, { totalAvailable: 0, totalUsed: 0, totalReserved: 0, lowStock: 0, outOfStock: 0 })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Inventory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Digital keys and stock management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Available" value={fmtNumber(stats.totalAvailable)} icon={Check} color="emerald" />
        <StatCard label="Used" value={fmtNumber(stats.totalUsed)} icon={Key} color="blue" />
        <StatCard label="Reserved" value={fmtNumber(stats.totalReserved)} icon={Boxes} color="purple" />
        <StatCard label="Low Stock" value={fmtNumber(stats.lowStock)} icon={AlertTriangle} color="amber" />
        <StatCard label="Out of Stock" value={fmtNumber(stats.outOfStock)} icon={X} color="rose" />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground"><Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3">Product</th>
                  <th>SKU</th>
                  <th>Available</th>
                  <th>Used</th>
                  <th>Reserved</th>
                  <th>Variant Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted shrink-0"><img src={it.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                        <span className="font-medium line-clamp-1">{it.title}</span>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">{it.sku}</td>
                    <td><span className="font-bold text-emerald-600">{it.availableKeys}</span></td>
                    <td><span className="text-muted-foreground">{it.usedKeys}</span></td>
                    <td><span className="text-purple-600">{it.reservedKeys}</span></td>
                    <td>
                      <div className="text-xs">
                        {it.variants.length > 0 ? it.variants.map((v: any) => <div key={v.id}>{v.name}: {v.stock}</div>) : '—'}
                      </div>
                    </td>
                    <td>
                      <span className={cn('text-xs px-2 py-0.5 rounded',
                        it.availableKeys === 0 ? 'bg-rose-100 text-rose-700' :
                        it.availableKeys < 5 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      )}>
                        {it.availableKeys === 0 ? 'Out of stock' : it.availableKeys < 5 ? 'Low stock' : 'In stock'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => { setSelected(it.id); setShowAddKeys(true) }} className="h-8 px-2 rounded-lg bg-navy text-white text-xs font-medium hover:opacity-90 flex items-center gap-1"><Plus size={12} /> Add Keys</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddKeys && selected && <AddKeysForm productId={selected} onClose={() => { setShowAddKeys(false); load() }} />}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600',
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
    amber: 'bg-amber-500/10 text-amber-600',
    rose: 'bg-rose-500/10 text-rose-600',
  }
  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', colors[color])}><Icon size={18} /></div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function AddKeysForm({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [keys, setKeys] = useState('')
  const [keyType, setKeyType] = useState('LICENSE')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    const keysArr = keys.split('\n').map((k) => k.trim()).filter(Boolean)
    if (keysArr.length === 0) { toast.error('Enter at least one key'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/v1/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, keys: keysArr, keyType }),
      })
      if (res.ok) {
        toast.success(`${keysArr.length} keys added`)
        onClose()
      }
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-bold">Add Inventory Keys</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Key Type</label>
            <select value={keyType} onChange={(e) => setKeyType(e.target.value)} className="w-full h-10 px-2 rounded-lg border border-input bg-background text-sm">
              <option value="LICENSE">License Key</option>
              <option value="ACCOUNT">Account Credentials</option>
              <option value="DOWNLOAD">Download Link</option>
              <option value="M3U">M3U Playlist</option>
              <option value="CREDENTIAL">Generic Credential</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Keys (one per line)</label>
            <textarea value={keys} onChange={(e) => setKeys(e.target.value)} rows={8} placeholder="KEY-1&#10;KEY-2&#10;KEY-3" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-mono" />
            <div className="text-xs text-muted-foreground mt-1">{keys.split('\n').filter((k) => k.trim()).length} keys will be added</div>
          </div>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-semibold">Add Keys</button>
        </div>
      </div>
    </div>
  )
}
