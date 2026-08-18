'use client'

import { useEffect, useState } from 'react'
import { Users, Search, Loader2, X, UserX, UserCheck, DollarSign, MinusCircle, PlusCircle, Mail, Ban, Shield } from 'lucide-react'
import { fmtPrice, fmtDate, fmtNumber, statusColor, cn } from '@/lib/utils'
import { toast } from 'sonner'

export function CustomersView() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const res = await fetch(`/api/v1/admin/customers?${params}`)
    const data = await res.json()
    setCustomers(data.customers || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search])

  const action = async (id: string, a: string, amount?: number) => {
    await fetch('/api/v1/admin/customers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: a, amount }) })
    toast.success(`Customer ${a}`)
    load()
    if (selected) {
      const updated = await (await fetch(`/api/v1/admin/customers?search=${selected.email}`)).json()
      if (updated.customers?.[0]) setSelected(updated.customers[0])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Customers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{customers.length} customers</p>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm" />
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12"><Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No customers found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3">Customer</th>
                  <th>Orders</th>
                  <th>Spent</th>
                  <th>Wallet</th>
                  <th>Subs</th>
                  <th>Tickets</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-white text-xs font-bold">{c.name.charAt(0)}</div>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c._count.orders}</td>
                    <td className="font-bold">{fmtPrice(c.totalSpent)}</td>
                    <td>{fmtPrice(c.walletBalance)}</td>
                    <td>{c._count.subscriptions}</td>
                    <td>{c._count.supportTickets}</td>
                    <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(c.status))}>{c.status}</span></td>
                    <td className="text-xs text-muted-foreground">{fmtDate(c.createdAt)}</td>
                    <td><button onClick={(e) => { e.stopPropagation(); setSelected(c) }} className="text-xs text-brand hover:underline">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} onAction={action} />}
    </div>
  )
}

function CustomerDetailModal({ customer, onClose, onAction }: { customer: any; onClose: () => void; onAction: (id: string, a: string, amount?: number) => void }) {
  const [creditAmount, setCreditAmount] = useState(10)
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-white font-bold">{customer.name.charAt(0)}</div>
            <div>
              <h2 className="font-bold">{customer.name}</h2>
              <p className="text-xs text-muted-foreground">{customer.email}</p>
            </div>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-muted/30 text-center"><div className="text-xl font-bold">{customer._count.orders}</div><div className="text-xs text-muted-foreground">Orders</div></div>
            <div className="p-3 rounded-xl bg-muted/30 text-center"><div className="text-xl font-bold">{fmtPrice(customer.totalSpent)}</div><div className="text-xs text-muted-foreground">Spent</div></div>
            <div className="p-3 rounded-xl bg-muted/30 text-center"><div className="text-xl font-bold">{fmtPrice(customer.walletBalance)}</div><div className="text-xs text-muted-foreground">Wallet</div></div>
          </div>

          {/* Status actions */}
          <div>
            <div className="text-sm font-semibold mb-2">Account Status</div>
            <div className="flex gap-2">
              {customer.status === 'ACTIVE' ? (
                <button onClick={() => onAction(customer.id, 'suspend')} className="h-9 px-3 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1"><UserX size={14} /> Suspend</button>
              ) : (
                <button onClick={() => onAction(customer.id, 'activate')} className="h-9 px-3 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1"><UserCheck size={14} /> Activate</button>
              )}
              <button onClick={() => toast.info('Password reset email sent')} className="h-9 px-3 rounded-lg bg-muted text-xs font-medium flex items-center gap-1"><Mail size={14} /> Reset Password</button>
            </div>
          </div>

          {/* Wallet */}
          <div>
            <div className="text-sm font-semibold mb-2">Wallet Management</div>
            <div className="flex items-center gap-2">
              <input type="number" step="0.01" value={creditAmount} onChange={(e) => setCreditAmount(Number(e.target.value))} className="w-32 h-9 px-2 rounded-lg border border-input bg-background text-sm" />
              <button onClick={() => onAction(customer.id, 'add_credit', creditAmount)} className="h-9 px-3 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1"><PlusCircle size={14} /> Add Credit</button>
              <button onClick={() => onAction(customer.id, 'remove_credit', creditAmount)} className="h-9 px-3 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1"><MinusCircle size={14} /> Remove</button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl bg-muted/30 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{fmtDate(customer.createdAt)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Last login</span><span>{customer.lastLoginAt ? fmtDate(customer.lastLoginAt) : '—'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Subscriptions</span><span>{customer._count.subscriptions}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Support tickets</span><span>{customer._count.supportTickets}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
