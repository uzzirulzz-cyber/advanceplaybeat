import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

function safeJson(s: any, fallback: any) {
  if (!s) return fallback
  if (Array.isArray(s) || typeof s === 'object') return s
  try { return JSON.parse(s) } catch { return fallback }
}
function parseProduct(p: any) {
  if (!p) return null
  return {
    ...p,
    galleryUrls: safeJson(p.galleryUrls, []),
    features: safeJson(p.features, []),
    specifications: safeJson(p.specifications, []),
    faqs: safeJson(p.faqs, []),
    tags: safeJson(p.tags, []),
  }
}

function requireAdmin(user: any) {
  return user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)
}

export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const where: any = {}
  if (search) where.OR = [{ title: { contains: search } }, { sku: { contains: search } }]
  if (category && category !== 'all') where.categorySlug = category
  if (status && status !== 'all') where.status = status

  const products = await db.product.findMany({
    where,
    include: { variants: true, category: true, _count: { select: { inventory: true, reviews: true, orderItems: true } } },
    orderBy: { createdAt: 'desc' },
  })

  // Compute available inventory per product
  const enriched = await Promise.all(products.map(async (p) => {
    const available = await db.inventoryKey.count({ where: { productId: p.id, status: 'AVAILABLE' } })
    return { ...parseProduct(p), availableInventory: available }
  }))

  return NextResponse.json({ products: enriched })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { variants, inventoryKeys, ...data } = body

  // JSON-stringify fields
  const create: any = {
    ...data,
    galleryUrls: JSON.stringify(data.galleryUrls || []),
    features: JSON.stringify(data.features || []),
    specifications: JSON.stringify(data.specifications || []),
    faqs: JSON.stringify(data.faqs || []),
    tags: JSON.stringify(data.tags || []),
    slug: data.slug || slugify(data.title),
  }

  const product = await db.product.create({ data: create })

  if (variants && variants.length > 0) {
    for (const v of variants) {
      await db.productVariant.create({ data: { ...v, productId: product.id } })
    }
  }
  if (inventoryKeys && inventoryKeys.length > 0) {
    for (const k of inventoryKeys) {
      await db.inventoryKey.create({ data: { ...k, productId: product.id } })
    }
  }

  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'PRODUCT_CREATE', targetType: 'Product', targetId: product.id, after: JSON.stringify(create) } })

  return NextResponse.json({ product: parseProduct(await db.product.findUnique({ where: { id: product.id }, include: { variants: true } })) })
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).slice(2, 6)
}
