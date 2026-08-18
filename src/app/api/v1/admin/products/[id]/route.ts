import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

function requireAdmin(user: any) {
  return user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const p = await db.product.findUnique({ where: { id }, include: { variants: true, inventory: true, category: true, reviews: true } })
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const safe = {
    ...p,
    galleryUrls: tryJson(p.galleryUrls, []),
    features: tryJson(p.features, []),
    specifications: tryJson(p.specifications, []),
    faqs: tryJson(p.faqs, []),
    tags: tryJson(p.tags, []),
  }
  return NextResponse.json({ product: safe })
}

function tryJson(s: any, fallback: any) {
  if (!s) return fallback
  if (Array.isArray(s) || typeof s === 'object') return s
  try { return JSON.parse(s) } catch { return fallback }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const before = await db.product.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { variants, inventoryKeys, ...rest } = body
  const update: any = { ...rest }
  if (rest.galleryUrls) update.galleryUrls = JSON.stringify(rest.galleryUrls)
  if (rest.features) update.features = JSON.stringify(rest.features)
  if (rest.specifications) update.specifications = JSON.stringify(rest.specifications)
  if (rest.faqs) update.faqs = JSON.stringify(rest.faqs)
  if (rest.tags) update.tags = JSON.stringify(rest.tags)

  const product = await db.product.update({ where: { id }, data: update, include: { variants: true } })

  if (variants) {
    // Sync variants
    await db.productVariant.deleteMany({ where: { productId: id } })
    for (const v of variants) {
      if (v.id && v.id.startsWith('new_') || !v.id) {
        await db.productVariant.create({ data: { ...v, productId: id, id: undefined } })
      } else {
        await db.productVariant.update({ where: { id: v.id }, data: v })
      }
    }
  }

  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'PRODUCT_UPDATE', targetType: 'Product', targetId: id, before: JSON.stringify(before), after: JSON.stringify(update) } })

  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const before = await db.product.findUnique({ where: { id } })
  await db.product.delete({ where: { id } })
  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'PRODUCT_DELETE', targetType: 'Product', targetId: id, before: JSON.stringify(before) } })

  return NextResponse.json({ ok: true })
}
