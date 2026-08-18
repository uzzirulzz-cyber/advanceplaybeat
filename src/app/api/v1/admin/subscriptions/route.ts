import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'FINANCE'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subs = await db.subscription.findMany({
    include: { product: true, customer: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({ subscriptions: subs })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'FINANCE'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, action } = await req.json()
  const sub = await db.subscription.findUnique({ where: { id } })
  if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'cancel') await db.subscription.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date(), autoRenew: false } })
  else if (action === 'extend') {
    const newEnd = new Date(sub.endDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    await db.subscription.update({ where: { id }, data: { endDate: newEnd, status: 'ACTIVE' } })
  }

  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: `SUBSCRIPTION_${action.toUpperCase()}`, targetType: 'Subscription', targetId: id } })
  return NextResponse.json({ ok: true })
}
