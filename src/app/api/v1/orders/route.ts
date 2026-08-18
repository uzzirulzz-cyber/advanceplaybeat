import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

function genOrderNo() {
  return 'PB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orders = await db.order.findMany({
    where: { customerId: user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  // mask delivered keys for non-staff
  const safe = orders.map((o) => ({
    ...o,
    items: o.items.map((it) => ({
      ...it,
      deliveredKey: it.deliveredKey ? maskKey(it.deliveredKey) : null,
    })),
  }))
  return NextResponse.json({ orders: safe })
}

function maskKey(k: string) {
  if (!k) return null
  if (k.length < 8) return '****'
  return k.slice(0, 4) + '••••' + k.slice(-4)
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Please login to checkout' }, { status: 401 })

    const body = await req.json()
    const { items, couponCode, paymentMethod, customerInfo, billingAddress, acceptTerms, useWallet } = body
    if (!items || !Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    if (!acceptTerms) return NextResponse.json({ error: 'Please accept the terms' }, { status: 400 })
    if (!paymentMethod) return NextResponse.json({ error: 'Select a payment method' }, { status: 400 })

    // Build order items with locked-in prices
    const orderItems: any[] = []
    let subtotal = 0
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId }, include: { variants: true } })
      if (!product) continue
      const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null
      const price = variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.basePrice
      const qty = Math.max(1, item.qty || 1)
      const lineTotal = price * qty
      subtotal += lineTotal
      orderItems.push({
        productId: product.id,
        variantId: variant?.id || null,
        title: product.title,
        variantName: variant?.name || null,
        price,
        qty,
        deliveryStatus: 'PENDING',
      })
    }

    if (subtotal === 0) return NextResponse.json({ error: 'No valid items in cart' }, { status: 400 })

    // Validate coupon
    let discount = 0
    let appliedCouponCode = null
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (coupon.minOrder === 0 || subtotal >= coupon.minOrder) {
          if (coupon.type === 'PERCENTAGE') discount = (subtotal * coupon.value) / 100
          else discount = coupon.value
          discount = Math.min(discount, subtotal)
          appliedCouponCode = coupon.code
        }
      }
    }

    const tax = 0 // configurable
    const shipping = 0 // digital — no shipping
    let total = subtotal - discount + tax + shipping
    if (total < 0) total = 0

    // Wallet payment
    let walletUsed = 0
    if (useWallet && user.walletBalance > 0) {
      walletUsed = Math.min(user.walletBalance, total)
      total -= walletUsed
    }

    if (paymentMethod === 'WALLET' && total > 0) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 })
    }

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: genOrderNo(),
        customerId: user.id,
        customerEmail: user.email,
        customerName: user.name,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        currency: 'USD',
        paymentMethod,
        paymentStatus: paymentMethod === 'WALLET' || walletUsed === subtotal + discount ? 'PAID' : 'PENDING',
        fulfillmentStatus: 'PENDING',
        status: paymentMethod === 'WALLET' || walletUsed === subtotal + discount ? 'PAID' : 'PENDING',
        couponCode: appliedCouponCode,
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        notes: customerInfo?.notes || null,
        items: { create: orderItems },
      },
      include: { items: true },
    })

    // Record wallet payment + deduction
    if (walletUsed > 0) {
      await db.payment.create({
        data: { orderId: order.id, provider: 'WALLET', amount: walletUsed, currency: 'USD', status: 'SUCCESS', transactionId: 'WLT-' + Date.now() },
      })
      await db.user.update({ where: { id: user.id }, data: { walletBalance: { decrement: walletUsed } } })
    }

    if (paymentMethod !== 'WALLET' && total > 0) {
      await db.payment.create({
        data: { orderId: order.id, provider: paymentMethod, amount: total, currency: 'USD', status: 'PENDING' },
      })
      // For demo: mark as paid (in production, redirect to provider)
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'PAID',
          transactionId: 'PB-' + Date.now().toString(36).toUpperCase(),
        },
      })
    }

    // Fulfill digital delivery (instant items only)
    await fulfillDigitalDelivery(order.id)

    // Coupon usage increment
    if (appliedCouponCode) {
      await db.coupon.update({ where: { code: appliedCouponCode }, data: { usedCount: { increment: 1 } } })
    }

    return NextResponse.json({ order: await db.order.findUnique({ where: { id: order.id }, include: { items: true } }) })
  } catch (e: any) {
    console.error('Order creation error:', e)
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}

async function fulfillDigitalDelivery(orderId: string) {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true, customer: true } })
  if (!order) return
  if (order.paymentStatus !== 'PAID') return

  for (const item of order.items) {
    // Reserve an inventory key (FIFO) — try variant-specific first, then fall back to product-level
    let key = await db.inventoryKey.findFirst({
      where: { productId: item.productId, variantId: item.variantId || null, status: 'AVAILABLE' },
      orderBy: { createdAt: 'asc' },
    })
    if (!key && item.variantId) {
      key = await db.inventoryKey.findFirst({
        where: { productId: item.productId, variantId: null, status: 'AVAILABLE' },
        orderBy: { createdAt: 'asc' },
      })
    }

    if (key) {
      await db.inventoryKey.update({ where: { id: key.id }, data: { status: 'USED', usedAt: new Date(), orderId: order.orderNumber } })
      await db.orderItem.update({ where: { id: item.id }, data: { deliveredKey: key.key, deliveryStatus: 'DELIVERED' } })

      // decrement variant stock
      if (item.variantId) {
        await db.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: 1 }, reserved: { decrement: 1 } } })
      }

      // Create subscription for subscription-type items
      const product = await db.product.findUnique({ where: { id: item.productId }, include: { variants: true } })
      const variant = product?.variants.find((v) => v.id === item.variantId)
      if (product?.type === 'SUBSCRIPTION' && variant) {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + (variant.durationDays || 30))
        await db.subscription.create({
          data: {
            customerId: order.customerId,
            productId: product.id,
            variantId: variant.id,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate,
            autoRenew: true,
          },
        })
      }
    } else {
      // No key — mark as MANUAL fulfillment needed
      await db.orderItem.update({ where: { id: item.id }, data: { deliveryStatus: 'PENDING_MANUAL' } })
    }
  }

  // Update order status
  await db.order.update({
    where: { id: orderId },
    data: { fulfillmentStatus: 'FULFILLED', status: 'COMPLETED' },
  })

  // Create notification
  await db.notification.create({
    data: {
      userId: order.customerId,
      type: 'ORDER',
      title: `Order ${order.orderNumber} delivered`,
      message: 'Your digital products are ready in your account dashboard.',
      link: 'orders',
    },
  })

  // Update sales count
  for (const item of order.items) {
    await db.product.update({ where: { id: item.productId }, data: { salesCount: { increment: item.qty } } })
  }
}
