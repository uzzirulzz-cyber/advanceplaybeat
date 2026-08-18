# PlayBeat Digital — Premium Digital Commerce Platform

A production-grade digital commerce SaaS platform built on Next.js 16 with a premium storefront, powerful admin dashboard, secure backend, complete product management, order management, customer management, payments, content management, analytics, and automation.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env to add your DATABASE_URL (MongoDB Atlas) and JWT_SECRET

# Push database schema (MongoDB)
bun run db:push

# Seed the database (creates admin, 33 products across 10 categories, coupons, settings, CMS)
bun run scripts/seed.ts

# Start development server
bun run dev
```

Visit http://localhost:3000

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@playbeat.digital | playbeat1122 |
| Customer | customer@playbeat.digital | customer123 |

## 💱 Multi-Currency Support

All product prices are stored in **PKR (Pakistani Rupee)** as the base currency. Customers can switch between:

- **PKR ₨** — Pakistani Rupee (default)
- **USD $** — US Dollar
- **GBP £** — British Pound
- **AED** — UAE Dirham

Conversion happens client-side using rates in `src/lib/utils.ts`. Update rates in production with real-time FX API.

## 📦 Categories

The platform includes 10 product categories:

1. **Gaming** — Game keys, top-ups, DLCs
2. **Software** — Windows, Office, VPNs, Adobe
3. **Gift Cards** — Steam, Google Play, iTunes, Amazon
4. **Streaming** — Netflix, Spotify, Disney+, YouTube
5. **IPTV** — Premium + Sports packages
6. **Smart Projectors** — 7 real Magcubic projectors (HY300 PRO, HY300 Plus, HY300Pro Plus, HT23, HCS350PRO, HM103-A, HY7) with real product images from zerobyte.store
7. **Web3** — Crypto wallets, NFT contracts
8. **Services** — Logo design, WordPress dev
9. **Subscriptions** — ChatGPT Plus, Notion
10. **Digital Downloads** — Lightroom presets, AE templates

## 📽️ Smart Projectors (Real Products)

| Product | Selling Price (PKR) | Source |
|---------|---------------------|--------|
| Magcubic HY300 PRO | Rs 24,750 | zerobyte.store |
| HY300 Plus Projector | Rs 24,750 | zerobyte.store |
| Magcubic HY300Pro Plus | Rs 29,150 | zerobyte.store |
| HT23 Projector | Rs 29,150 | zerobyte.store |
| HCS350PRO Projector | Rs 37,950 | zerobyte.store |
| HM103-A Projector | Rs 42,900 | zerobyte.store |
| HY7 Built-in Battery Projector | Rs 48,950 | zerobyte.store |

All product images are fetched directly from zerobyte.store product pages.

## 🏪 Storefront Features

- Sticky header with mega menu, search, theme toggle (dark/light)
- Hero section with animated gradient + live trending cards
- Sections: Trending, Featured Categories, Deals (with countdown), Best Sellers, Recently Added, Trust badges
- Product detail modal with gallery, variants, FAQ, specs, reviews tabs
- Cart drawer with coupon validation
- Secure checkout with 4 payment methods (Stripe, JazzCash, Easypaisa, Bank Transfer, Wallet)
- Customer account dashboard with 9 tabs
- Instant digital delivery pipeline (auto-assign license keys after payment)

## 🛠 Admin Console (13 Views)

1. **Dashboard** — 8 KPIs, revenue chart, top products/categories, recent orders, quick actions
2. **Products** — Full CRUD with bulk actions (publish/unpublish/archive/delete) + variant editor
3. **Categories** — Visual grid with create/edit
4. **Inventory** — Stats, key management with bulk add (LICENSE/ACCOUNT/DOWNLOAD/M3U), low-stock alerts
5. **Orders** — Search/filter, detail modal with delivered keys, action buttons
6. **Customers** — Search, detail with suspend/activate, wallet credit management
7. **Coupons** — CRUD with PERCENTAGE/FIXED types, min order, usage limits
8. **Subscriptions** — List with extend/cancel actions
9. **Support** — Ticket inbox with reply thread and status management
10. **CMS** — Homepage section visibility toggles
11. **Analytics** — KPIs + top products/categories + export buttons
12. **Audit Logs** — All admin actions tracked
13. **Settings** — 7 groups (General, Store, Payments, Email, Security, SEO, Social)

## 🏗 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Database**: MongoDB Atlas (via Prisma ORM) — production-ready
- **UI**: Tailwind CSS 4 + shadcn/ui + Lucide icons
- **State**: Zustand (cart/wishlist/theme/auth/view) with localStorage persistence
- **Auth**: JWT in HTTP-only cookies + bcrypt password hashing + RBAC
- **Payments**: Modular provider architecture (Stripe, JazzCash, Easypaisa, Bank, Wallet)
- **WhatsApp**: Floating chat button (+92 332 1029333)
- **Toasts**: Sonner

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma          # 20+ models
├── scripts/
│   └── seed.ts                # Database seeding
├── src/
│   ├── app/
│   │   ├── api/v1/           # 28 REST API endpoints
│   │   ├── globals.css        # PlayBeat theme (navy/yellow/silver)
│   │   ├── layout.tsx
│   │   └── page.tsx           # Main entry (storefront + admin)
│   ├── components/
│   │   ├── storefront/        # Header, Hero, Sections, Footer, ProductCard
│   │   ├── admin/             # Console + 13 admin views
│   │   ├── modals/            # 8 modals (product, cart, checkout, auth, account, etc.)
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── auth.ts            # JWT + RBAC
│       ├── db.ts              # Prisma client
│       ├── store.ts          # Zustand store
│       ├── types.ts          # TypeScript types
│       └── utils.ts          # Currency conversion, formatters
└── package.json
```

## 🎨 Design System

PlayBeat Digital premium identity:
- **Colors**: White background, soft grey surfaces, deep navy primary, yellow accent, silver highlights
- **Typography**: Plus Jakarta Sans (display) + Inter (body) + JetBrains Mono (code)
- **Effects**: Selective glassmorphism, rounded 2xl cards, elegant shadows, smooth micro-interactions
- **Themes**: Full dark mode support
- **Responsive**: Mobile-first with bottom nav, sticky header, touch-friendly

## 🔒 Security

- JWT in HTTP-only cookies (7-day expiry)
- bcrypt password hashing (10 rounds)
- RBAC with 6 roles (SUPER_ADMIN, ADMIN, MANAGER, SUPPORT, CONTENT, FINANCE, CUSTOMER)
- All sensitive admin actions logged in AuditLog
- Customer license keys masked in API responses; full keys visible only to staff
- Input validation on all API endpoints

## 🚀 Deployment

The app is deployment-ready for Vercel + any database provider:

1. Push to GitHub
2. Import to Vercel
3. Set environment variables (DATABASE_URL, JWT_SECRET)
4. Run `bun run db:push` and `bun run scripts/seed.ts` once
5. Deploy

## 📝 License

Proprietary — © 2026 PlayBeat Digital. All rights reserved.
