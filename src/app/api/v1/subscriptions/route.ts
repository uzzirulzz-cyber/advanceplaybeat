import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const subs = await db.subscription.findMany({
    where: { customerId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ subscriptions: subs })
}
