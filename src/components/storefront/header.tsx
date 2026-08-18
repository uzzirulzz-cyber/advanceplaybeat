'use client'

import { useState, useEffect } from 'react'
import {
  Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon, ChevronDown,
  Zap, Gift, Gamepad2, Tv, Server, Megaphone, Globe2, Bitcoin, Wrench,
  RefreshCw, Download, Bell, LogOut, LayoutDashboard, Package,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Badge } from './common'

const CATEGORY_ICONS: Record<string, any> = {
  gaming: Gamepad2,
  software: Package,
  'gift-cards': Gift,
  streaming: Tv,
  iptv: Tv,
  'social-media': Megaphone,
  'web-hosting': Server,
  'digital-marketing': Megaphone,
  web3: Bitcoin,
  services: Wrench,
  subscriptions: RefreshCw,
  'digital-downloads': Download,
}

export function Header() {
  const { user, cart, wishlist, theme, toggleTheme, openModal, setView, view, setSelectedCategory, categories } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const wishlistCount = wishlist.length

  const openCategory = (slug: string) => {
    setSelectedCategory(slug)
    setView('storefront')
    setMobileOpen(false)
    setMegaOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Top announcement bar */}
      <div className="gradient-navy text-white text-xs py-1.5 px-4 text-center font-medium">
        🎉 Launch Sale: Use code <span className="font-bold text-yellow">PLAYBEAT50</span> for 50% off your first order • Free instant delivery worldwide
      </div>

      <header className={cn('sticky top-0 z-40 transition-all duration-300', scrolled ? 'glass shadow-sm' : 'bg-background')}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <button onClick={() => setView('storefront')} className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-lg gradient-navy flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 gradient-yellow opacity-30" />
                <Zap className="w-5 h-5 text-yellow relative z-10" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold tracking-tight text-navy dark:text-white" style={{ fontFamily: 'var(--font-display), system-ui' }}>
                  PlayBeat
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-yellow">Digital</span>
              </div>
            </button>

            {/* Mega menu trigger */}
            <div
              className="hidden lg:flex items-center relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                <Menu size={16} /> Categories <ChevronDown size={14} className={cn('transition-transform', megaOpen && 'rotate-180')} />
              </button>
              {megaOpen && (
                <div className="absolute top-full left-0 mt-1 w-[720px] glass rounded-2xl shadow-card-hover p-6 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.slice(0, 12).map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] || Package
                    return (
                      <button
                        key={cat.id}
                        onClick={() => openCategory(cat.slug)}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-navy to-navy/70 flex items-center justify-center shrink-0 group-hover:from-yellow group-hover:to-yellow/80 transition-colors">
                          <Icon size={18} className="text-yellow group-hover:text-navy transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{cat.name}</div>
                          <div className="text-[10px] text-muted-foreground line-clamp-1">{cat.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Search */}
            <button
              onClick={() => openModal({ type: 'search' })}
              className="hidden md:flex items-center gap-2 flex-1 max-w-md h-10 px-4 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground text-sm transition-colors"
            >
              <Search size={16} />
              <span>Search products, categories, deals...</span>
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Theme toggle */}
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors" aria-label="Toggle theme">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Currency selector (desktop) */}
              <select className="hidden xl:block h-9 px-2 rounded-lg text-xs bg-muted border-0 cursor-pointer">
                <option>USD</option><option>EUR</option><option>GBP</option><option>PKR</option>
              </select>

              {/* Wishlist */}
              <button onClick={() => openModal({ type: 'wishlist' })} className="hidden sm:flex w-10 h-10 rounded-full hover:bg-muted items-center justify-center transition-colors relative" aria-label="Wishlist">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={() => openModal({ type: 'cart' })} className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors relative" aria-label="Cart">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-yellow text-navy text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 h-10 px-2 rounded-full hover:bg-muted transition-colors">
                    <div className="w-7 h-7 rounded-full gradient-navy flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={12} className="hidden sm:block" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-56 glass rounded-xl shadow-card-hover p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <div className="font-semibold text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <button onClick={() => openModal({ type: 'account', tab: 'overview' })} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted text-left">
                      <User size={14} /> My Account
                    </button>
                    <button onClick={() => openModal({ type: 'account', tab: 'orders' })} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted text-left">
                      <Package size={14} /> My Orders
                    </button>
                    <button onClick={() => openModal({ type: 'account', tab: 'subscriptions' })} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted text-left">
                      <RefreshCw size={14} /> Subscriptions
                    </button>
                    <button onClick={() => openModal({ type: 'account', tab: 'wallet' })} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted text-left">
                      <Bell size={14} /> Notifications
                    </button>
                    {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'MANAGER') && (
                      <button onClick={() => setView('admin')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted text-left text-brand font-medium">
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => useStore.getState().logout()} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 text-left">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openModal({ type: 'auth', mode: 'login' })}
                  className="hidden sm:flex h-10 px-4 rounded-full bg-navy text-white text-sm font-medium hover:opacity-90 transition-opacity items-center gap-2"
                >
                  <User size={15} /> Sign In
                </button>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center" aria-label="Menu">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Secondary nav (desktop) */}
          <div className="hidden lg:flex items-center gap-1 h-10 -mt-1 text-sm">
            <button onClick={() => openCategory('all')} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80 font-medium">
              All Products
            </button>
            <button onClick={() => openModal({ type: 'search' })} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80 font-medium">
              <span className="flex items-center gap-1.5"><Zap size={13} className="text-yellow" /> Deals</span>
            </button>
            <button onClick={() => openCategory('gaming')} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80">Gaming</button>
            <button onClick={() => openCategory('software')} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80">Software</button>
            <button onClick={() => openCategory('streaming')} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80">Streaming</button>
            <button onClick={() => openCategory('gift-cards')} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80">Gift Cards</button>
            <button onClick={() => openCategory('iptv')} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80">IPTV</button>
            <button onClick={() => openModal({ type: 'support' })} className="px-3 py-1.5 rounded-lg hover:bg-muted text-foreground/80">Support</button>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Globe2 size={12} /> EN</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems operational</span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 space-y-3">
              <button onClick={() => { openModal({ type: 'search' }); setMobileOpen(false) }} className="w-full flex items-center gap-2 h-11 px-4 rounded-xl bg-muted text-muted-foreground text-sm">
                <Search size={16} /> Search products...
              </button>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 12).map((cat) => (
                  <button key={cat.id} onClick={() => openCategory(cat.slug)} className="text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 text-sm font-medium">
                    {cat.name}
                  </button>
                ))}
              </div>
              {!user && (
                <button onClick={() => { openModal({ type: 'auth', mode: 'login' }); setMobileOpen(false) }} className="w-full h-11 rounded-xl bg-navy text-white text-sm font-medium">
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
