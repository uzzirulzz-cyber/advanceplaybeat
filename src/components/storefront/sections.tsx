'use client'

import { useEffect, useState } from 'react'
import {
  Zap, TrendingUp, Tag, Gift, Shield, Clock, Headphones, RefreshCw,
  Gamepad2, Tv, Server, Megaphone, Bitcoin, Wrench, Download, Package,
  ArrowRight, ChevronRight, Star, CheckCircle2, Projector,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ProductCard } from './product-card'
import { SkeletonCard, EmptyState, Badge } from './common'
import { CountdownTimer } from './hero'
import { fmtPrice, discountPct } from '@/lib/utils'
import type { Product, Category } from '@/lib/types'

const CAT_ICONS: Record<string, any> = {
  gaming: Gamepad2, software: Package, 'gift-cards': Gift, streaming: Tv,
  iptv: Tv, 'smart-projectors': Projector, web3: Bitcoin, services: Wrench,
  subscriptions: RefreshCw, 'digital-downloads': Download,
}

// ---------- Section header ----------
function SectionHeader({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: string; icon?: any; action?: React.ReactNode }) {
  const { setSelectedCategory , currency } = useStore()
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-navy/10 dark:bg-yellow/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-navy dark:text-yellow" />
          </div>
        )}
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display), system-ui' }}>{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

// ---------- Trending now ----------
export function TrendingSection({ products, loading }: { products: Product[]; loading: boolean }) {
  const { setSelectedCategory } = useStore()
  const trending = products.filter((p) => p.isTrending).slice(0, 10)
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <SectionHeader
        title="Trending Now"
        subtitle="Hot picks loved by our customers this week"
        icon={TrendingUp}
        action={<button onClick={() => setSelectedCategory('all')} className="text-sm text-brand hover:underline flex items-center gap-1">View all <ChevronRight size={14} /></button>}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
        ) : trending.length === 0 ? (
          <div className="col-span-full"><EmptyState icon={Package} title="No trending products" /></div>
        ) : (
          trending.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </section>
  )
}

// ---------- Featured categories ----------
export function FeaturedCategoriesSection({ categories }: { categories: Category[] }) {
  const { setSelectedCategory } = useStore()
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <SectionHeader title="Featured Categories" subtitle="Explore our most popular digital product categories" icon={Tag} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = CAT_ICONS[cat.slug] || Package
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); window.scrollTo({ top: 600, behavior: 'smooth' }) }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left border border-border hover:border-yellow/50 transition-all hover:shadow-card-hover"
              >
                <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl glass-navy flex items-center justify-center">
                  <Icon size={18} className="text-yellow" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-white/70 line-clamp-1">{cat.description}</p>
                  <div className="mt-2 flex items-center gap-1 text-yellow text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse <ArrowRight size={12} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ---------- Deals section with countdown ----------
export function DealsSection({ products, loading }: { products: Product[]; loading: boolean }) {
  const { currency } = useStore()
  const deals = products.filter((p) => p.isDeal && p.dealEndsAt).slice(0, 4)
  if (!loading && deals.length === 0) return null

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <div className="rounded-3xl bg-gradient-to-br from-navy via-navy to-navy/80 text-white p-6 lg:p-10 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-yellow/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-yellow/5 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <Badge variant="yellow"><Zap size={10} fill="currentColor" /> LIMITED TIME</Badge>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display), system-ui' }}>
              Deals of the Week
            </h2>
            <p className="mt-1 text-white/70">Grab these limited-time offers before they're gone!</p>
          </div>
          {deals[0]?.dealEndsAt && (
            <div>
              <div className="text-xs uppercase tracking-wider text-yellow font-semibold mb-2">Ends in:</div>
              <CountdownTimer endsAt={deals[0].dealEndsAt} size="md" />
            </div>
          )}
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="aspect-video skeleton-shimmer rounded-lg" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded mt-3" />
                <div className="h-6 w-20 skeleton-shimmer rounded mt-2" />
              </div>
            ))
          ) : (
            deals.map((p) => {
              const discount = discountPct(p.basePrice, p.salePrice || p.basePrice)
              return (
                <div key={p.id} className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => useStore.getState().openModal({ type: 'product', product: p })}>
                  <div className="aspect-video rounded-lg overflow-hidden bg-white/10">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm line-clamp-2 text-white">{p.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-extrabold text-yellow">{fmtPrice(p.salePrice || p.basePrice, currency)}</span>
                    <span className="text-xs text-white/50 line-through">{fmtPrice(p.basePrice, currency)}</span>
                    <Badge variant="danger">-{discount}%</Badge>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

// ---------- Best sellers ----------
export function BestSellersSection({ products, loading }: { products: Product[]; loading: boolean }) {
  const bestSellers = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 10)
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <SectionHeader title="Best Sellers" subtitle="Top-rated products loved by thousands" icon={Star} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          bestSellers.map((p, i) => (
            <div key={p.id} className="relative">
              <div className="absolute -top-1 -left-1 z-10 w-7 h-7 rounded-full bg-yellow text-navy font-bold text-xs flex items-center justify-center shadow-md">
                #{i + 1}
              </div>
              <ProductCard product={p} compact />
            </div>
          ))
        )}
      </div>
    </section>
  )
}

// ---------- Recently added ----------
export function RecentSection({ products, loading }: { products: Product[]; loading: boolean }) {
  const recent = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <SectionHeader title="Recently Added" subtitle="Fresh new products added to our catalog" icon={Clock} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            recent.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </div>
    </section>
  )
}

// ---------- Trust section ----------
export function TrustSection() {
  const items = [
    { icon: Shield, title: 'Secure Payments', desc: 'Industry-leading SSL encryption protects every transaction.' },
    { icon: Zap, title: 'Instant Delivery', desc: 'License keys and digital products delivered automatically within seconds.' },
    { icon: CheckCircle2, title: 'Verified Products', desc: 'Every product is sourced from authorised distributors and verified.' },
    { icon: Headphones, title: '24/7 Support', desc: 'Real human support around the clock via chat, email and WhatsApp.' },
    { icon: RefreshCw, title: 'Refund Policy', desc: 'Money-back guarantee on unused keys and unsatisfactory products.' },
    { icon: Star, title: 'Trusted by 50K+', desc: 'Customers worldwide rely on PlayBeat for their digital purchases.' },
  ]
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <SectionHeader title="Why Shop With Us" subtitle="Premium experience with security and trust built in" icon={Shield} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.title} className="group p-5 rounded-2xl bg-card border border-border hover:border-yellow/50 hover:shadow-premium transition-all">
            <div className="w-12 h-12 rounded-xl bg-navy/10 dark:bg-yellow/10 flex items-center justify-center mb-3">
              <it.icon className="w-6 h-6 text-navy dark:text-yellow" />
            </div>
            <h3 className="font-bold text-base mb-1">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---------- Catalog grid (used for category filter) ----------
export function CatalogGrid({ products, loading }: { products: Product[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }
  if (products.length === 0) {
    return <EmptyState icon={Package} title="No products found" description="Try a different category or search term." />
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
