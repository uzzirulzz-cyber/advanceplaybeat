import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CONTENT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const cats = await db.category.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ categories: cats })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'CONTENT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const cat = await db.category.create({ data: { ...body, slug: body.slug || slugify(body.name) } })
  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'CATEGORY_CREATE', targetType: 'Category', targetId: cat.id, after: JSON.stringify(body) } })
  return NextResponse.json({ category: cat })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'CONTENT'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const cat = await db.category.update({ where: { id: body.id }, data: body })
  return NextResponse.json({ category: cat })
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
