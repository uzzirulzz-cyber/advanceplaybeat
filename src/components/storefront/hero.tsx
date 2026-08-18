'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Search, Sparkles, Shield, Zap, Star, TrendingUp } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtPrice } from '@/lib/utils'
import { timeLeft } from '@/lib/utils'

export function Hero() {
  const { products, categories, openModal, setSelectedCategory, setView, currency } = useStore()
  const [searchInput, setSearchInput] = useState('')

  const trending = products.filter((p) => p.isTrending).slice(0, 3)
  const featuredCats = categories.filter((c) => c.isFeatured).slice(0, 8)

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    useStore.getState().setSearchQuery(searchInput)
    openModal({ type: 'search' })
  }

  return (
    <section className="relative overflow-hidden gradient-hero-premium text-white">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30 animate-gradient-shift" style={{
        background: 'radial-gradient(circle at 20% 30%, oklch(0.88 0.15 95 / 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.65 0.13 230 / 0.4) 0%, transparent 50%)',
      }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Text + Search */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow/20 border border-yellow/30 backdrop-blur-sm">
              <Sparkles size={14} className="text-yellow" />
              <span className="text-xs font-medium text-yellow">Trusted by 50,000+ customers worldwide</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display), system-ui' }}>
              Premium Digital Products,
              <span className="block bg-gradient-to-r from-yellow via-yellow to-amber-300 bg-clip-text text-transparent">
                Delivered Instantly.
              </span>
            </h1>

            <p className="text-base lg:text-lg text-white/80 max-w-xl">
              Gaming keys, software licenses, gift cards, streaming subscriptions, IPTV, web hosting, web3 services and more — at unbeatable prices with 24/7 expert support.
            </p>

            {/* Search bar */}
            <form onSubmit={onSearch} className="relative max-w-lg">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search games, software, gift cards..."
                className="w-full h-14 pl-12 pr-32 rounded-full bg-white text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-yellow shadow-premium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-full bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                Search <ArrowRight size={14} />
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setSelectedCategory('all'); window.scrollTo({ top: 600, behavior: 'smooth' }) }} className="h-12 px-6 rounded-full bg-yellow text-navy font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                <Zap size={16} fill="currentColor" /> Shop Now
              </button>
              <button onClick={() => { setSelectedCategory('all'); window.scrollTo({ top: 600, behavior: 'smooth' }) }} className="h-12 px-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/15 transition-colors">
                Browse Deals
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-400" /> Secure SSL Checkout</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow" /> Instant Digital Delivery</span>
              <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow" /> 4.8/5 Rating</span>
            </div>
          </div>

          {/* Right: Trending preview cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {trending[0] && (
                <button
                  onClick={() => openModal({ type: 'product', product: trending[0] })}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden text-left shadow-card-hover"
                >
                  <img src={trending[0].imageUrl} alt={trending[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <div className="flex items-center gap-1 mb-1 text-[10px] font-semibold uppercase tracking-wider text-yellow">
                      <TrendingUp size={11} /> Trending #1
                    </div>
                    <div className="font-bold text-sm line-clamp-2">{trending[0].title}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-yellow font-bold">{fmtPrice(trending[0].salePrice ?? trending[0].basePrice, currency)}</span>
                      <span className="text-xs text-white/70 line-through">{fmtPrice(trending[0].basePrice, currency)}</span>
                    </div>
                  </div>
                </button>
              )}
              {trending[1] && (
                <button
                  onClick={() => openModal({ type: 'product', product: trending[1] })}
                  className="group relative aspect-square rounded-2xl overflow-hidden text-left shadow-card-hover"
                >
                  <img src={trending[1].imageUrl} alt={trending[1].title} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                  <div className="absolute bottom-0 p-3 text-white">
                    <div className="font-semibold text-xs line-clamp-1">{trending[1].title}</div>
                    <div className="text-yellow font-bold text-sm">{fmtPrice(trending[1].salePrice ?? trending[1].basePrice, currency)}</div>
                  </div>
                </button>
              )}
            </div>
            <div className="space-y-4 pt-8">
              {trending[2] && (
                <button
                  onClick={() => openModal({ type: 'product', product: trending[2] })}
                  className="group relative aspect-square rounded-2xl overflow-hidden text-left shadow-card-hover"
                >
                  <img src={trending[2].imageUrl} alt={trending[2].title} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                  <div className="absolute bottom-0 p-3 text-white">
                    <div className="font-semibold text-xs line-clamp-1">{trending[2].title}</div>
                    <div className="text-yellow font-bold text-sm">{fmtPrice(trending[2].salePrice ?? trending[2].basePrice, currency)}</div>
                  </div>
                </button>
              )}
              {/* Stats card */}
              <div className="aspect-[4/5] rounded-2xl glass-navy p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-yellow font-semibold mb-2">Why PlayBeat?</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Shield size={14} className="text-emerald-400" /> Verified authentic keys</div>
                    <div className="flex items-center gap-2"><Zap size={14} className="text-yellow" /> Instant auto-delivery</div>
                    <div className="flex items-center gap-2"><Star size={14} className="text-yellow" /> 24/7 expert support</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-extrabold text-yellow">50K+</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">Orders Delivered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-yellow">4.8★</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured categories strip */}
        <div className="mt-12 lg:mt-16">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Shop by Category</h3>
            <button onClick={() => setSelectedCategory('all')} className="text-xs text-yellow hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {featuredCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); window.scrollTo({ top: 600, behavior: 'smooth' }) }}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-yellow/50 transition-colors"
              >
                <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-2 text-center text-white">
                  <div className="text-xs font-semibold">{cat.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Countdown timer ----------
export function CountdownTimer({ endsAt, size = 'md' }: { endsAt: string | Date; size?: 'sm' | 'md' | 'lg' }) {
  const [time, setTime] = useState(() => timeLeft(endsAt))

  useEffect(() => {
    const i = setInterval(() => setTime(timeLeft(endsAt)), 1000)
    return () => clearInterval(i)
  }, [endsAt])

  if (time.expired) return <span className="text-rose-500 text-xs font-semibold">Expired</span>

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  }[size]

  return (
    <div className="flex items-center gap-1.5">
      {[
        { v: time.days, l: 'D' },
        { v: time.hours, l: 'H' },
        { v: time.minutes, l: 'M' },
        { v: time.seconds, l: 'S' },
      ].map((unit, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={`${sizes} rounded-lg bg-navy text-white font-bold flex items-center justify-center`}>
            {String(unit.v).padStart(2, '0')}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">{unit.l}</div>
        </div>
      ))}
    </div>
  )
}
