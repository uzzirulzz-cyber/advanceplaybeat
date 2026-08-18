import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

function maskKey(k: string | null) {
  if (!k) return null
  if (k.length < 8) return '****'
  return k.slice(0, 4) + '••••' + k.slice(-4)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (order.customerId !== user.id && user.role === 'CUSTOMER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Mask keys for customers; show full for staff
  const masked = {
    ...order,
    items: order.items.map((it) => ({
      ...it,
      deliveredKey: user.role === 'CUSTOMER' ? maskKey(it.deliveredKey) : it.deliveredKey,
    })),
  }
  return NextResponse.json({ order: masked })
}
