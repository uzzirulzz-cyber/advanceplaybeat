'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Package, Heart, RefreshCw, Wallet, Bell, LifeBuoy, Shield, LogOut,
  Key, Download, ChevronRight, Eye, EyeOff, Copy, CheckCircle2, AlertCircle, Clock,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useStore } from '@/lib/store'
import { fmtPrice, fmtDate, fmtDateTime, statusColor, cn, maskKey } from '@/lib/utils'
import { Badge } from '@/components/storefront/common'
import { toast } from 'sonner'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'downloads', label: 'Digital Products', icon: Download },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'support', label: 'Support', icon: LifeBuoy },
  { id: 'security', label: 'Security', icon: Shield },
]

export function AccountModal() {
  const { modal, closeModal, user, logout, products, wishlist, openModal , currency } = useStore()
  const isOpen = modal.type === 'account'
  const initialTab = isOpen ? (modal.tab || 'overview') : 'overview'
  const [tab, setTab] = useState(initialTab)

  useEffect(() => { if (isOpen) setTab(initialTab) }, [initialTab, isOpen])

  if (!isOpen || !user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-[88vh]">
          {/* Sidebar */}
          <div className="w-56 border-r border-border bg-muted/30 p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-4 p-2">
              <div className="w-10 h-10 rounded-full gradient-navy flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    tab === t.id ? 'bg-navy text-white dark:bg-yellow dark:text-navy' : 'hover:bg-muted text-foreground/80'
                  )}
                >
                  <t.icon size={15} /> {t.label}
                </button>
              ))}
            </nav>
            <button onClick={() => { logout(); closeModal() }} className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600">
              <LogOut size={15} /> Sign Out
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === 'overview' && <OverviewTab user={user} setTab={setTab} />}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'downloads' && <DownloadsTab />}
            {tab === 'subscriptions' && <SubscriptionsTab />}
            {tab === 'wishlist' && <WishlistTab products={products.filter((p) => wishlist.includes(p.id))} />}
            {tab === 'wallet' && <WalletTab user={user} />}
            {tab === 'notifications' && <NotificationsTab />}
            {tab === 'support' && <SupportTab />}
            {tab === 'security' && <SecurityTab user={user} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OverviewTab({ user, setTab }: { user: any; setTab: (t: any) => void }) {
  const [orders, setOrders] = useState<any[]>([])
  const [subs, setSubs] = useState<any[]>([])
  const [stats, setStats] = useState({ totalOrders: 0, activeSubs: 0, wallet: 0, pending: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/orders').then(r => r.json()),
      fetch('/api/v1/subscriptions').then(r => r.json()),
    ]).then(([o, s]) => {
      setOrders(o.orders || [])
      setSubs(s.subscriptions || [])
      setStats({
        totalOrders: (o.orders || []).length,
        activeSubs: (s.subscriptions || []).filter((x: any) => x.status === 'ACTIVE').length,
        wallet: user.walletBalance,
        pending: (o.orders || []).filter((x: any) => x.status === 'PENDING' || x.status === 'PROCESSING').length,
      })
    })
  }, [user])

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-display), system-ui' }}>Welcome back, {user.name.split(' ')[0]}! 👋</h2>
        <p className="text-sm text-muted-foreground">Here's your account overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <Package className="w-5 h-5 text-navy dark:text-yellow mb-2" />
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <div className="text-xs text-muted-foreground">Total Orders</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <RefreshCw className="w-5 h-5 text-emerald-500 mb-2" />
          <div className="text-2xl font-bold">{stats.activeSubs}</div>
          <div className="text-xs text-muted-foreground">Active Subscriptions</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <Wallet className="w-5 h-5 text-yellow mb-2" />
          <div className="text-2xl font-bold">{fmtPrice(stats.wallet, currency)}</div>
          <div className="text-xs text-muted-foreground">Wallet Balance</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <Clock className="w-5 h-5 text-amber-500 mb-2" />
          <div className="text-2xl font-bold">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending Orders</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Recent Orders</h3>
          <button onClick={() => setTab('orders')} className="text-xs text-brand hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <div>
                  <div className="font-semibold text-sm">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{fmtDate(o.createdAt)} • {o.items.length} items</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{fmtPrice(o.total, currency)}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded', statusColor(o.status))}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/orders').then(r => r.json()).then(d => { setOrders(d.orders || []); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-8 text-sm text-muted-foreground">Loading orders...</div>

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No orders yet</p>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-border overflow-hidden">
            <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy/10 dark:bg-yellow/10 flex items-center justify-center"><Package size={16} className="text-navy dark:text-yellow" /></div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{fmtDate(o.createdAt)} • {o.items.length} items • {fmtPrice(o.total, currency)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-xs px-2 py-0.5 rounded', statusColor(o.status))}>{o.status}</span>
                <ChevronRight size={14} className={cn('transition-transform', expanded === o.id && 'rotate-90')} />
              </div>
            </button>
            {expanded === o.id && (
              <div className="border-t border-border p-4 space-y-2">
                {o.items.map((it: any) => (
                  <div key={it.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                    <Key size={16} className="text-navy dark:text-yellow mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{it.title}</div>
                      {it.variantName && <div className="text-xs text-muted-foreground">{it.variantName} × {it.qty}</div>}
                      {it.deliveredKey && (
                        <div className="mt-2 p-2 rounded-lg bg-navy/5 dark:bg-yellow/5 border border-navy/10 dark:border-yellow/20">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Delivered:</div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-navy dark:text-yellow break-all">{it.deliveredKey}</code>
                            <button onClick={() => { navigator.clipboard?.writeText(it.deliveredKey); toast.success('Copied to clipboard') }} className="text-muted-foreground hover:text-foreground"><Copy size={12} /></button>
                          </div>
                        </div>
                      )}
                      {it.deliveryStatus === 'PENDING_MANUAL' && <div className="text-xs text-amber-600 mt-1">⏳ Manual fulfillment in progress</div>}
                    </div>
                    <span className={cn('text-xs px-2 py-0.5 rounded', statusColor(it.deliveryStatus))}>{it.deliveryStatus}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function DownloadsTab() {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => { fetch('/api/v1/orders').then(r => r.json()).then(d => setOrders((d.orders || []).filter((o: any) => o.fulfillmentStatus === 'FULFILLED' || o.fulfillmentStatus === 'COMPLETED'))) }, [])

  const allItems = orders.flatMap((o) => o.items.map((it: any) => ({ ...it, orderNumber: o.orderNumber, orderId: o.id })))

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>Digital Products</h2>
      {allItems.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No digital products yet.</p>
      ) : (
        allItems.map((it) => (
          <div key={it.id} className="p-4 rounded-xl border border-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-sm">{it.title}</div>
                <div className="text-xs text-muted-foreground">{it.variantName} • Order {it.orderNumber}</div>
              </div>
              {it.deliveredKey && (
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your key:</div>
                  <code className="text-xs font-mono text-navy dark:text-yellow break-all">{it.deliveredKey}</code>
                  <button onClick={() => { navigator.clipboard?.writeText(it.deliveredKey); toast.success('Copied') }} className="block ml-auto mt-1 text-xs text-brand hover:underline">Copy</button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function SubscriptionsTab() {
  const [subs, setSubs] = useState<any[]>([])
  useEffect(() => { fetch('/api/v1/subscriptions').then(r => r.json()).then(d => setSubs(d.subscriptions || [])) }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>My Subscriptions</h2>
      {subs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No active subscriptions.</p>
      ) : (
        subs.map((s) => (
          <div key={s.id} className="p-4 rounded-xl border border-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.product?.title}</div>
                <div className="text-xs text-muted-foreground mt-1">Started: {fmtDate(s.startDate)} • Expires: {fmtDate(s.endDate)}</div>
              </div>
              <span className={cn('text-xs px-2 py-0.5 rounded', statusColor(s.status))}>{s.status}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${s.autoRenew ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-xs text-muted-foreground">{s.autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled'}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function WishlistTab({ products }: { products: any[] }) {
  const { openModal } = useStore()
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>My Wishlist</h2>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <button key={p.id} onClick={() => openModal({ type: 'product', product: p })} className="text-left rounded-xl border border-border overflow-hidden hover:shadow-premium transition-shadow">
              <div className="aspect-square bg-muted overflow-hidden"><img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" /></div>
              <div className="p-2">
                <div className="text-xs font-medium line-clamp-2">{p.title}</div>
                <div className="mt-1 font-bold text-navy dark:text-yellow text-sm">{fmtPrice(p.salePrice || p.basePrice, currency)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function WalletTab({ user }: { user: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>Wallet & Credits</h2>
      <div className="p-6 rounded-2xl gradient-navy text-white">
        <div className="text-xs uppercase tracking-wider text-yellow mb-1">Available Balance</div>
        <div className="text-4xl font-extrabold">{fmtPrice(user.walletBalance, currency)}</div>
        <div className="text-xs text-white/70 mt-2">Use wallet balance at checkout for any order</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 rounded-xl border border-border hover:border-yellow/50 transition-colors text-left">
          <Wallet className="w-5 h-5 text-yellow mb-2" />
          <div className="font-semibold text-sm">Add Funds</div>
          <div className="text-xs text-muted-foreground">Top up your wallet</div>
        </button>
        <button className="p-4 rounded-xl border border-border hover:border-yellow/50 transition-colors text-left">
          <Clock className="w-5 h-5 text-blue-500 mb-2" />
          <div className="font-semibold text-sm">Transaction History</div>
          <div className="text-xs text-muted-foreground">View all transactions</div>
        </button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState<any[]>([])
  useEffect(() => { fetch('/api/v1/notifications').then(r => r.json()).then(d => setNotifs(d.notifications || [])) }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>Notifications</h2>
      {notifs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
      ) : (
        notifs.map((n) => (
          <div key={n.id} className={cn('p-4 rounded-xl border', n.isRead ? 'border-border' : 'border-yellow/50 bg-yellow/5')}>
            <div className="flex items-start gap-2">
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-yellow mt-1.5 shrink-0" />}
              <div className="flex-1">
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{fmtDateTime(n.createdAt)}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function SupportTab() {
  const [tickets, setTickets] = useState<any[]>([])
  useEffect(() => { fetch('/api/v1/support').then(r => r.json()).then(d => setTickets(d.tickets || [])) }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>My Support Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No tickets yet.</p>
      ) : (
        tickets.map((t) => (
          <div key={t.id} className="p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{t.subject}</div>
                <div className="text-xs text-muted-foreground">{t.ticketNo} • {fmtDate(t.createdAt)}</div>
              </div>
              <span className={cn('text-xs px-2 py-0.5 rounded', statusColor(t.status))}>{t.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function SecurityTab({ user }: { user: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display), system-ui' }}>Security</h2>
      <div className="p-4 rounded-xl border border-border">
        <h3 className="font-semibold text-sm mb-3">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{user.email}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{user.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="capitalize">{user.role.toLowerCase()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span>{fmtDate(user.createdAt)}</span></div>
        </div>
      </div>
      <div className="p-4 rounded-xl border border-border">
        <h3 className="font-semibold text-sm mb-3">Change Password</h3>
        <div className="space-y-2">
          <input type="password" placeholder="Current password" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          <input type="password" placeholder="New password" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          <input type="password" placeholder="Confirm new password" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          <button onClick={() => toast.success('Password updated (demo)')} className="h-10 px-4 rounded-lg bg-navy text-white text-sm font-medium">Update Password</button>
        </div>
      </div>
      <div className="p-4 rounded-xl border border-border">
        <h3 className="font-semibold text-sm mb-3">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm">Add an extra layer of security</div>
            <div className="text-xs text-muted-foreground">Protect your account with 2FA</div>
          </div>
          <button onClick={() => toast.info('2FA setup coming soon')} className="h-9 px-3 rounded-lg border border-border text-sm">Enable 2FA</button>
        </div>
      </div>
    </div>
  )
}
