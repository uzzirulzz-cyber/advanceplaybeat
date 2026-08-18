import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'FINANCE', 'SUPPORT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')

  const logs = await db.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ logs })
}
