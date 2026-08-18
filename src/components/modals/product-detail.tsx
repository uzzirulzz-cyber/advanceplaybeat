'use client'

import { useState } from 'react'
import {
  X, ShoppingCart, Heart, Share2, Zap, Shield, Clock, Check, ChevronRight,
  Star, Truck, RefreshCw, Key, Download, User, Eye,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStore } from '@/lib/store'
import { fmtPrice, discountPct, cn, timeLeft } from '@/lib/utils'
import { RatingStars, Badge } from '@/components/storefront/common'
import { toast } from 'sonner'

export function ProductDetailModal() {
  const { modal, closeModal, addToCart, openModal, toggleWishlist, isWishlisted, user } = useStore()
  const isOpen = modal.type === 'product'
  const product = isOpen ? modal.product : null

  const [qty, setQty] = useState(1)
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'faq' | 'reviews'>('desc')

  if (!product) return null

  const variant = product.variants?.[selectedVariantIdx]
  const basePrice = variant?.price ?? product.basePrice
  const salePrice = variant?.salePrice ?? product.salePrice ?? basePrice
  const effectivePrice = salePrice
  const discount = discountPct(basePrice, salePrice)

  const handleAddToCart = () => {
    if (!user) { openModal({ type: 'auth', mode: 'login' }); return }
    addToCart({
      productId: product.id,
      variantId: variant?.id || null,
      qty,
      price: effectivePrice,
      title: product.title,
      imageUrl: product.imageUrl,
      variantName: variant?.name || null,
      categorySlug: product.categorySlug,
      deliveryMethod: product.deliveryMethod,
    })
    toast.success(`${product.title} added to cart`)
    closeModal()
    openModal({ type: 'cart' })
  }

  const handleBuyNow = () => {
    if (!user) { openModal({ type: 'auth', mode: 'login' }); return }
    addToCart({
      productId: product.id,
      variantId: variant?.id || null,
      qty,
      price: effectivePrice,
      title: product.title,
      imageUrl: product.imageUrl,
      variantName: variant?.name || null,
      categorySlug: product.categorySlug,
      deliveryMethod: product.deliveryMethod,
    })
    closeModal()
    openModal({ type: 'checkout' })
  }

  const handleWishlist = () => {
    if (!user) { openModal({ type: 'auth', mode: 'login' }); return }
    toggleWishlist(product.id)
    fetch('/api/v1/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id }) }).catch(() => {})
    toast.success(isWishlisted(product.id) ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.title, url: window.location.href }) } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] overflow-hidden p-0 gap-0">
        <div className="grid lg:grid-cols-2 max-h-[92vh] overflow-y-auto">
          {/* Left: Gallery */}
          <div className="bg-muted p-6 lg:p-8">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            {/* Thumbnails */}
            {product.galleryUrls && product.galleryUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[product.imageUrl, ...product.galleryUrls].slice(0, 4).map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80"><Shield size={14} className="text-emerald-500" /> Verified authentic product</div>
              <div className="flex items-center gap-2 text-sm text-foreground/80"><Zap size={14} className="text-yellow" /> Instant digital delivery</div>
              <div className="flex items-center gap-2 text-sm text-foreground/80"><RefreshCw size={14} className="text-blue-500" /> 14-day refund guarantee</div>
              <div className="flex items-center gap-2 text-sm text-foreground/80"><Key size={14} className="text-purple-500" /> License type: {product.licenseType?.replace(/_/g, ' ') || 'Standard'}</div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-6 lg:p-8 space-y-5">
            <DialogHeader className="space-y-2 p-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info">{product.categorySlug.replace('-', ' ')}</Badge>
                {product.isBestSeller && <Badge variant="navy"><Star size={10} /> BESTSELLER</Badge>}
                {product.isDeal && <Badge variant="yellow"><Zap size={10} /> DEAL</Badge>}
              </div>
              <DialogTitle className="text-2xl lg:text-3xl font-extrabold leading-tight" style={{ fontFamily: 'var(--font-display), system-ui' }}>
                {product.title}
              </DialogTitle>
              {product.shortDesc && <p className="text-sm text-muted-foreground">{product.shortDesc}</p>}
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <RatingStars rating={product.rating} size={16} showNumber count={product.reviewsCount} />
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{product.salesCount.toLocaleString()} sold</span>
            </div>

            {/* Price */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-navy dark:text-yellow">{fmtPrice(effectivePrice)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-muted-foreground line-through">{fmtPrice(basePrice)}</span>
                    <Badge variant="danger">-{discount}%</Badge>
                  </>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {product.currency} • Tax included • Free digital delivery worldwide
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Choose Duration / Variant:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v, i) => {
                    const vPrice = v.salePrice ?? v.price
                    const vDiscount = discountPct(v.price, vPrice)
                    return (
                      <button
                        key={v.id || i}
                        onClick={() => setSelectedVariantIdx(i)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-left transition-all',
                          selectedVariantIdx === i
                            ? 'border-navy dark:border-yellow bg-navy/5 dark:bg-yellow/10'
                            : 'border-border hover:border-navy/50'
                        )}
                      >
                        <div className="font-semibold text-sm">{v.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-bold text-navy dark:text-yellow text-sm">{fmtPrice(vPrice)}</span>
                          {vDiscount > 0 && <span className="text-[10px] text-muted-foreground line-through">{fmtPrice(v.price)}</span>}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-border overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 hover:bg-muted text-lg">−</button>
                <span className="w-10 h-11 flex items-center justify-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-11 hover:bg-muted text-lg">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 h-11 rounded-xl bg-navy text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 h-11 rounded-xl bg-yellow text-navy font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Zap size={16} fill="currentColor" /> Buy Now
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex items-center gap-2">
              <button onClick={handleWishlist} className="flex-1 h-10 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm">
                <Heart size={14} className={cn(isWishlisted(product.id) && 'fill-rose-500 text-rose-500')} />
                {isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button onClick={handleShare} className="flex-1 h-10 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm">
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Key Features</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tabs */}
            <div>
              <div className="flex items-center gap-1 border-b border-border">
                {([
                  { k: 'desc', label: 'Description' },
                  { k: 'specs', label: 'Specifications' },
                  { k: 'faq', label: 'FAQ' },
                  { k: 'reviews', label: 'Reviews' },
                ] as const).map((t) => (
                  <button
                    key={t.k}
                    onClick={() => setActiveTab(t.k)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                      activeTab === t.k ? 'border-navy dark:border-yellow text-navy dark:text-yellow' : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="py-4 text-sm text-foreground/80">
                {activeTab === 'desc' && <p className="leading-relaxed">{product.description}</p>}
                {activeTab === 'specs' && (
                  <div className="space-y-1">
                    {product.specifications && product.specifications.length > 0 ? (
                      product.specifications.map((s, i) => (
                        <div key={i} className="flex border-b border-border/50 py-1.5">
                          <div className="w-1/3 text-muted-foreground font-medium">{s.label}</div>
                          <div className="flex-1">{s.value}</div>
                        </div>
                      ))
                    ) : <p className="text-muted-foreground">No specifications available.</p>}
                  </div>
                )}
                {activeTab === 'faq' && (
                  <div className="space-y-3">
                    {product.faqs && product.faqs.length > 0 ? (
                      product.faqs.map((f, i) => (
                        <div key={i}>
                          <div className="font-semibold">{f.q}</div>
                          <div className="text-muted-foreground mt-1">{f.a}</div>
                        </div>
                      ))
                    ) : <p className="text-muted-foreground">No FAQs yet.</p>}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50">
                      <div className="text-4xl font-extrabold text-navy dark:text-yellow">{product.rating.toFixed(1)}</div>
                      <div>
                        <RatingStars rating={product.rating} size={16} />
                        <div className="text-xs text-muted-foreground mt-1">{product.reviewsCount} reviews</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">Reviews will be displayed here. Customers can rate and review products after purchase.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery info */}
            <div className="p-4 rounded-xl bg-navy/5 dark:bg-yellow/5 border border-navy/10 dark:border-yellow/20">
              <div className="flex items-center gap-2 mb-2 font-semibold text-navy dark:text-yellow text-sm">
                <Truck size={16} /> Delivery Information
              </div>
              <p className="text-xs text-foreground/80">
                {product.deliveryMethod === 'INSTANT'
                  ? '🚀 Instant automatic delivery — license key/code/credentials sent to your account dashboard and email within seconds after successful payment.'
                  : product.deliveryMethod === 'SCHEDULED'
                  ? '⏱️ Scheduled delivery — your order will be processed and delivered within the timeframe specified. You will receive email notifications on each status update.'
                  : '📦 Manual delivery — our team will process your order and deliver within 24 hours.'}
              </p>
            </div>

            {product.isDeal && product.dealEndsAt && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  <Clock size={14} /> Deal ends in:
                </div>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const t = timeLeft(product.dealEndsAt)
                    return [
                      { v: t.days, l: 'D' }, { v: t.hours, l: 'H' },
                      { v: t.minutes, l: 'M' }, { v: t.seconds, l: 'S' },
                    ].map((u, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                          {String(u.v).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] uppercase text-rose-700 dark:text-rose-300 mt-1">{u.l}</div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
