'use client'

import Image from 'next/image'
import { Heart, ShoppingCart, Zap, Star, Eye } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useStore } from '@/lib/store'
import { fmtPrice, discountPct, cn } from '@/lib/utils'
import { RatingStars, Badge } from './common'

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { openModal, toggleWishlist, isWishlisted, addToCart, user } = useStore()

  const wishlisted = isWishlisted(product.id)
  const discount = discountPct(product.basePrice, product.salePrice || product.basePrice)
  const effectivePrice = product.salePrice ?? product.basePrice

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      openModal({ type: 'auth', mode: 'login' })
      return
    }
    const variant = product.variants?.[0]
    addToCart({
      productId: product.id,
      variantId: variant?.id || null,
      qty: 1,
      price: variant?.salePrice ?? variant?.price ?? effectivePrice,
      title: product.title,
      imageUrl: product.imageUrl,
      variantName: variant?.name || null,
      categorySlug: product.categorySlug,
      deliveryMethod: product.deliveryMethod,
    })
    openModal({ type: 'cart' })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      openModal({ type: 'auth', mode: 'login' })
      return
    }
    toggleWishlist(product.id)
    // sync to server
    fetch('/api/v1/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id }) }).catch(() => {})
  }

  return (
    <div
      onClick={() => openModal({ type: 'product', product })}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
        {product.isDeal && <Badge variant="yellow"><Zap size={10} /> DEAL</Badge>}
        {product.isBestSeller && <Badge variant="navy">BESTSELLER</Badge>}
        {product.isTrending && <Badge variant="info">🔥 TRENDING</Badge>}
      </div>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-sm"
        aria-label="Toggle wishlist"
      >
        <Heart size={16} className={cn(wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300')} />
      </button>

      {/* Image */}
      <div className={cn('relative overflow-hidden bg-muted', compact ? 'aspect-[4/3]' : 'aspect-[5/4]')}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay with quick view */}
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); openModal({ type: 'product', product }) }}
            className="px-3 py-1.5 rounded-full bg-white/95 text-navy text-xs font-semibold flex items-center gap-1 shadow-md"
          >
            <Eye size={12} /> Quick View
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">{product.categorySlug.replace('-', ' ')}</div>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors">
          {product.title}
        </h3>
        {!compact && product.shortDesc && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.shortDesc}</p>
        )}

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={product.rating} size={12} showNumber count={product.reviewsCount} />
        </div>

        {/* Price + Add */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">{fmtPrice(product.basePrice)}</span>
            )}
            <span className="text-lg font-bold text-navy dark:text-yellow">{fmtPrice(effectivePrice)}</span>
          </div>
          <button
            onClick={handleQuickAdd}
            className="h-9 w-9 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy/90 transition-all hover:scale-105 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
