import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal, items } = await req.json()
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 })

    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (!coupon || !coupon.isActive) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ error: 'Coupon expired' }, { status: 400 })
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    if (coupon.minOrder > 0 && subtotal < coupon.minOrder) return NextResponse.json({ error: `Minimum order amount is $${coupon.minOrder}` }, { status: 400 })

    const cats: string[] = JSON.parse(coupon.categorySlugs || '[]')
    if (cats.length > 0 && items) {
      const hasMatch = items.some((it: any) => cats.includes(it.categorySlug))
      if (!hasMatch) return NextResponse.json({ error: `Coupon valid only for: ${cats.join(', ')}` }, { status: 400 })
    }

    let discount = 0
    if (coupon.type === 'PERCENTAGE') discount = (subtotal * coupon.value) / 100
    else discount = coupon.value

    return NextResponse.json({
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value, description: coupon.description },
      discount: Math.min(discount, subtotal),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
