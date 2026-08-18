'use client'

import { useEffect, useState } from 'react'
import {
  ShoppingCart, Loader2, Search, Filter, Eye, X, Check, XCircle,
  RefreshCw, Clock, ChevronRight, Download, Mail, User as UserIcon,
} from 'lucide-react'
import { fmtPrice, fmtDate, fmtDateTime, fmtNumber, statusColor, cn } from '@/lib/utils'
import { toast } from 'sonner'

export function OrdersView() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterStatus !== 'all') params.set('status', filterStatus)
    const res = await fetch(`/api/v1/admin/orders?${params}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search, filterStatus])

  const action = async (id: string, a: string) => {
    await fetch('/api/v1/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: a }) })
    toast.success(`Order ${a}`)
    load()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{orders.length} orders</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card border border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order #, email, name..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm">
          <option value="all">All status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <button className="h-9 px-3 rounded-lg bg-muted text-sm font-medium flex items-center gap-1"><Download size={14} /> Export</button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12"><ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No orders found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-3">Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(o)}>
                    <td className="p-3 font-medium">{o.orderNumber}</td>
                    <td>
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                    </td>
                    <td>{o.items.length} items</td>
                    <td className="font-bold">{fmtPrice(o.total)}</td>
                    <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(o.paymentStatus))}>{o.paymentStatus}</span></td>
                    <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(o.status))}>{o.status}</span></td>
                    <td className="text-xs text-muted-foreground">{fmtDate(o.createdAt)}</td>
                    <td><button onClick={(e) => { e.stopPropagation(); setSelected(o) }} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><Eye size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} onAction={action} />}
    </div>
  )
}

function OrderDetailModal({ order, onClose, onAction }: { order: any; onClose: () => void; onAction: (id: string, a: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-background p-5 border-b border-border flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-lg">{order.orderNumber}</h2>
            <p className="text-xs text-muted-foreground">{fmtDateTime(order.createdAt)}</p>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status + payment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Order Status</div>
              <span className={cn('text-xs px-2 py-1 rounded', statusColor(order.status))}>{order.status}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Payment Status</div>
              <span className={cn('text-xs px-2 py-1 rounded', statusColor(order.paymentStatus))}>{order.paymentStatus}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="p-3 rounded-xl bg-muted/30">
            <div className="font-semibold text-sm mb-2">Customer</div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2"><UserIcon size={14} className="text-muted-foreground" /> {order.customerName}</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-muted-foreground" /> {order.customerEmail}</div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-muted-foreground" /> Payment: {order.paymentMethod}</div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="font-semibold text-sm mb-2">Items</div>
            <div className="space-y-2">
              {order.items.map((it: any) => (
                <div key={it.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">{it.title}</div>
                      {it.variantName && <div className="text-xs text-muted-foreground">{it.variantName} × {it.qty}</div>}
                      {it.deliveredKey && (
                        <div className="mt-2 p-2 rounded-lg bg-navy/5 dark:bg-yellow/5 border border-navy/10 dark:border-yellow/20">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Delivered key:</div>
                          <code className="text-xs font-mono text-navy dark:text-yellow break-all">{it.deliveredKey}</code>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{fmtPrice(it.price * it.qty)}</div>
                      <span className={cn('text-xs px-2 py-0.5 rounded', statusColor(it.deliveryStatus))}>{it.deliveryStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-3 rounded-xl bg-muted/30 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmtPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−{fmtPrice(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span className="text-navy dark:text-yellow">{fmtPrice(order.total)}</span></div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {order.status === 'PENDING' && <button onClick={() => onAction(order.id, 'process')} className="h-9 px-3 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1"><Clock size={12} /> Process</button>}
            {order.status === 'PROCESSING' && <button onClick={() => onAction(order.id, 'complete')} className="h-9 px-3 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1"><Check size={12} /> Complete</button>}
            {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && <button onClick={() => onAction(order.id, 'cancel')} className="h-9 px-3 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Cancel</button>}
            {order.paymentStatus === 'PAID' && order.status !== 'REFUNDED' && <button onClick={() => onAction(order.id, 'refund')} className="h-9 px-3 rounded-lg bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1"><RefreshCw size={12} /> Refund</button>}
            <button onClick={() => toast.info('Invoice download coming soon')} className="h-9 px-3 rounded-lg bg-muted text-xs font-medium flex items-center gap-1"><Download size={12} /> Invoice</button>
          </div>
        </div>
      </div>
    </div>
  )
}
