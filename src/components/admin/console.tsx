'use client'

import { useState } from 'react'
import {
  LayoutDashboard, Package, Tag, Boxes, ShoppingCart, Users, Ticket,
  RefreshCw, LifeBuoy, FileText, BarChart3, ShieldAlert, Settings as SettingsIcon,
  Zap, ArrowLeft, Bell, Search, Menu, X, ChevronRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'support', label: 'Support', icon: LifeBuoy },
  { id: 'cms', label: 'CMS', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export function AdminConsole() {
  const { adminView, setAdminView, user, setView } = useStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background border-b border-border h-14 flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex w-8 h-8 rounded-lg hover:bg-muted items-center justify-center">
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-navy flex items-center justify-center">
            <Zap className="text-yellow" fill="currentColor" size={14} />
          </div>
          <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: 'var(--font-display), system-ui' }}>PlayBeat Admin</span>
        </div>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground ml-4">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium capitalize">{adminView}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-muted items-center justify-center relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>
          <button onClick={() => setView('storefront')} className="h-9 px-3 rounded-lg bg-muted hover:bg-muted/70 text-sm font-medium flex items-center gap-1.5">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Storefront</span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)}</div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold leading-tight">{user?.name}</div>
              <div className="text-[10px] text-muted-foreground">{user?.role}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-14 z-20 h-[calc(100vh-3.5rem)] bg-background border-r border-border transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <nav className="p-3 space-y-0.5 overflow-y-auto h-full">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => { setAdminView(n.id as any); setMobileOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative',
                  adminView === n.id ? 'bg-navy text-white dark:bg-yellow dark:text-navy' : 'hover:bg-muted text-foreground/80'
                )}
                title={n.label}
              >
                <n.icon size={16} className="shrink-0" />
                {!sidebarCollapsed && <span>{n.label}</span>}
                {sidebarCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-navy text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                    {n.label}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && <div className="fixed inset-0 top-14 bg-black/40 z-10 lg:hidden" onClick={() => setMobileOpen(false)} />}

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <AdminContent />
        </main>
      </div>
    </div>
  )
}

import { AdminContent } from './admin-content'
