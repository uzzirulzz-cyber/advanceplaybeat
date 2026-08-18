'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Header } from '@/components/storefront/header'
import { Hero } from '@/components/storefront/hero'
import {
  TrendingSection, FeaturedCategoriesSection, DealsSection,
  BestSellersSection, RecentSection, TrustSection, CatalogGrid,
} from '@/components/storefront/sections'
import { Footer, CategoryFilterBar } from '@/components/storefront/footer'
import { AdminConsole } from '@/components/admin/console'
import {
  ProductDetailModal, CartDrawer, CheckoutModal, AuthModal, WishlistModal,
  SearchModal, SupportModal,
} from '@/components/modals'
import { AccountModal } from '@/components/modals/account'
import { toast } from 'sonner'

export default function Home() {
  const { view, theme, setTheme, products, setProducts, categories, setCategories, selectedCategory, user, setUser } = useStore()

  // Apply theme to <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  // Initial load: products + categories + session
  useEffect(() => {
    fetch('/api/v1/products?limit=200').then(r => r.json()).then(d => setProducts(d.products || []))
    fetch('/api/v1/categories').then(r => r.json()).then(d => setCategories(d.categories || []))
    fetch('/api/v1/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
  }, [setProducts, setCategories, setUser])

  if (view === 'admin') {
    if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'CONTENT', 'FINANCE'].includes(user.role)) {
      // Not authorized — show login prompt
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
            <p className="text-sm text-muted-foreground mb-6">You need to sign in as an admin user to access the dashboard.</p>
            <button onClick={() => useStore.getState().openModal({ type: 'auth', mode: 'login' })} className="h-11 px-6 rounded-lg bg-navy text-white font-semibold">Sign In as Admin</button>
            <p className="text-xs text-muted-foreground mt-4">Demo admin: admin@playbeat.digital / admin123</p>
          </div>
        </div>
      )
    }
    return (
      <>
        <AdminConsole />
        {/* Modals still available */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <AuthModal />
        <WishlistModal />
        <SearchModal />
        <SupportModal />
        <AccountModal />
      </>
    )
  }

  // Storefront view
  const filtered = selectedCategory === 'all' ? products : products.filter((p) => p.categorySlug === selectedCategory)
  const loading = products.length === 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {selectedCategory === 'all' ? (
          <>
            <Hero />
            <TrendingSection products={products} loading={loading} />
            <FeaturedCategoriesSection categories={categories.filter((c) => c.isFeatured)} />
            <DealsSection products={products} loading={loading} />
            <BestSellersSection products={products} loading={loading} />
            <RecentSection products={products} loading={loading} />
            <TrustSection />
          </>
        ) : (
          <>
            <CategoryFilterBar />
            <section className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-12">
              <CatalogGrid products={filtered} loading={loading} />
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <WishlistModal />
      <SearchModal />
      <SupportModal />
      <AccountModal />
    </div>
  )
}
