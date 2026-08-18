// PlayBeat Digital — shared types
export type Role = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'MANAGER' | 'SUPPORT' | 'CONTENT' | 'FINANCE'

export interface SafeUser {
  id: string
  email: string
  name: string
  role: Role
  avatarUrl?: string | null
  walletBalance: number
  currency: string
  timezone: string
  status: string
  createdAt: string
}

export interface ProductVariant {
  id?: string
  name: string
  durationDays: number
  price: number
  salePrice?: number | null
  sku?: string
  stock: number
  reserved?: number
  deliveryInfo?: string
}

export interface Product {
  id: string
  title: string
  slug: string
  shortDesc?: string
  description: string
  type?: string
  categorySlug: string
  basePrice: number
  salePrice?: number | null
  currency: string
  sku?: string
  imageUrl: string
  galleryUrls: string[]
  features: string[]
  specifications: { label: string; value: string }[]
  faqs: { q: string; a: string }[]
  tags: string[]
  rating: number
  reviewsCount: number
  salesCount: number
  isFeatured?: boolean
  isTrending?: boolean
  isBestSeller?: boolean
  isDeal?: boolean
  dealEndsAt?: string | null
  status: string
  deliveryMethod?: string
  licenseType?: string
  isVisible?: boolean
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
  availableInventory?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  bannerUrl?: string
  sortOrder: number
  isFeatured?: boolean
}

export interface CartItem {
  productId: string
  variantId?: string | null
  qty: number
  price: number
  title: string
  imageUrl: string
  variantName?: string | null
  categorySlug: string
  deliveryMethod?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerEmail: string
  customerName: string
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  currency: string
  paymentMethod: string
  paymentStatus: string
  fulfillmentStatus: string
  transactionId?: string | null
  couponCode?: string | null
  status: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string | null
  title: string
  variantName?: string | null
  price: number
  qty: number
  deliveredKey?: string | null
  deliveryStatus: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  type: string
  value: number
  minOrder: number
  categorySlugs?: string
  usageLimit: number
  usedCount: number
  expiresAt?: string | null
  isActive: boolean
  createdAt: string
}

export interface CMSSection {
  id: string
  sectionKey: string
  title: string
  subtitle?: string
  isVisible: boolean
  sortOrder: number
  config: string
  desktopVisible: boolean
  mobileVisible: boolean
}

export interface AuditLog {
  id: string
  actorEmail: string
  actorId?: string
  action: string
  targetType?: string
  targetId?: string
  before?: string
  after?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user?: SafeUser | null
}

export interface Subscription {
  id: string
  customerId: string
  productId: string
  variantId?: string
  status: string
  startDate: string
  endDate: string
  autoRenew: boolean
  product?: Product
  customer?: SafeUser
}

export interface SupportTicket {
  id: string
  ticketNo: string
  customerId: string
  subject: string
  category: string
  priority: string
  status: string
  assignedTo?: string
  messages: string
  createdAt: string
  updatedAt: string
  customer?: SafeUser
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

export interface Settings {
  [key: string]: string
}
