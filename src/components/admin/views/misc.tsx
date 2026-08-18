'use client'

import { useEffect, useState } from 'react'
import {
  Ticket, Plus, Loader2, X, Trash2, Edit, RefreshCw, LifeBuoy, FileText,
  BarChart3, ShieldAlert, Settings as SettingsIcon, Save, TrendingUp,
  Check, AlertCircle, Eye, EyeOff, Copy, Send, Download,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtPrice, fmtDate, fmtDateTime, fmtNumber, fmtCompact, statusColor, cn } from '@/lib/utils'
import { toast } from 'sonner'

// =============== COUPONS ===============
export function CouponsView() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/v1/admin/coupons')
    const data = await res.json()
    setCoupons(data.coupons || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Coupons</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{coupons.length} coupons</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-10 px-4 rounded-lg bg-navy text-white text-sm font-semibold flex items-center gap-2"><Plus size={16} /> New Coupon</button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3">Code</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Order</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3"><code className="font-mono font-bold text-navy dark:text-yellow">{c.code}</code></td>
                    <td className="text-xs text-muted-foreground">{c.description}</td>
                    <td><span className="text-xs px-2 py-0.5 rounded bg-muted">{c.type}</span></td>
                    <td className="font-bold">{c.type === 'PERCENTAGE' ? `${c.value}%` : fmtPrice(c.value)}</td>
                    <td>{fmtPrice(c.minOrder)}</td>
                    <td className="text-xs">{c.usedCount}/{c.usageLimit || '∞'}</td>
                    <td><span className={cn('text-xs px-2 py-0.5 rounded', c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="text-xs text-muted-foreground">{c.expiresAt ? fmtDate(c.expiresAt) : '—'}</td>
                    <td>
                      <button onClick={() => { navigator.clipboard?.writeText(c.code); toast.success('Copied') }} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><Copy size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <CouponForm coupon={editing} onClose={() => { setShowForm(false); load() }} />}
    </div>
  )
}

function CouponForm({ coupon, onClose }: { coupon: any | null; onClose: () => void }) {
  const [form, setForm] = useState<any>(coupon ? { ...coupon } : { code: '', description: '', type: 'PERCENTAGE', value: 10, minOrder: 0, usageLimit: 100, isActive: true, expiresAt: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/v1/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, value: Number(form.value), minOrder: Number(form.minOrder), usageLimit: Number(form.usageLimit) }) })
      toast.success('Coupon created')
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between"><h2 className="font-bold">New Coupon</h2><button onClick={onClose}><X size={18} /></button></div>
        <div className="p-5 space-y-3">
          <div><label className="text-xs text-muted-foreground">Code *</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm uppercase font-mono" /></div>
          <div><label className="text-xs text-muted-foreground">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-muted-foreground">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-2 rounded-lg border border-input bg-background text-sm"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed Amount</option></select></div>
            <div><label className="text-xs text-muted-foreground">Value</label><input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-muted-foreground">Min Order ($)</label><input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
            <div><label className="text-xs text-muted-foreground">Usage Limit (0 = unlimited)</label><input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          </div>
          <div><label className="text-xs text-muted-foreground">Expires At (optional)</label><input type="date" value={form.expiresAt ? form.expiresAt.slice(0, 10) : ''} onChange={(e) => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" /><span className="text-sm">Active</span></label>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-semibold">Create Coupon</button>
        </div>
      </div>
    </div>
  )
}

