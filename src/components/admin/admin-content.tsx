'use client'

import { useStore } from '@/lib/store'
import { DashboardView } from './views/dashboard'
import { ProductsView } from './views/products'
import { CategoriesView } from './views/categories'
import { InventoryView } from './views/inventory'
import { OrdersView } from './views/orders'
import { CustomersView } from './views/customers'
import { CouponsView, SubscriptionsView, SupportView, CMSView, AnalyticsView, AuditLogsView, SettingsView } from './views/misc'

export function AdminContent() {
  const { adminView } = useStore()

  switch (adminView) {
    case 'dashboard': return <DashboardView />
    case 'products': return <ProductsView />
    case 'categories': return <CategoriesView />
    case 'inventory': return <InventoryView />
    case 'orders': return <OrdersView />
    case 'customers': return <CustomersView />
    case 'coupons': return <CouponsView />
    case 'subscriptions': return <SubscriptionsView />
    case 'support': return <SupportView />
    case 'cms': return <CMSView />
    case 'analytics': return <AnalyticsView />
    case 'audit': return <AuditLogsView />
    case 'settings': return <SettingsView />
    default: return <DashboardView />
  }
}
