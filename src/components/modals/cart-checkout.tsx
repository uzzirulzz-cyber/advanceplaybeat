'use client'

import { useState, useEffect } from 'react'
import {
  X, ShoppingCart, Trash2, Plus, Minus, Tag, Shield, Zap, ArrowRight,
  Check, Wallet, CreditCard, Building, Lock, Loader2, Star,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStore } from '@/lib/store'
import { fmtPrice, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Badge } from '@/components/storefront/common'

export function CartDrawer() {
  const { modal, closeModal, cart, updateCartQty, removeFromCart, openModal, user, appliedCoupon, setAppliedCoupon , currency } = useStore()
  const isOpen = modal.type === 'cart'

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const discount = appliedCoupon?.discount || 0
  const total = Math.max(0, subtotal - discount)
  const itemCount = cart.reduce((s, c) => s + c.qty, 0)

  if (!isOpen) return null

  const handleCheckout = () => {
    if (!user) { openModal({ type: 'auth', mode: 'login' }); return }
    if (cart.length === 0) return
    closeModal()
    openModal({ type: 'checkout' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-md w-[95vw] max-h-[92vh] p-0 gap-0">
        <DialogHeader className="p-5 border-b border-border flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart size={18} /> Your Cart ({itemCount})
          </DialogTitle>
          <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
              <ShoppingCart size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Browse our marketplace and add products to get started.</p>
            <button onClick={closeModal} className="h-10 px-5 rounded-lg bg-navy text-white text-sm font-medium">Browse Products</button>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 p-5 space-y-3" style={{ maxHeight: '60vh' }}>
              {cart.map((item, i) => (
                <div key={`${item.productId}-${item.variantId || ''}-${i}`} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm line-clamp-2">{item.title}</div>
                    {item.variantName && <div className="text-xs text-muted-foreground mt-0.5">{item.variantName}</div>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-border overflow-hidden">
                        <button onClick={() => updateCartQty(item.productId, item.variantId, item.qty - 1)} className="w-7 h-7 hover:bg-muted flex items-center justify-center"><Minus size={12} /></button>
                        <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateCartQty(item.productId, item.variantId, item.qty + 1)} className="w-7 h-7 hover:bg-muted flex items-center justify-center"><Plus size={12} /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy dark:text-yellow">{fmtPrice(item.price * item.qty, currency)}</span>
                        <button onClick={() => removeFromCart(item.productId, item.variantId)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 w-7 h-7 rounded-md flex items-center justify-center"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <CouponInput />
            </div>

            <div className="border-t border-border p-5 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{fmtPrice(subtotal, currency)}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount ({appliedCoupon?.code})</span><span>−{fmtPrice(discount, currency)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{fmtPrice(0, currency)}</span></div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span className="text-navy dark:text-yellow">{fmtPrice(total, currency)}</span></div>
              </div>

              <button onClick={handleCheckout} className="w-full h-12 rounded-xl bg-navy text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Lock size={16} /> Secure Checkout <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Shield size={11} /> SSL Secured</span>
                <span className="flex items-center gap-1"><Zap size={11} /> Instant Delivery</span>
                <span className="flex items-center gap-1"><Check size={11} /> Verified Products</span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function CouponInput() {
  const { cart, appliedCoupon, setAppliedCoupon } = useStore()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)

  const apply = async () => {
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/v1/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), subtotal, items: cart }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Invalid coupon')
        setAppliedCoupon(null)
        return
      }
      setAppliedCoupon(data)
      toast.success(`Coupon applied: ${data.coupon.code} — you saved ${fmtPrice(data.discount, currency)}`)
      setCode('')
    } catch {
      toast.error('Failed to validate coupon')
    } finally {
      setLoading(false)
    }
  }

  if (appliedCoupon) {
    return (
      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Tag size={14} className="text-emerald-600" />
          <span className="font-medium text-emerald-700 dark:text-emerald-300">{appliedCoupon.code}</span>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs">−{fmtPrice(appliedCoupon.discount, currency)}</span>
        </div>
        <button onClick={() => { setAppliedCoupon(null); toast.success('Coupon removed') }} className="text-emerald-700 dark:text-emerald-300 text-xs hover:underline">Remove</button>
      </div>
    )
  }

  return (
    <div className="p-3 rounded-xl bg-muted/50 border border-border">
      <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
        <Tag size={12} /> Have a coupon code?
      </div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. WELCOME10"
          className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm uppercase focus:outline-none focus:ring-2 focus:ring-yellow"
        />
        <button onClick={apply} disabled={loading || !code} className="h-9 px-3 rounded-lg bg-navy text-white text-xs font-medium disabled:opacity-50">
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
        </button>
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">Try: WELCOME10, SAVE25, PLAYBEAT50, GAMING20</div>
    </div>
  )
}

// ---------------- Checkout Modal ----------------
export function CheckoutModal() {
  const { modal, closeModal, cart, user, appliedCoupon, clearCart, currency } = useStore()
  const isOpen = modal.type === 'checkout'
  const [paymentMethod, setPaymentMethod] = useState('STRIPE')
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', notes: '' })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [useWallet, setUseWallet] = useState(false)
  const [loading, setLoading] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<any>(null)

  useEffect(() => {
    if (user && isOpen) {
      setCustomerInfo((c) => ({ ...c, name: user.name, email: user.email }))
    }
  }, [user, isOpen])

  if (!isOpen) return null

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const discount = appliedCoupon?.discount || 0
  const walletUsed = useWallet && user ? Math.min(user.walletBalance, subtotal - discount) : 0
  const remaining = Math.max(0, subtotal - discount - walletUsed)
  const total = remaining

  const placeOrder = async () => {
    if (!user) return
    if (!acceptTerms) { toast.error('Please accept the terms'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          couponCode: appliedCoupon?.code,
          paymentMethod,
          customerInfo,
          acceptTerms,
          useWallet,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to place order'); return }
      setPlacedOrder(data.order)
      clearCart()
      toast.success('Order placed successfully! Digital products delivered.')
    } catch (e) {
      toast.error('Order failed — please try again')
    } finally {
      setLoading(false)
    }
  }

  if (placedOrder) {
    return (
      <Dialog open={isOpen} onOpenChange={(o) => { if (!o) { closeModal(); setPlacedOrder(null) } }}>
        <DialogContent className="max-w-md w-[95vw] p-0 gap-0">
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mx-auto mb-4 flex items-center justify-center">
              <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-display), system-ui' }}>Order Confirmed!</h2>
            <p className="text-sm text-muted-foreground mb-4">Order <span className="font-bold text-foreground">{placedOrder.orderNumber}</span></p>
            <div className="rounded-xl bg-muted/50 p-4 mb-4 text-left">
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Amount Paid</span><span className="font-bold">{fmtPrice(placedOrder.total, currency)}</span></div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Payment Status</span><Badge variant="success">{placedOrder.paymentStatus}</Badge></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-emerald-600">{placedOrder.fulfillmentStatus}</span></div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Your digital products have been delivered to your account dashboard. You can view license keys and credentials in <b>My Account → Orders</b>.
            </p>
            <button onClick={() => { closeModal(); setPlacedOrder(null); useStore.getState().openModal({ type: 'account', tab: 'orders' }) }} className="w-full h-11 rounded-xl bg-navy text-white font-semibold">
              View My Orders
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const paymentMethods = [
    { id: 'STRIPE', name: 'Stripe', desc: 'Visa, Mastercard, Amex', icon: CreditCard },
    { id: 'JAZZCASH', name: 'JazzCash', desc: 'Mobile wallet', icon: Wallet },
    { id: 'EASYPAYSA', name: 'Easypaisa', desc: 'Mobile wallet', icon: Wallet },
    { id: 'BANK', name: 'Bank Transfer', desc: 'Manual verification', icon: Building },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-5 border-b border-border sticky top-0 bg-background z-10">
          <DialogTitle className="flex items-center gap-2"><Lock size={18} /> Secure Checkout</DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-5">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your cart is empty.</p>
          ) : (
            <>
              {/* Order summary */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Order Summary</h3>
                <div className="space-y-2">
                  {cart.map((item, i) => (
                    <div key={`${item.productId}-${i}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-1">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.variantName} × {item.qty}</div>
                      </div>
                      <div className="font-bold text-sm">{fmtPrice(item.price * item.qty, currency)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} placeholder="Full name" className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
                  <input value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} placeholder="Email" className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
                </div>
                <textarea value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} placeholder="Order notes (optional)" className="mt-2 w-full h-16 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-yellow" />
              </div>

              {/* Wallet */}
              {user && user.walletBalance > 0 && (
                <label className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-emerald-500" />
                    <div>
                      <div className="text-sm font-medium">Use wallet balance</div>
                      <div className="text-xs text-muted-foreground">Available: {fmtPrice(user.walletBalance, currency)}</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} className="w-4 h-4" />
                </label>
              )}

              {/* Payment method */}
              <div>
                <h3 className="font-semibold mb-2 text-sm">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn(
                        'p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2',
                        paymentMethod === m.id ? 'border-navy dark:border-yellow bg-navy/5 dark:bg-yellow/10' : 'border-border hover:border-navy/50'
                      )}
                    >
                      <m.icon size={18} className="text-navy dark:text-yellow" />
                      <div>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-xl bg-muted/50 p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmtPrice(subtotal, currency)}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Coupon ({appliedCoupon?.code})</span><span>−{fmtPrice(discount, currency)}</span></div>}
                {walletUsed > 0 && <div className="flex justify-between text-emerald-600"><span>Wallet</span><span>−{fmtPrice(walletUsed, currency)}</span></div>}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span className="text-navy dark:text-yellow">{fmtPrice(total, currency)}</span></div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-0.5 w-4 h-4" />
                <span>I agree to PlayBeat Digital's Terms of Service, Privacy Policy and Refund Policy. I understand that digital products are non-refundable once delivered.</span>
              </label>

              <button
                onClick={placeOrder}
                disabled={loading || !acceptTerms}
                className="w-full h-12 rounded-xl bg-navy text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><Lock size={16} /> Place Order — {fmtPrice(total, currency)}</>}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Shield size={11} /> 256-bit SSL</span>
                <span className="flex items-center gap-1"><Zap size={11} /> Instant Delivery</span>
                <span className="flex items-center gap-1"><Star size={11} /> 24/7 Support</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