// =============== SUBSCRIPTIONS ===============
export function SubscriptionsView() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/v1/admin/subscriptions')
    const data = await res.json()
    setSubs(data.subscriptions || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const action = async (id: string, a: string) => {
    await fetch('/api/v1/admin/subscriptions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: a }) })
    toast.success(`Subscription ${a}`)
    load()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subs.length} subscriptions</p>
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3">Customer</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Start</th>
                  <th>Expires</th>
                  <th>Auto-Renew</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3"><div className="font-medium">{s.customer?.name}</div><div className="text-xs text-muted-foreground">{s.customer?.email}</div></td>
                    <td className="text-xs">{s.product?.title}</td>
                    <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(s.status))}>{s.status}</span></td>
                    <td className="text-xs text-muted-foreground">{fmtDate(s.startDate)}</td>
                    <td className="text-xs text-muted-foreground">{fmtDate(s.endDate)}</td>
                    <td>{s.autoRenew ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-rose-500" />}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => action(s.id, 'extend')} className="h-7 px-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">Extend</button>
                        <button onClick={() => action(s.id, 'cancel')} className="h-7 px-2 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// =============== SUPPORT ===============
export function SupportView() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [reply, setReply] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/v1/admin/support')
    const data = await res.json()
    setTickets(data.tickets || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const sendReply = async () => {
    if (!selected || !reply.trim()) return
    await fetch('/api/v1/admin/support', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, action: 'reply', message: reply, status: 'IN_PROGRESS' }) })
    toast.success('Reply sent')
    setReply('')
    load()
    const updated = tickets.find((t) => t.id === selected.id)
    if (updated) {
      const msgs = JSON.parse(updated.messages || '[]')
      msgs.push({ from: 'staff', message: reply, at: new Date().toISOString(), isStaff: true })
      setSelected({ ...updated, messages: JSON.stringify(msgs) })
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/v1/admin/support', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'update_status', status }) })
    toast.success(`Ticket ${status}`)
    load()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Support Tickets</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{tickets.length} tickets • {tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length} open</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-xl bg-card border border-border overflow-hidden">
          {loading ? (
            <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {tickets.map((t) => (
                <button key={t.id} onClick={() => setSelected(t)} className={cn('w-full text-left p-3 hover:bg-muted/30', selected?.id === t.id && 'bg-muted/50')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{t.ticketNo}</span>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', statusColor(t.status))}>{t.status}</span>
                  </div>
                  <div className="font-medium text-sm line-clamp-1">{t.subject}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.customer?.name} • {fmtDate(t.createdAt)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-bold">{selected.subject}</h2>
                  <p className="text-xs text-muted-foreground">{selected.ticketNo} • {selected.customer?.name} • {selected.customer?.email}</p>
                </div>
                <select value={selected.status} onChange={(e) => { updateStatus(selected.id, e.target.value); setSelected({ ...selected, status: e.target.value }) }} className="h-8 px-2 rounded-lg border border-input bg-background text-xs">
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {(() => {
                  try { return JSON.parse(selected.messages || '[]') } catch { return [] }
                })().map((m: any, i: number) => (
                  <div key={i} className={cn('p-3 rounded-lg', m.isStaff ? 'bg-navy/5 dark:bg-yellow/5 ml-8' : 'bg-muted/30 mr-8')}>
                    <div className="text-xs text-muted-foreground mb-1">{m.isStaff ? 'Staff' : selected.customer?.name} • {fmtDateTime(m.at)}</div>
                    <div className="text-sm">{m.message}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." rows={3} className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                <button onClick={sendReply} className="self-end h-10 px-3 rounded-lg bg-navy text-white text-sm font-medium flex items-center gap-1"><Send size={14} /></button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-card border border-border p-12 text-center">
              <LifeBuoy className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Select a ticket to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// =============== CMS ===============
export function CMSView() {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/v1/admin/cms')
    const data = await res.json()
    setSections(data.sections || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const toggle = async (s: any) => {
    await fetch('/api/v1/admin/cms', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, isVisible: !s.isVisible }) })
    load()
  }

  if (loading) return <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>CMS / Homepage Builder</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Control storefront sections without editing code</p>
      </div>
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.id} className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><FileText size={18} className="text-navy dark:text-yellow" /></div>
              <div>
                <div className="font-semibold text-sm">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.subtitle} • Order #{s.sortOrder}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Visible</span>
                <button onClick={() => toggle(s)} className={cn('w-9 h-5 rounded-full transition-colors relative', s.isVisible ? 'bg-navy dark:bg-yellow' : 'bg-muted')}>
                  <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform', s.isVisible ? 'translate-x-4' : 'translate-x-0.5')} />
                </button>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============== ANALYTICS ===============
export function AnalyticsView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch('/api/v1/admin/stats').then(r => r.json()).then(d => { setData(d); setLoading(false) }) }, [])

  if (loading || !data) return <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Detailed performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-3 rounded-lg bg-muted text-sm font-medium flex items-center gap-1"><Download size={14} /> CSV</button>
          <button className="h-9 px-3 rounded-lg bg-muted text-sm font-medium flex items-center gap-1"><Download size={14} /> PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border"><div className="text-2xl font-bold">{fmtPrice(data.kpis.revenue)}</div><div className="text-xs text-muted-foreground">Total Revenue</div></div>
        <div className="p-4 rounded-xl bg-card border border-border"><div className="text-2xl font-bold">{fmtNumber(data.kpis.orders)}</div><div className="text-xs text-muted-foreground">Total Orders</div></div>
        <div className="p-4 rounded-xl bg-card border border-border"><div className="text-2xl font-bold">{fmtPrice(data.kpis.aov)}</div><div className="text-xs text-muted-foreground">Avg Order Value</div></div>
        <div className="p-4 rounded-xl bg-card border border-border"><div className="text-2xl font-bold">{fmtNumber(data.kpis.customers)}</div><div className="text-xs text-muted-foreground">Total Customers</div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-bold mb-3">Top Products</h3>
          <div className="space-y-2">
            {data.topProducts.map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow text-navy text-xs font-bold flex items-center justify-center">{i+1}</span>
                <span className="flex-1 text-sm truncate">{p.title}</span>
                <span className="text-sm font-bold">{fmtNumber(p.salesCount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-bold mb-3">Top Categories</h3>
          <div className="space-y-2">
            {data.topCategories.map((c: any, i: number) => (
              <div key={c.slug} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">{i+1}</span>
                <span className="flex-1 text-sm capitalize">{c.slug.replace('-', ' ')}</span>
                <span className="text-sm font-bold">{fmtNumber(c.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============== AUDIT LOGS ===============
export function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch('/api/v1/admin/audit-logs').then(r => r.json()).then(d => { setLogs(d.logs || []); setLoading(false) }) }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track all sensitive admin actions</p>
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3">Action</th>
                  <th>Actor</th>
                  <th>Target</th>
                  <th>Time</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3"><code className="text-xs px-2 py-1 rounded bg-navy/10 dark:bg-yellow/10 text-navy dark:text-yellow font-mono">{l.action}</code></td>
                    <td className="text-sm">{l.actorEmail}</td>
                    <td className="text-xs text-muted-foreground">{l.targetType} {l.targetId ? `→ ${l.targetId.slice(0, 8)}` : ''}</td>
                    <td className="text-xs text-muted-foreground">{fmtDateTime(l.createdAt)}</td>
                    <td className="text-xs text-muted-foreground truncate max-w-xs">{l.after ? l.after.slice(0, 80) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// =============== SETTINGS ===============
export function SettingsView() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('GENERAL')
  const groups = ['GENERAL', 'STORE', 'PAYMENTS', 'EMAIL', 'SECURITY', 'SEO', 'SOCIAL']

  useEffect(() => {
    fetch('/api/v1/admin/settings').then(r => r.json()).then(d => {
      const map: Record<string, string> = {}
      ;(d.settings || []).forEach((s: any) => { map[s.key] = s.value })
      setSettings(map)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    const toSave = Object.entries(settings).map(([key, value]) => ({ key, value, group: activeGroup }))
    await fetch('/api/v1/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: toSave }) })
    toast.success('Settings saved')
  }

  if (loading) return <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>

  const groupKeys: Record<string, { key: string; label: string }[]> = {
    GENERAL: [
      { key: 'store_name', label: 'Store Name' }, { key: 'store_tagline', label: 'Store Tagline' },
      { key: 'contact_email', label: 'Contact Email' }, { key: 'contact_phone', label: 'Contact Phone' },
      { key: 'currency', label: 'Currency' }, { key: 'timezone', label: 'Timezone' },
    ],
    STORE: [
      { key: 'tax_rate', label: 'Tax Rate (%)' }, { key: 'enable_wishlist', label: 'Enable Wishlist (true/false)' },
      { key: 'enable_coupons', label: 'Enable Coupons (true/false)' }, { key: 'enable_reviews', label: 'Enable Reviews (true/false)' },
    ],
    PAYMENTS: [
      { key: 'stripe_enabled', label: 'Stripe Enabled' }, { key: 'jazzcash_enabled', label: 'JazzCash Enabled' },
      { key: 'easypaisa_enabled', label: 'Easypaisa Enabled' }, { key: 'bank_transfer_enabled', label: 'Bank Transfer Enabled' },
      { key: 'wallet_enabled', label: 'Wallet Enabled' },
    ],
    EMAIL: [
      { key: 'smtp_host', label: 'SMTP Host' }, { key: 'smtp_port', label: 'SMTP Port' },
      { key: 'smtp_user', label: 'SMTP Username' }, { key: 'sender_name', label: 'Sender Name' },
      { key: 'sender_email', label: 'Sender Email' },
    ],
    SECURITY: [
      { key: 'session_timeout', label: 'Session Timeout (minutes)' }, { key: 'password_min_length', label: 'Password Min Length' },
      { key: 'enable_2fa', label: 'Enable 2FA (true/false)' },
    ],
    SEO: [
      { key: 'seo_title', label: 'SEO Title' }, { key: 'seo_description', label: 'SEO Description' },
    ],
    SOCIAL: [
      { key: 'social_facebook', label: 'Facebook URL' }, { key: 'social_instagram', label: 'Instagram URL' },
      { key: 'social_tiktok', label: 'TikTok URL' }, { key: 'social_youtube', label: 'YouTube URL' },
      { key: 'social_whatsapp', label: 'WhatsApp URL' }, { key: 'social_telegram', label: 'Telegram URL' },
    ],
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your store</p>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit overflow-x-auto">
        {groups.map((g) => <button key={g} onClick={() => setActiveGroup(g)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium', activeGroup === g ? 'bg-background shadow-sm' : 'text-muted-foreground')}>{g}</button>)}
      </div>
      <div className="rounded-xl bg-card border border-border p-5 space-y-3">
        {groupKeys[activeGroup].map((f) => (
          <div key={f.key}>
            <label className="text-xs text-muted-foreground">{f.label}</label>
            <input value={settings[f.key] || ''} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          </div>
        ))}
      </div>
      <button onClick={save} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-semibold flex items-center gap-2"><Save size={16} /> Save Settings</button>
    </div>
  )
}
