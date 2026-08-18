import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signToken, setSessionCookie, hashPassword } from '@/lib/auth'

// Safe user projection (no password hash)
function publicUser(u: any) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, avatarUrl: u.avatarUrl, walletBalance: u.walletBalance, currency: u.currency, timezone: u.timezone, status: u.status, createdAt: u.createdAt }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const { verifyPassword } = await import('@/lib/auth')
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    if (user.status !== 'ACTIVE') return NextResponse.json({ error: 'Account suspended or pending' }, { status: 403 })

    const token = signToken(user.id, user.role)
    await setSessionCookie(token)

    // record login activity
    await db.loginActivity.create({ data: { userId: user.id, ip: req.headers.get('x-forwarded-for') || 'unknown', userAgent: req.headers.get('user-agent') || '', success: true } })
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), lastLoginIp: req.headers.get('x-forwarded-for') || '' } })

    return NextResponse.json({ user: publicUser(user), token })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
