import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tickets = await db.supportTicket.findMany({ where: { customerId: user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ tickets })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { subject, category, priority, message } = await req.json()
  const ticketNo = 'TK-' + Date.now().toString(36).toUpperCase()
  const ticket = await db.supportTicket.create({
    data: {
      ticketNo, customerId: user.id, subject, category: category || 'GENERAL',
      priority: priority || 'NORMAL', status: 'OPEN',
      messages: JSON.stringify([{ from: user.email, message, at: new Date().toISOString(), isStaff: false }]),
    },
  })
  await db.notification.create({
    data: { userId: user.id, type: 'SUPPORT', title: 'Ticket created', message: `Your ticket ${ticketNo} has been received. We'll reply within 24h.`, link: 'support' },
  })
  return NextResponse.json({ ticket })
}
