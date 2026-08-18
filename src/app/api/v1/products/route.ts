import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Parse JSON fields stored as strings (SQLite has no native JSON type)
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
function safeJson(s: any, fallback: any) {
  if (!s) return fallback
  if (Array.isArray(s) || typeof s === 'object') return s
  try { return JSON.parse(s) } catch { return fallback }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const type = searchParams.get('type')
  const search = searchParams.get('search')
  const slug = searchParams.get('slug')
  const trending = searchParams.get('trending')
  const bestSeller = searchParams.get('bestSeller')
  const deals = searchParams.get('deals')
  const recent = searchParams.get('recent')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: any = { status: 'PUBLISHED', isVisible: true }
  if (category && category !== 'all') where.categorySlug = category
  if (type && type !== 'ALL') where.type = type
  if (trending === 'true') where.isTrending = true
  if (bestSeller === 'true') where.isBestSeller = true
  if (deals === 'true') where.isDeal = true
  if (featured === 'true') where.isFeatured = true
  if (slug) where.slug = slug
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { shortDesc: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } },
    ]
  }

  const products = await db.product.findMany({
    where,
    include: { variants: true, category: true },
    orderBy: recent === 'true' ? { createdAt: 'desc' } : (bestSeller === 'true' ? { salesCount: 'desc' } : { createdAt: 'desc' }),
    take: limit,
  })

  return NextResponse.json({ products: products.map(parseProduct) })
}
