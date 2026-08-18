import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'FINANCE'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [totalRevenue, totalOrders, totalCustomers, totalProducts, activeSubs, pendingPayments, refunds, openTickets] = await Promise.all([
    db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
    db.order.count(),
    db.user.count({ where: { role: 'CUSTOMER' } }),
    db.product.count(),
    db.subscription.count({ where: { status: 'ACTIVE' } }),
    db.payment.count({ where: { status: 'PENDING' } }),
    db.payment.count({ where: { status: 'REFUNDED' } }),
    db.supportTicket.count({ where: { status: { in: ['OPEN', 'PENDING', 'IN_PROGRESS'] } } }),
  ])

  // Revenue last 30 days (daily)
  const recentOrders = await db.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: 'PAID' },
    select: { total: true, createdAt: true, paymentMethod: true },
  })

  const days: Record<string, { revenue: number; orders: number }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    days[key] = { revenue: 0, orders: 0 }
  }
  recentOrders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10)
    if (days[key]) {
      days[key].revenue += o.total
      days[key].orders += 1
    }
  })

  const revenueSeries = Object.entries(days).map(([date, v]) => ({ date, ...v }))

  // Payment method breakdown
  const payByMethod: Record<string, number> = {}
  recentOrders.forEach((o) => {
    payByMethod[o.paymentMethod] = (payByMethod[o.paymentMethod] || 0) + o.total
  })

  // Top products by sales count
  const topProducts = await db.product.findMany({
    orderBy: { salesCount: 'desc' },
    take: 5,
    select: { id: true, title: true, salesCount: true, basePrice: true, salePrice: true, imageUrl: true },
  })

  // Top categories (count by categorySlug of products sold)
  const allProducts = await db.product.findMany({ select: { categorySlug: true, salesCount: true } })
  const catSales: Record<string, number> = {}
  allProducts.forEach((p) => { catSales[p.categorySlug] = (catSales[p.categorySlug] || 0) + p.salesCount })
  const topCategories = Object.entries(catSales).map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count).slice(0, 6)

  // Recent orders
  const recentOrderList = await db.order.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    select: { id: true, orderNumber: true, customerEmail: true, customerName: true, total: true, paymentStatus: true, status: true, createdAt: true },
  })

  // AOV
  const aov = totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0

  return NextResponse.json({
    kpis: {
      revenue: totalRevenue._sum.total || 0,
      orders: totalOrders,
      customers: totalCustomers,
      products: totalProducts,
      activeSubscriptions: activeSubs,
      pendingPayments,
      refunds,
      openTickets,
      aov,
    },
    revenueSeries,
    payByMethod,
    topProducts,
    topCategories,
    recentOrders: recentOrderList,
  })
}
