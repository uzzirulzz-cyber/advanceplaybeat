'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SafeUser, Product, CartItem, Category } from './types'

type View =
  | 'storefront'
  | 'admin'

type AdminView =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'subscriptions'
  | 'support'
  | 'cms'
  | 'analytics'
  | 'audit'
  | 'settings'

type Modal =
  | { type: 'none' }
  | { type: 'product'; product: Product }
  | { type: 'cart' }
  | { type: 'auth'; mode: 'login' | 'register' }
  | { type: 'wishlist' }
  | { type: 'account'; tab?: string }
  | { type: 'checkout' }
  | { type: 'search' }
  | { type: 'order-lookup' }
  | { type: 'support' }

interface AppState {
  // Routing
  view: View
  setView: (v: View) => void

  adminView: AdminView
  setAdminView: (v: AdminView) => void

  // Modal
  modal: Modal
  openModal: (m: Modal) => void
  closeModal: () => void

  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (t: 'light' | 'dark') => void

  // Currency / language
  currency: string
  setCurrency: (c: string) => void
  language: string
  setLanguage: (l: string) => void

  // Auth
  user: SafeUser | null
  setUser: (u: SafeUser | null) => void
  logout: () => void

  // Products + categories (cached client-side)
  products: Product[]
  setProducts: (p: Product[]) => void
  categories: Category[]
  setCategories: (c: Category[]) => void

  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, variantId?: string | null) => void
  updateCartQty: (productId: string, variantId: string | undefined | null, qty: number) => void
  clearCart: () => void

  // Wishlist (for guests — stored locally; for logged in, synced via API)
  wishlist: string[] // productIds
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean

  // Coupon
  appliedCoupon: { code: string; discount: number; type: string; value: number } | null
  setAppliedCoupon: (c: { code: string; discount: number; type: string; value: number } | null) => void

  // UI filters
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'storefront',
      setView: (v) => set({ view: v, modal: { type: 'none' } }),

      adminView: 'dashboard',
      setAdminView: (v) => set({ adminView: v }),

      modal: { type: 'none' },
      openModal: (m) => set({ modal: m }),
      closeModal: () => set({ modal: { type: 'none' } }),

      theme: 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (t) => set({ theme: t }),

      currency: 'USD',
      setCurrency: (c) => set({ currency: c }),
      language: 'en',
      setLanguage: (l) => set({ language: l }),

      user: null,
      setUser: (u) => set({ user: u }),
      logout: () => {
        fetch('/api/v1/auth/logout', { method: 'POST' })
        set({ user: null })
      },

      products: [],
      setProducts: (p) => set({ products: p }),
      categories: [],
      setCategories: (c) => set({ categories: c }),

      cart: [],
      addToCart: (item) =>
        set((s) => {
          const existing = s.cart.find((c) => c.productId === item.productId && c.variantId === item.variantId)
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.productId === item.productId && c.variantId === item.variantId
                  ? { ...c, qty: c.qty + item.qty }
                  : c
              ),
            }
          }
          return { cart: [...s.cart, item] }
        }),
      removeFromCart: (productId, variantId) =>
        set((s) => ({
          cart: s.cart.filter((c) => !(c.productId === productId && c.variantId === variantId)),
        })),
      updateCartQty: (productId, variantId, qty) =>
        set((s) => ({
          cart: s.cart.map((c) =>
            c.productId === productId && c.variantId === variantId
              ? { ...c, qty: Math.max(1, qty) }
              : c
          ),
        })),
      clearCart: () => set({ cart: [], appliedCoupon: null }),

      wishlist: [],
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      isWishlisted: (productId) => get().wishlist.includes(productId),

      appliedCoupon: null,
      setAppliedCoupon: (c) => set({ appliedCoupon: c }),

      selectedCategory: 'all',
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'playbeat-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as any))),
      partialize: (s) => ({
        theme: s.theme,
        cart: s.cart,
        wishlist: s.wishlist,
        currency: s.currency,
        language: s.language,
        selectedCategory: s.selectedCategory,
      }),
    }
  )
)
