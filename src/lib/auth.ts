// Server-side auth utilities
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'playbeat-dev-secret-change-in-prod'
const COOKIE_NAME = 'pb_session'

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10)
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash)
}

export function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { sub: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return { sub: decoded.sub, role: decoded.role }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null
  const user = await db.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, status: true, walletBalance: true, avatarUrl: true, currency: true, timezone: true },
  })
  if (!user || user.status !== 'ACTIVE') return null
  return user
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export const AUTH_COOKIE_NAME = COOKIE_NAME

// RBAC permission matrix
export const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['products:*', 'orders:*', 'customers:*', 'inventory:*', 'coupons:*', 'categories:*', 'cms:*', 'settings:read', 'analytics:read'],
  MANAGER: ['products:read', 'products:write', 'orders:read', 'orders:write', 'inventory:read', 'inventory:write', 'coupons:read'],
  SUPPORT: ['customers:read', 'customers:write', 'support:read', 'support:write', 'orders:read'],
  CONTENT: ['cms:*', 'categories:read', 'products:read'],
  FINANCE: ['payments:*', 'orders:read', 'analytics:read', 'settings:read'],
} as const

export function hasPermission(role: string, permission: string) {
  const perms = (PERMISSIONS as any)[role] || []
  if (perms.includes('*')) return true
  if (perms.includes(permission)) return true
  // wildcard match like "products:*"
  const [resource] = permission.split(':')
  if (perms.includes(`${resource}:*`)) return true
  return false
}
