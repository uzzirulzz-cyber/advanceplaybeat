import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'MANAGER'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tickets = await db.supportTicket.findMany({
    include: { customer: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({ tickets })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'SUPPORT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, action, message, status, priority } = body
  const ticket = await db.supportTicket.findUnique({ where: { id } })
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'reply') {
    const msgs = JSON.parse(ticket.messages || '[]')
    msgs.push({ from: user.email, message, at: new Date().toISOString(), isStaff: true })
    await db.supportTicket.update({ where: { id }, data: { messages: JSON.stringify(msgs), status: status || 'IN_PROGRESS' } })
  } else if (action === 'update_status') {
    await db.supportTicket.update({ where: { id }, data: { status, priority } })
  }

  return NextResponse.json({ ok: true })
}
