import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'FINANCE'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const where: any = {}
  if (search) where.OR = [{ orderNumber: { contains: search } }, { customerEmail: { contains: search } }, { customerName: { contains: search } }]
  if (status && status !== 'all') where.status = status

  const orders = await db.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({ orders })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, action } = body
  const order = await db.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const before = JSON.stringify({ status: order.status, fulfillmentStatus: order.fulfillmentStatus, paymentStatus: order.paymentStatus })

  if (action === 'complete') {
    await db.order.update({ where: { id }, data: { status: 'COMPLETED', fulfillmentStatus: 'COMPLETED' } })
  } else if (action === 'cancel') {
    await db.order.update({ where: { id }, data: { status: 'CANCELLED', fulfillmentStatus: 'CANCELLED' } })
  } else if (action === 'refund') {
    await db.order.update({ where: { id }, data: { status: 'REFUNDED', paymentStatus: 'REFUNDED' } })
    await db.payment.create({ data: { orderId: id, provider: order.paymentMethod, amount: order.total, currency: 'USD', status: 'REFUNDED' } })
    // refund wallet if wallet was used
    const customer = await db.user.findUnique({ where: { id: order.customerId } })
    if (customer) {
      await db.user.update({ where: { id: customer.id }, data: { walletBalance: { increment: order.total } } })
    }
  } else if (action === 'process') {
    await db.order.update({ where: { id }, data: { status: 'PROCESSING', fulfillmentStatus: 'PROCESSING' } })
  }

  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: `ORDER_${action.toUpperCase()}`, targetType: 'Order', targetId: id, before, after: action } })
  return NextResponse.json({ ok: true })
}
