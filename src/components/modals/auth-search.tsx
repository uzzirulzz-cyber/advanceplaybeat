'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Loader2, Zap, Shield, Star, Eye, EyeOff } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

// re-export toast (used elsewhere)
export { toast }

export function AuthModal() {
  const { modal, closeModal, openModal, setUser, setView } = useStore()
  const isOpen = modal.type === 'auth'
  const mode = isOpen ? modal.mode : 'login'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setError('')
      // Pre-fill demo customer for convenience
      if (mode === 'login') {
        setEmail('customer@playbeat.digital')
        setPassword('customer123')
      } else {
        setEmail(''); setPassword(''); setName('')
      }
    }
  }, [isOpen, mode])

  if (!isOpen) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register'
      const body = mode === 'login' ? { email, password } : { email, password, name }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Authentication failed'); return }
      setUser(data.user)
      toast.success(mode === 'login' ? `Welcome back, ${data.user.name}!` : `Account created! Welcome, ${data.user.name}.`)
      closeModal()
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const fillAdmin = () => {
    setEmail('admin@playbeat.digital')
    setPassword('admin123')
    toast.info('Admin credentials filled')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-md w-[95vw] p-0 gap-0 overflow-hidden">
        {/* Hero side */}
        <div className="gradient-hero text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 animate-gradient-shift" style={{ background: 'radial-gradient(circle at 30% 20%, oklch(0.88 0.15 95 / 0.5) 0%, transparent 50%)' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow flex items-center justify-center">
                <Zap className="text-navy" fill="currentColor" size={20} />
              </div>
              <div>
                <div className="font-extrabold text-lg leading-none" style={{ fontFamily: 'var(--font-display), system-ui' }}>PlayBeat</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-yellow">Digital</div>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-display), system-ui' }}>
              {mode === 'login' ? 'Welcome back!' : 'Join PlayBeat today'}
            </h2>
            <p className="text-sm text-white/80">
              {mode === 'login' ? 'Sign in to access your orders, subscriptions and digital products.' : 'Create an account for instant access to 25,000+ digital products.'}
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center"><div className="text-lg font-extrabold text-yellow">50K+</div><div className="text-[9px] text-white/70 uppercase">Orders</div></div>
              <div className="text-center"><div className="text-lg font-extrabold text-yellow">4.8★</div><div className="text-[9px] text-white/70 uppercase">Rating</div></div>
              <div className="text-center"><div className="text-lg font-extrabold text-yellow">25K+</div><div className="text-[9px] text-white/70 uppercase">Products</div></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={submit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full h-11 pl-10 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="w-full h-11 pl-10 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 rounded-lg">{error}</div>}

            <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-navy text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => openModal({ type: 'auth', mode: mode === 'login' ? 'register' : 'login' })} className="text-brand font-semibold hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {/* Demo credentials hint */}
          {mode === 'login' && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border text-xs">
              <div className="font-semibold mb-1">Demo credentials:</div>
              <div className="text-muted-foreground">Customer: customer@playbeat.digital / customer123</div>
              <div className="text-muted-foreground">Admin: <button onClick={fillAdmin} className="text-brand hover:underline">admin@playbeat.digital / admin123</button></div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Shield size={11} /> Secure</span>
            <span className="flex items-center gap-1"><Lock size={11} /> Encrypted</span>
            <span className="flex items-center gap-1"><Star size={11} /> Trusted</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- Wishlist modal ----------------
export function WishlistModal() {
  const { modal, closeModal, products, wishlist, openModal, user } = useStore()
  const isOpen = modal.type === 'wishlist'

  if (!isOpen) return null
  const wishlisted = products.filter((p) => wishlist.includes(p.id))

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-5 border-b border-border sticky top-0 bg-background z-10">
          <DialogTitle>Your Wishlist ({wishlisted.length})</DialogTitle>
        </DialogHeader>
        <div className="p-5">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">Sign in to view your saved wishlist</p>
              <button onClick={() => openModal({ type: 'auth', mode: 'login' })} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-medium">Sign In</button>
            </div>
          ) : wishlisted.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">Your wishlist is empty</p>
              <button onClick={closeModal} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-medium">Browse Products</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wishlisted.map((p) => (
                <button key={p.id} onClick={() => openModal({ type: 'product', product: p })} className="text-left rounded-xl border border-border overflow-hidden hover:shadow-premium transition-shadow">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-medium line-clamp-2 min-h-[2rem]">{p.title}</div>
                    <div className="mt-1 font-bold text-navy dark:text-yellow text-sm">${p.salePrice ?? p.basePrice}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- Search modal ----------------
export function SearchModal() {
  const { modal, closeModal, products, categories, openModal, searchQuery, setSearchQuery } = useStore()
  const isOpen = modal.type === 'search'
  const [local, setLocal] = useState(searchQuery)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => { setLocal(searchQuery) }, [searchQuery, isOpen])

  if (!isOpen) return null

  let results = products.filter((p) =>
    (local === '' || p.title.toLowerCase().includes(local.toLowerCase()) || p.shortDesc?.toLowerCase().includes(local.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(local.toLowerCase()))) &&
    (filterCategory === 'all' || p.categorySlug === filterCategory) &&
    (filterPrice === 'all' || (filterPrice === '0-20' && (p.salePrice || p.basePrice) < 20) || (filterPrice === '20-50' && (p.salePrice || p.basePrice) >= 20 && (p.salePrice || p.basePrice) < 50) || (filterPrice === '50-100' && (p.salePrice || p.basePrice) >= 50 && (p.salePrice || p.basePrice) < 100) || (filterPrice === '100+' && (p.salePrice || p.basePrice) >= 100)) &&
    (filterRating === 'all' || p.rating >= parseFloat(filterRating))
  )

  if (sortBy === 'price-low') results = [...results].sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice))
  else if (sortBy === 'price-high') results = [...results].sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice))
  else if (sortBy === 'rating') results = [...results].sort((a, b) => b.rating - a.rating)
  else if (sortBy === 'popular') results = [...results].sort((a, b) => b.salesCount - a.salesCount)

  const popularSearches = ['Netflix', 'Windows 11', 'Steam', 'IPTV', 'Spotify', 'ChatGPT']

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="relative">
            <input
              autoFocus
              value={local}
              onChange={(e) => { setLocal(e.target.value); setSearchQuery(e.target.value) }}
              placeholder="Search products, categories, brands..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-base focus:outline-none focus:ring-2 focus:ring-yellow"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
            <span className="text-muted-foreground">Popular:</span>
            {popularSearches.map((s) => (
              <button key={s} onClick={() => { setLocal(s); setSearchQuery(s) }} className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/70">{s}</button>
            ))}
          </div>
        </DialogHeader>

        <div className="p-4 flex gap-4 border-b border-border">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm">
            <option value="all">All prices</option>
            <option value="0-20">Under $20</option>
            <option value="20-50">$20 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm">
            <option value="all">All ratings</option>
            <option value="4">4★ & up</option>
            <option value="4.5">4.5★ & up</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 px-2 rounded-lg border border-input bg-background text-sm ml-auto">
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        <div className="p-4">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No products found. Try a different search term.</p>
            </div>
          ) : (
            <>
              <div className="text-xs text-muted-foreground mb-3">{results.length} products found</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {results.slice(0, 12).map((p) => (
                  <button key={p.id} onClick={() => openModal({ type: 'product', product: p })} className="text-left rounded-xl border border-border overflow-hidden hover:shadow-premium transition-shadow">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-medium line-clamp-2 min-h-[2rem]">{p.title}</div>
                      <div className="mt-1 font-bold text-navy dark:text-yellow text-sm">${p.salePrice ?? p.basePrice}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- Support modal ----------------
export function SupportModal() {
  const { modal, closeModal, user, openModal } = useStore()
  const isOpen = modal.type === 'support'
  const [form, setForm] = useState({ subject: '', category: 'GENERAL', priority: 'NORMAL', message: '' })
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<any[]>([])
  const [view, setView] = useState<'new' | 'list'>('new')

  useEffect(() => {
    if (isOpen && user) loadTickets()
  }, [isOpen, user])

  if (!isOpen) return null

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/v1/support')
      const data = await res.json()
      setTickets(data.tickets || [])
    } catch {}
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { openModal({ type: 'auth', mode: 'login' }); return }
    setLoading(true)
    try {
      const res = await fetch('/api/v1/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Support ticket created. We will reply within 24h.')
        setForm({ subject: '', category: 'GENERAL', priority: 'NORMAL', message: '' })
        await loadTickets()
        setView('list')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-5 border-b border-border">
          <DialogTitle>Support Center</DialogTitle>
        </DialogHeader>
        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setView('new')} className={view === 'new' ? 'px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium' : 'px-4 py-2 rounded-lg bg-muted text-sm'}>New Ticket</button>
            <button onClick={() => setView('list')} className={view === 'list' ? 'px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium' : 'px-4 py-2 rounded-lg bg-muted text-sm'}>My Tickets ({tickets.length})</button>
          </div>

          {view === 'new' ? (
            <form onSubmit={submit} className="space-y-3">
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="Subject" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
              <div className="grid grid-cols-2 gap-2">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 px-2 rounded-lg border border-input bg-background text-sm">
                  <option value="GENERAL">General</option><option value="ORDER">Order Issue</option><option value="PAYMENT">Payment Issue</option><option value="DELIVERY">Delivery Issue</option><option value="REFUND">Refund Request</option><option value="ACCOUNT">Account Issue</option>
                </select>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="h-10 px-2 rounded-lg border border-input bg-background text-sm">
                  <option value="LOW">Low</option><option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
                </select>
              </div>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required placeholder="Describe your issue in detail..." className="w-full h-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
              <button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-navy text-white font-semibold disabled:opacity-50">Submit Ticket</button>
            </form>
          ) : (
            <div className="space-y-2">
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No tickets yet.</p>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{t.subject}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : t.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{t.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{t.ticketNo} • {new Date(t.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

