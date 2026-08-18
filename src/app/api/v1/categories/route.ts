import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const cats = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    where: { isVisible: undefined } as any,
  })
  // All categories — no parent filter for now
  const allCats = await db.category.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ categories: allCats })
}
