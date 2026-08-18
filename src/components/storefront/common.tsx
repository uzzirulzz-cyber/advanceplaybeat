'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RatingStars({ rating, size = 14, showNumber = false, count }: { rating: number; size?: number; showNumber?: boolean; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i <= Math.round(rating) ? 'fill-yellow text-yellow' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-medium text-foreground/70">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  )
}

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'navy' | 'yellow'; className?: string }) {
  const variants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    navy: 'bg-navy text-white',
    yellow: 'bg-yellow text-navy',
  }
  return <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}>{children}</span>
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="aspect-video skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        <div className="h-3 w-full skeleton-shimmer rounded" />
        <div className="flex justify-between">
          <div className="h-6 w-20 skeleton-shimmer rounded" />
          <div className="h-8 w-16 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          Try again
        </button>
      )}
    </div>
  )
}
