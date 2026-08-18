import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signToken, setSessionCookie, hashPassword } from '@/lib/auth'

function publicUser(u: any) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, avatarUrl: u.avatarUrl, walletBalance: u.walletBalance, currency: u.currency, timezone: u.timezone, status: u.status, createdAt: u.createdAt }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const hash = await hashPassword(password)
    const user = await db.user.create({
      data: { email: email.toLowerCase(), name, passwordHash: hash, role: 'CUSTOMER', status: 'ACTIVE', walletBalance: 0 },
    })

    const token = signToken(user.id, user.role)
    await setSessionCookie(token)

    return NextResponse.json({ user: publicUser(user), token })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
