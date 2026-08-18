import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Inventory overview grouped by product
  const products = await db.product.findMany({
    select: {
      id: true, title: true, sku: true, categorySlug: true, imageUrl: true,
      variants: { select: { id: true, name: true, stock: true, reserved: true, price: true, salePrice: true } },
      _count: { select: { inventory: true } },
    },
  })

  const enriched = await Promise.all(products.map(async (p) => {
    const available = await db.inventoryKey.count({ where: { productId: p.id, status: 'AVAILABLE' } })
    const used = await db.inventoryKey.count({ where: { productId: p.id, status: 'USED' } })
    const reserved = await db.inventoryKey.count({ where: { productId: p.id, status: 'RESERVED' } })
    return { ...p, availableKeys: available, usedKeys: used, reservedKeys: reserved }
  }))

  return NextResponse.json({ inventory: enriched })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { productId, keys, keyType } = body

  for (const k of keys) {
    await db.inventoryKey.create({ data: { productId, key: k, keyType: keyType || 'LICENSE' } })
    await db.inventoryAuditLog.create({ data: { productId, action: 'CREATE', field: 'key', newValue: k, adminEmail: user.email } })
  }

  await db.auditLog.create({ data: { actorEmail: user.email, actorId: user.id, action: 'INVENTORY_BULK_ADD', targetType: 'Product', targetId: productId, after: JSON.stringify({ count: keys.length }) } })
  return NextResponse.json({ ok: true, added: keys.length })
}
