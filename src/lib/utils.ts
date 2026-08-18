// PlayBeat Digital — UI utilities

// Currency conversion rates relative to PKR (base currency).
// Base currency for ALL product prices in the database is PKR.
// When currency === 'PKR', we display the raw value.
// For other currencies, we convert from PKR to the selected currency.
export const CURRENCY_RATES: Record<string, number> = {
  PKR: 1,        // base
  USD: 1 / 280,  // 1 PKR = 0.00357 USD
  GBP: 1 / 355,  // 1 PKR = 0.00282 GBP
  AED: 1 / 76,   // 1 PKR = 0.01316 AED
  EUR: 1 / 305,
  INR: 1 / 3.36,
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', PKR: 'Rs ', INR: '₹', AED: 'AED ',
}

export const SUPPORTED_CURRENCIES = ['PKR', 'USD', 'GBP', 'AED']

export function convertPrice(pkrAmount: number, targetCurrency: string): number {
  const rate = CURRENCY_RATES[targetCurrency] || 1
  return pkrAmount * rate
}

export function fmtPrice(pkrAmount: number, currency = 'PKR') {
  const symbols = CURRENCY_SYMBOLS
  const sym = symbols[currency] || ''
  const converted = convertPrice(pkrAmount || 0, currency)
  // For PKR show no decimals (large whole numbers); for others show 2 decimals
  if (currency === 'PKR') return `${sym}${Math.round(converted).toLocaleString('en-US')}`
  return `${sym}${converted.toFixed(2)}`
}

export function fmtDate(s: string | Date | null | undefined) {
  if (!s) return '—'
  const d = typeof s === 'string' ? new Date(s) : s
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function fmtDateTime(s: string | Date | null | undefined) {
  if (!s) return '—'
  const d = typeof s === 'string' ? new Date(s) : s
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function fmtNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n || 0)
}

export function fmtCompact(n: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0)
}

export function discountPct(base: number, sale: number) {
  if (!base || base <= 0 || !sale || sale >= base) return 0
  return Math.round(((base - sale) / base) * 100)
}

export function timeLeft(endDate: string | Date | null | undefined) {
  if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, expired: false }
}

export function statusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    PROCESSING: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    FULFILLED: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
    COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    CANCELLED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    REFUNDED: 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    EXPIRED: 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    CANCELLED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    TRIAL: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    RESOLVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    CLOSED: 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    PUBLISHED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    DRAFT: 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    ARCHIVED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
  }
  return map[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300'
}

export function cn(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(' ')
}

export function maskKey(k: string | null | undefined) {
  if (!k) return null
  if (k.length < 8) return '••••'
  return k.slice(0, 4) + '••••' + k.slice(-4)
}
