import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({
    where: { id },
    include: { variants: true, category: true, reviews: { take: 10, orderBy: { createdAt: 'desc' } } },
  })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json({ product: parseProduct(product) })
}
