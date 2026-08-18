import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ coupons })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const coupon = await db.coupon.create({ data: { ...body, code: body.code.toUpperCase() } })
  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'COUPON_CREATE', targetType: 'Coupon', targetId: coupon.id, after: JSON.stringify(body) } })
  return NextResponse.json({ coupon })
}
