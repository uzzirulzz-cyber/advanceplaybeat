import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const where: any = { role: 'CUSTOMER' }
  if (search) where.OR = [{ email: { contains: search } }, { name: { contains: search } }]

  const customers = await db.user.findMany({
    where,
    select: { id: true, email: true, name: true, status: true, walletBalance: true, createdAt: true, lastLoginAt: true, avatarUrl: true, _count: { select: { orders: true, supportTickets: true, subscriptions: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  // Compute spending per customer
  const enriched = await Promise.all(customers.map(async (c) => {
    const orders = await db.order.aggregate({ where: { customerId: c.id, paymentStatus: 'PAID' }, _sum: { total: true } })
    return { ...c, totalSpent: orders._sum.total || 0 }
  }))

  return NextResponse.json({ customers: enriched })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'SUPPORT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, action } = body
  const c = await db.user.findUnique({ where: { id } })
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const before = JSON.stringify({ status: c.status, walletBalance: c.walletBalance })

  if (action === 'activate') await db.user.update({ where: { id }, data: { status: 'ACTIVE' } })
  else if (action === 'suspend') await db.user.update({ where: { id }, data: { status: 'SUSPENDED' } })
  else if (action === 'add_credit') await db.user.update({ where: { id }, data: { walletBalance: { increment: body.amount || 0 } } })
  else if (action === 'remove_credit') await db.user.update({ where: { id }, data: { walletBalance: { decrement: body.amount || 0 } } })

  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: `CUSTOMER_${action.toUpperCase()}`, targetType: 'User', targetId: id, before, after: JSON.stringify(body) } })
  return NextResponse.json({ ok: true })
}
