'use client'

import { useEffect, useState } from 'react'
import {
  DollarSign, ShoppingCart, Users, Package, RefreshCw, CreditCard,
  LifeBuoy, TrendingUp, ArrowUpRight, ArrowDownRight, Activity,
  Plus, Settings as SettingsIcon, Tag, Boxes, FileText, Zap,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtPrice, fmtNumber, fmtCompact, fmtDate, statusColor, cn } from '@/lib/utils'

export function DashboardView() {
  const { setAdminView } = useStore()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30d')

  useEffect(() => {
    fetch('/api/v1/admin/stats').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [range])

  if (loading || !data) return <div className="text-center py-12 text-sm text-muted-foreground">Loading dashboard...</div>

  const kpis = data.kpis
  const maxRevenue = Math.max(...data.revenueSeries.map((d: any) => d.revenue), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display), system-ui' }}>Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your store performance</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {['7d', '30d', '90d', '1y'].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={cn('px-3 py-1 rounded-md text-xs font-medium', range === r ? 'bg-background shadow-sm' : 'text-muted-foreground')}>{r}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign} label="Total Revenue" value={fmtPrice(kpis.revenue)} change="+12.5%" trend="up" color="emerald" />
        <KpiCard icon={ShoppingCart} label="Total Orders" value={fmtNumber(kpis.orders)} change="+8.2%" trend="up" color="blue" />
        <KpiCard icon={Users} label="Customers" value={fmtNumber(kpis.customers)} change="+15.3%" trend="up" color="purple" />
        <KpiCard icon={Package} label="Products" value={fmtNumber(kpis.products)} change="+3" trend="up" color="navy" />
        <KpiCard icon={RefreshCw} label="Active Subs" value={fmtNumber(kpis.activeSubscriptions)} change="+5.2%" trend="up" color="emerald" />
        <KpiCard icon={CreditCard} label="Pending Payments" value={fmtNumber(kpis.pendingPayments)} change="-2" trend="down" color="amber" />
        <KpiCard icon={LifeBuoy} label="Open Tickets" value={fmtNumber(kpis.openTickets)} change="+1" trend="up" color="rose" />
        <KpiCard icon={TrendingUp} label="Avg Order Value" value={fmtPrice(kpis.aov)} change="+4.1%" trend="up" color="yellow" />
      </div>

      {/* Revenue chart */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Revenue & Orders</h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-navy dark:bg-yellow" /> Revenue</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Orders</span>
            </div>
          </div>
          <div className="h-48 flex items-end gap-1">
            {data.revenueSeries.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex flex-col items-center justify-end relative" style={{ height: '180px' }}>
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-navy text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    {fmtPrice(d.revenue)} • {d.orders} orders
                  </div>
                  <div className="w-full bg-navy dark:bg-yellow rounded-t hover:opacity-80 transition-opacity" style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: d.revenue > 0 ? '2px' : '0' }} />
                </div>
                <div className="text-[8px] text-muted-foreground">{i % 5 === 0 ? d.date.slice(5) : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold mb-4">Sales by Payment Method</h3>
          <div className="space-y-3">
            {Object.entries(data.payByMethod).map(([method, amount]: [string, any]) => {
              const total = Object.values(data.payByMethod).reduce((s: number, v: any) => s + v, 0) as number
              const pct = (amount / total) * 100
              return (
                <div key={method}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{method}</span>
                    <span className="text-muted-foreground">{fmtPrice(amount)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-navy dark:bg-yellow rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top products + Top categories */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold mb-4">Top Products by Sales</h3>
          <div className="space-y-3">
            {data.topProducts.map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow text-navy text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{fmtNumber(p.salesCount)} sold</div>
                </div>
                <div className="text-sm font-bold text-navy dark:text-yellow">{fmtPrice(p.salePrice || p.basePrice)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold mb-4">Top Categories</h3>
          <div className="space-y-3">
            {data.topCategories.map((c: any, i: number) => {
              const max = Math.max(...data.topCategories.map((x: any) => x.count))
              const pct = (c.count / max) * 100
              return (
                <div key={c.slug}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium capitalize">{c.slug.replace('-', ' ')}</span>
                    <span className="text-muted-foreground">{fmtNumber(c.count)} sales</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-navy to-yellow rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <h3 className="font-bold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2">Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o: any) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2.5 font-medium">{o.orderNumber}</td>
                  <td className="text-muted-foreground">{o.customerName}</td>
                  <td className="font-bold">{fmtPrice(o.total)}</td>
                  <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(o.paymentStatus))}>{o.paymentStatus}</span></td>
                  <td><span className={cn('text-xs px-2 py-0.5 rounded', statusColor(o.status))}>{o.status}</span></td>
                  <td className="text-xs text-muted-foreground">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Add Product', icon: Plus, view: 'products' },
          { label: 'Add Category', icon: Tag, view: 'categories' },
          { label: 'Add Inventory', icon: Boxes, view: 'inventory' },
          { label: 'New Coupon', icon: Zap, view: 'coupons' },
          { label: 'Edit CMS', icon: FileText, view: 'cms' },
          { label: 'Settings', icon: SettingsIcon, view: 'settings' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => setAdminView(action.view as any)}
            className="p-4 rounded-2xl bg-card border border-border hover:border-yellow/50 hover:shadow-premium transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-navy/10 dark:bg-yellow/10 flex items-center justify-center mb-2 group-hover:bg-navy group-hover:text-white dark:group-hover:bg-yellow dark:group-hover:text-navy transition-colors">
              <action.icon size={18} />
            </div>
            <div className="text-sm font-semibold">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, change, trend, color }: { icon: any; label: string; value: string; change: string; trend: 'up' | 'down'; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    navy: 'bg-navy/10 text-navy dark:bg-yellow/10 dark:text-yellow',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    yellow: 'bg-yellow/10 text-yellow',
  }
  return (
    <div className="p-4 rounded-2xl bg-card border border-border hover:shadow-premium transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', colors[color])}>
          <Icon size={18} />
        </div>
        <div className={cn('flex items-center gap-0.5 text-xs font-semibold', trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  )
}
