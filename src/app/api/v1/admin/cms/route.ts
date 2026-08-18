import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'CONTENT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sections = await db.cMSSection.findMany({ orderBy: { sortOrder: 'asc' } })
  const banners = await db.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ sections, banners })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'CONTENT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, isVisible, sortOrder, config, title, subtitle, desktopVisible, mobileVisible } = body
  const updated = await db.cMSSection.update({ where: { id }, data: { isVisible, sortOrder, config: config ? JSON.stringify(config) : undefined, title, subtitle, desktopVisible, mobileVisible } })
  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'CMS_UPDATE', targetType: 'CMSSection', targetId: id, after: JSON.stringify(body) } })
  return NextResponse.json({ section: updated })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'CONTENT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const created = await db.cMSSection.create({ data: { ...body, config: body.config ? JSON.stringify(body.config) : '{}' } })
  return NextResponse.json({ section: created })
}
