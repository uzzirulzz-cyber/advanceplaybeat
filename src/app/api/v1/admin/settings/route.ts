import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await db.setting.findMany()
  return NextResponse.json({ settings })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { settings } = body
  for (const s of settings) {
    await db.setting.upsert({ where: { key: s.key }, create: { key: s.key, value: s.value, group: s.group || 'GENERAL' }, update: { value: s.value } })
  }
  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'SETTINGS_UPDATE', targetType: 'Setting', after: JSON.stringify(settings) } })
  return NextResponse.json({ ok: true })
}
