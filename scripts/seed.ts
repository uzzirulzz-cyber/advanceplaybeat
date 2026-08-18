// PlayBeat Digital — Seed script
// Run: bun run scripts/seed.ts
import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

// ----------------- CATEGORIES -----------------
// Only Smart Projectors category remains — all other categories removed per request.
const CATEGORIES = [
  { name: 'Smart Projectors', slug: 'smart-projectors', description: 'Premium Magcubic smart projectors — HY300 PRO, HY300 Plus, HY300Pro Plus, HT23, HCS350PRO, HM103-A, HY7 with Android TV, Wi-Fi 6, and 4K support. Authentic products with official warranty.', imageUrl: 'https://www.zerobyte.store/cdn/shop/files/S6002d940582649c9be0292811be6b4e5I.jpg', bannerUrl: 'https://www.zerobyte.store/cdn/shop/files/HCS350_PRO_WHITE.png', sortOrder: 1, isFeatured: true },
]

// ----------------- PRODUCTS -----------------
type ProductSeed = {
  title: string
  slug: string
  shortDesc?: string
  description: string
  type?: string
  categorySlug: string
  basePrice: number
  salePrice?: number
  sku?: string
  imageUrl: string
  galleryUrls?: string[]
  features?: string[]
  specifications?: { label: string; value: string }[]
  faqs?: { q: string; a: string }[]
  tags?: string[]
  rating?: number
  reviewsCount?: number
  salesCount?: number
  isFeatured?: boolean
  isTrending?: boolean
  isBestSeller?: boolean
  isDeal?: boolean
  dealEndsAt?: Date
  deliveryMethod?: string
  licenseType?: string
  variants?: { name: string; durationDays: number; price: number; salePrice?: number; stock: number }[]
  inventoryKeys?: { key: string; keyType: string }[]
}

const PRODUCTS: ProductSeed[] = [
  // ===== SMART PROJECTORS — 7 real Magcubic products from zerobyte.store =====
  // Prices are COST prices (no profit margin added). No discount/sale badges shown.
  {
    title: 'Magcubic HY300 PRO',
    slug: 'magcubic-hy300-pro',
    shortDesc: '290 ANSI, Manual Focus, Android 14, 8K support, Dual Wi-Fi 6, BT 5.4 Projector.',
    description: 'The Magcubic HY300 PRO is a powerful portable smart projector featuring 290 ANSI lumens brightness, manual focus, Android 14.0 OS, and 8K video decoding support. With native 1280x720P resolution (supports up to 1080p/2K/4K decoding via HD signal), dual Wi-Fi 6 (2.4G + 5G), and Bluetooth 5.4, this projector delivers crisp images and seamless streaming. Built-in 1/4 screw hole for tripod mounting, HDMI input, and remote controller included. Perfect for home cinema, gaming, and outdoor movie nights.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 22500, salePrice: null, sku: 'PB-MGC-HY300PRO',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/S9fbe418fb0084a9a927f28e16a51bd25a.jpg',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/S9fbe418fb0084a9a927f28e16a51bd25a.jpg',
      'https://cdn.shopify.com/s/files/1/0630/8524/8608/files/40d7_20260307_124446.jpg',
      'https://cdn.shopify.com/s/files/1/0630/8524/8608/files/6c0d_20260307_124435.jpg',
      'https://cdn.shopify.com/s/files/1/0630/8524/8608/files/76e6_20260307_124441.jpg',
    ],
    features: [
      'Native 1280x720P, supports 8K video decoding',
      '290 ANSI lumens brightness',
      'Android 14.0 operating system',
      'Dual Wi-Fi 6 (2.4G + 5G) + Bluetooth 5.4',
      'Manual focus with keystone correction',
      'Built-in 1/4 screw hole for tripod',
      'HDMI input + remote controller included',
      '1-year warranty',
    ],
    specifications: [
      {label:'Native Resolution',value:'1280x720P (720p HD)'},
      {label:'Max Resolution',value:'8K decoding via HD signal'},
      {label:'Brightness',value:'290 ANSI lumens'},
      {label:'OS',value:'Android 14.0'},
      {label:'CPU',value:'Quad-core ARM Cortex'},
      {label:'Wi-Fi',value:'Dual 2.4G + 5G Wi-Fi 6'},
      {label:'Bluetooth',value:'5.4'},
      {label:'Connectivity',value:'HDMI, USB, 3.5mm AUX'},
      {label:'Focus',value:'Manual'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:'Does it support Netflix and YouTube?',a:'Yes — with Android 14.0 built-in, you can install Netflix, YouTube, Prime Video, and Disney+ directly from Google Play Store.'},
      {q:'Can I connect my phone?',a:'Yes — use Miracast for Android or AirPlay for iPhone via the built-in screen mirroring feature.'},
      {q:"What's the maximum screen size?",a:'Recommended up to 100 inches in a darkened room. Best image quality at 60-80 inches.'},
    ],
    tags: ['magcubic','hy300','projector','android','wifi6','portable','8k'],
    rating: 4.7, reviewsCount: 312, salesCount: 1840, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 22500, stock: 30 },
      { name: 'With Tripod', durationDays: 0, price: 24300, stock: 15 },
      { name: 'With 80" Screen + Tripod', durationDays: 0, price: 32500, stock: 8 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HY300PRO-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HY300PRO-SN-0002', keyType: 'LICENSE' },
      { key: 'PB-MGC-HY300PRO-SN-0003', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'HY300 Plus Projector',
    slug: 'hy300-plus-projector',
    shortDesc: 'HY300 Plus — upgraded Magcubic with Android 14, 8K decoding, dual Wi-Fi 6, BT 5.4.',
    description: 'The HY300 Plus is the upgraded variant of the popular Magcubic HY300 series, featuring Android 14.0, native 1280x720P resolution with 8K video decoding support, dual-band Wi-Fi 6, and Bluetooth 5.4. With improved brightness and color accuracy over the standard HY300, the Plus model delivers a sharper, more vibrant image. Perfect for home cinema, gaming, sports streaming, and outdoor entertainment.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 22500, salePrice: null, sku: 'PB-MGC-HY300PLUS',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/Se6ca806a4e03461fb8748fff3d1c187eI.webp',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/Se6ca806a4e03461fb8748fff3d1c187eI.webp',
    ],
    features: [
      'Native 1280x720P, supports 8K decoding',
      'Android 14.0 OS',
      'Dual-band Wi-Fi 6 (2.4G + 5G)',
      'Bluetooth 5.4',
      'Improved brightness over standard HY300',
      'Auto keystone correction',
      'Built-in speaker + HDMI output',
      '1-year warranty',
    ],
    specifications: [
      {label:'Native Resolution',value:'1280x720P'},
      {label:'Max Decoding',value:'8K'},
      {label:'OS',value:'Android 14.0'},
      {label:'Wi-Fi',value:'Dual-band 2.4G + 5G Wi-Fi 6'},
      {label:'Bluetooth',value:'5.4'},
      {label:'Connectivity',value:'HDMI, USB, AUX'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:'How is the HY300 Plus different from the HY300 PRO?',a:'The HY300 Plus has improved brightness and color accuracy, while the PRO variant adds 290 ANSI lumens and a manual focus ring for finer image control.'},
      {q:'Can I install apps?',a:'Yes — Android 14.0 gives you full access to Google Play Store for Netflix, YouTube, Prime Video, Disney+, and more.'},
    ],
    tags: ['magcubic','hy300','plus','projector','android','wifi6','8k'],
    rating: 4.6, reviewsCount: 184, salesCount: 920, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 22500, stock: 25 },
      { name: 'With Free Tripod', durationDays: 0, price: 24300, stock: 12 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HY300PLUS-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HY300PLUS-SN-0002', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'Magcubic HY300Pro Plus',
    slug: 'magcubic-hy300pro-plus',
    shortDesc: '290 ANSI, 180° flexible projection angle, Android 14, 8K native 1280x720P support.',
    description: 'The Magcubic HY300Pro Plus is the premium tier of the HY300 lineup, featuring 290 ANSI lumens, native 1280x720P with 8K support, and a unique 180° flexible projection angle that lets you project on walls, ceilings, or any surface. Powered by Android 14 with Allwinner H723 Quad-core Cortex-A53 CPU and Mali-G31 GPU. Supports OpenGL ES 3.2 and OpenCL 2.0 for smooth 3D rendering. The perfect fusion of portability, performance, and versatility.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 26500, salePrice: null, sku: 'PB-MGC-HY300PROPLUS',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/S6002d940582649c9be0292811be6b4e5I.jpg',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/S6002d940582649c9be0292811be6b4e5I.jpg',
    ],
    features: [
      '290 ANSI lumens brightness',
      '180° flexible projection angle',
      'Android 14.0 OS',
      'Allwinner H723 Quad-core Cortex-A53 CPU',
      'Mali-G31 GPU (OpenGL ES 3.2, OpenCL 2.0)',
      'Native 1280x720P, supports 8K',
      'Dual-band Wi-Fi 6 + Bluetooth 5.4',
      '1-year warranty',
    ],
    specifications: [
      {label:'Native Resolution',value:'1280x720P'},
      {label:'Max Decoding',value:'8K'},
      {label:'Brightness',value:'290 ANSI lumens'},
      {label:'Projection Angle',value:'180° flexible'},
      {label:'OS',value:'Android 14.0'},
      {label:'CPU',value:'Allwinner H723 Quad-core Cortex-A53'},
      {label:'GPU',value:'Mali-G31 (OpenGL ES 3.2, OpenCL 2.0)'},
      {label:'Wi-Fi',value:'Dual-band Wi-Fi 6'},
      {label:'Bluetooth',value:'5.4'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:'What is the 180° projection angle?',a:'The HY300Pro Plus can rotate 180° on its base, allowing you to project on the ceiling, wall, or floor without repositioning the entire unit.'},
      {q:'Can it handle 4K gaming?',a:'It supports 4K input via HDMI but natively renders at 720P. For best gaming experience, set your console to 1080p output.'},
    ],
    tags: ['magcubic','hy300','pro-plus','projector','android','180-degree','8k'],
    rating: 4.8, reviewsCount: 247, salesCount: 1380, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 26500, stock: 20 },
      { name: 'With Tripod + Carry Case', durationDays: 0, price: 29999, stock: 10 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HY300PROPLUS-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HY300PROPLUS-SN-0002', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'HT23 Projector',
    slug: 'ht23-projector',
    shortDesc: '2.69-inch LCD, 260 ANSI lumens, native 1280x720P, USB 2.0/HDMI/AUX, electric focus.',
    description: 'The HT23 Projector features a 2.69-inch LCD panel with 260 ANSI lumens high-brightness output and native 1280x720P resolution. Equipped with electric focus, USB 2.0, HDMI, and AUX interfaces for versatile connectivity. The high transparency LCD delivers vivid colors and sharp images, making it perfect for home theater, gaming, and presentations. Compact design with built-in speaker and remote control.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 26500, salePrice: null, sku: 'PB-MGC-HT23',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/preview_images/1_d88162d0-7eb3-4d29-b282-3c3163dbfc89.png',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/preview_images/1_d88162d0-7eb3-4d29-b282-3c3163dbfc89.png',
    ],
    features: [
      '2.69-inch LCD panel',
      '260 ANSI lumens high brightness',
      'Native 1280x720P resolution',
      'Electric focus mechanism',
      'USB 2.0 + HDMI + AUX interfaces',
      'Built-in speaker',
      'Remote control included',
      '1-year warranty',
    ],
    specifications: [
      {label:'Light Source',value:'2.69-inch LCD'},
      {label:'Brightness',value:'260 ANSI lumens'},
      {label:'Native Resolution',value:'1280x720P'},
      {label:'Focus',value:'Electric (motorized)'},
      {label:'Interfaces',value:'USB 2.0, HDMI, AUX'},
      {label:'Speaker',value:'Built-in'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:'Is the focus manual or motorized?',a:'The HT23 has an electric (motorized) focus — adjust with the remote control without touching the lens.'},
      {q:'Can I play movies from a USB drive?',a:'Yes — connect a USB drive to the USB 2.0 port and play media files directly. Supports MP4, MKV, AVI, and other common formats.'},
    ],
    tags: ['ht23','projector','lcd','electric-focus','720p','home-cinema'],
    rating: 4.5, reviewsCount: 142, salesCount: 680, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 26500, stock: 22 },
      { name: 'With Free HDMI Cable', durationDays: 0, price: 27500, stock: 15 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HT23-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HT23-SN-0002', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'HCS350PRO Projector',
    slug: 'hcs350pro-projector',
    shortDesc: 'Native 1280x720P (max 1080P/2K/4K decode), Wi-Fi 6, Android 11, 1GB RAM, 8GB ROM.',
    description: 'The HCS350PRO Projector delivers native 1280x720P resolution with support for 1080P, 2K, and 4K HD signal decoding. Powered by Android 11.0 with 1GB RAM and 8GB ROM, dual-band Wi-Fi 6 (2.4G + 5G), and a powerful quad-core CPU. Premium white finish with sleek modern design. Perfect for streaming Netflix, YouTube, Prime Video, and Disney+ directly without external devices. Includes remote control, HDMI input, and built-in speaker.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 34500, salePrice: null, sku: 'PB-MGC-HCS350PRO',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/HCS350_PRO_WHITE.png',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/HCS350_PRO_WHITE.png',
      'https://www.zerobyte.store/cdn/shop/files/HCS350_PRO_BLACK.jpg',
    ],
    features: [
      'Native 1280x720P, max 1080P/2K/4K decoding',
      'Android 11.0 operating system',
      'Dual Wi-Fi 6 (2.4G + 5G)',
      '1GB RAM + 8GB ROM',
      'Quad-core CPU',
      'Premium white finish',
      'Built-in speaker + remote control',
      '1-year warranty',
    ],
    specifications: [
      {label:'Native Resolution',value:'1280x720P'},
      {label:'Max Decode',value:'4K via HD signal'},
      {label:'OS',value:'Android 11.0'},
      {label:'RAM',value:'1GB'},
      {label:'ROM',value:'8GB'},
      {label:'Wi-Fi',value:'Dual 2.4G + 5G Wi-Fi 6'},
      {label:'CPU',value:'Quad-core'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:"What's the difference between HCS350PRO and HY300 series?",a:'The HCS350PRO has a more powerful CPU, larger ROM (8GB vs typical 4GB), and premium white chassis. It also supports Wi-Fi 6 for faster streaming.'},
      {q:'Can I install apps from Play Store?',a:'Yes — Android 11.0 gives full access to Google Play Store for installing Netflix, YouTube, Disney+, Kodi, and more.'},
    ],
    tags: ['hcs350','pro','projector','android','wifi6','4k','magcubic'],
    rating: 4.7, reviewsCount: 198, salesCount: 870, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit (White)', durationDays: 0, price: 34500, stock: 18 },
      { name: 'Single Unit (Black)', durationDays: 0, price: 34500, stock: 12 },
      { name: 'Bundle with 100" Screen', durationDays: 0, price: 46500, stock: 6 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HCS350PRO-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HCS350PRO-SN-0002', keyType: 'LICENSE' },
      { key: 'PB-MGC-HCS350PRO-SN-0003', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'HM103-A Projector',
    slug: 'hm103-a-projector',
    shortDesc: 'Native 1080P (Full HD 1920x1080), 4K decode, T950S Cortex-A53, 2GB RAM, 16GB ROM, 300 ANSI.',
    description: 'The HM103-A Projector is a true Full HD powerhouse with native 1920x1080 resolution and 4K decoding support. Powered by the T950S Cortex-A53 CPU with Mali-450 MP2 GPU, 2GB RAM, and 16GB ROM — significantly more powerful than entry-level projectors. With 300 ANSI lumens brightness and LCD technology, it delivers crisp, bright images even in moderately lit rooms. Perfect for serious home cinema enthusiasts who demand native 1080p quality without compromising on smart features.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 39000, salePrice: null, sku: 'PB-MGC-HM103A',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/preview_images/WHITE.png',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/preview_images/WHITE.png',
    ],
    features: [
      'Native Full HD 1920x1080 (true 1080p)',
      '4K decoding support',
      'T950S Cortex-A53 CPU',
      'Mali-450 MP2 GPU',
      '2GB RAM + 16GB ROM',
      '300 ANSI lumens brightness',
      'LCD display technology',
      '1-year warranty',
    ],
    specifications: [
      {label:'Native Resolution',value:'1920x1080 (Full HD)'},
      {label:'Max Decode',value:'4K'},
      {label:'Brightness',value:'300 ANSI lumens'},
      {label:'CPU',value:'T950S Cortex-A53'},
      {label:'GPU',value:'Mali-450 MP2'},
      {label:'RAM',value:'2GB'},
      {label:'ROM',value:'16GB'},
      {label:'Technology',value:'LCD'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:'Why is the HM103-A more expensive?',a:'It has native 1080p resolution (vs 720p on most projectors in this range), more RAM (2GB), more storage (16GB), and a brighter 300 ANSI output. The hardware is significantly more powerful.'},
      {q:'Is it good for gaming?',a:'Yes — the native 1080p resolution and 300 ANSI brightness make it ideal for PS5, Xbox Series X, and PC gaming. Input lag is acceptable for casual gaming.'},
    ],
    tags: ['hm103','projector','1080p','native-fhd','4k','magcubic','premium'],
    rating: 4.9, reviewsCount: 89, salesCount: 410, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit (White)', durationDays: 0, price: 39000, stock: 15 },
      { name: 'With Soundbar Bundle', durationDays: 0, price: 45500, stock: 8 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HM103A-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HM103A-SN-0002', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'HY7 Built-in Battery Projector',
    slug: 'hy7-battery-projector',
    shortDesc: 'Native 1280x720 (720p HD), up to 1080p/4K decoding, 180-280 ANSI lumens, built-in battery.',
    description: 'The HY7 Projector is the ultimate portable entertainment solution with a built-in rechargeable battery — no need for a power outlet during outdoor movie nights! Featuring native 1280x720 (720p HD) resolution with support for up to 1080p and 4K decoding, 180-280 ANSI lumens brightness, and a 400:1 to 6000:1 contrast ratio. The internal battery provides hours of playback on a single charge, making it perfect for camping, backyard cinema, presentations, and travel.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 44500, salePrice: null, sku: 'PB-MGC-HY7',
    imageUrl: 'https://www.zerobyte.store/cdn/shop/files/S9b7d3e654ba04d26b500c9268f4fa0008.webp',
    galleryUrls: [
      'https://www.zerobyte.store/cdn/shop/files/S9b7d3e654ba04d26b500c9268f4fa0008.webp',
      'https://ae01.alicdn.com/kf/S10e9a3bd1fe949e78d10ca3280dc7a5aN.jpg',
      'https://ae01.alicdn.com/kf/S1625b59c9ec942c39982eaf4bc9d1da2c.jpg',
      'https://ae01.alicdn.com/kf/S330c317bafbe459b8ff72baf45cd1ef4a.jpg',
    ],
    features: [
      'Native 1280x720 (720p HD)',
      'Up to 1080p / 4K decoding',
      '180-280 ANSI lumens brightness',
      '400:1 to 6000:1 contrast ratio',
      'Built-in rechargeable battery',
      'Portable design — perfect for outdoor use',
      'Wi-Fi + Bluetooth connectivity',
      '1-year warranty',
    ],
    specifications: [
      {label:'Native Resolution',value:'1280x720 (720p HD)'},
      {label:'Supported',value:'Up to 1080p / 4K decoding'},
      {label:'Brightness',value:'180-280 ANSI lumens'},
      {label:'Contrast Ratio',value:'400:1 to 6000:1'},
      {label:'Battery',value:'Built-in rechargeable'},
      {label:'Portability',value:'Outdoor-ready design'},
      {label:'Warranty',value:'1 year'},
    ],
    faqs: [
      {q:'How long does the battery last?',a:'The built-in battery provides up to 2 hours of continuous playback — enough for a full movie or gaming session outdoors.'},
      {q:'Is it good for daytime use?',a:'With 180-280 ANSI lumens, the HY7 is best for dim/dark environments. For daytime outdoor use, we recommend the HCS350PRO or HM103-A which have higher brightness.'},
      {q:'Can I charge it via power bank?',a:'Yes — the HY7 supports charging via USB-C power bank (5V/2A minimum) for extended outdoor use.'},
    ],
    tags: ['hy7','projector','portable','battery','outdoor','magcubic','720p'],
    rating: 4.6, reviewsCount: 234, salesCount: 1120, isFeatured: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 44500, stock: 12 },
      { name: 'With Carry Bag + Tripod', durationDays: 0, price: 48500, stock: 6 },
      { name: 'With 80" Outdoor Screen', durationDays: 0, price: 53500, stock: 4 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HY7-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HY7-SN-0002', keyType: 'LICENSE' },
    ],
  },
]

// ----------------- COUPONS -----------------
// Prices in PKR
const COUPONS = [
  { code: 'WELCOME10', description: '10% off for new customers', type: 'PERCENTAGE', value: 10, minOrder: 5000, usageLimit: 1000, isActive: true },
  { code: 'SAVE25', description: '25% off orders above Rs 25,000', type: 'PERCENTAGE', value: 25, minOrder: 25000, usageLimit: 500, isActive: true },
  { code: 'FLAT2000', description: 'Rs 2,000 off any order', type: 'FIXED', value: 2000, minOrder: 10000, usageLimit: 200, isActive: true },
  { code: 'PLAYBEAT50', description: '50% off — limited launch offer', type: 'PERCENTAGE', value: 50, minOrder: 0, usageLimit: 100, isActive: true, expiresAt: new Date(Date.now() + 14*24*60*60*1000) },
  { code: 'PROJECTOR10', description: '10% off Smart Projectors', type: 'PERCENTAGE', value: 10, categorySlugs: '["smart-projectors"]', usageLimit: 100, isActive: true },
]

// ----------------- SETTINGS -----------------
const SETTINGS = [
  { key: 'store_name', value: 'PlayBeat Digital', group: 'GENERAL' },
  { key: 'store_tagline', value: 'Premium Digital Marketplace', group: 'GENERAL' },
  { key: 'store_logo', value: '', group: 'GENERAL' },
  { key: 'contact_email', value: 'support@playbeat.digital', group: 'GENERAL' },
  { key: 'contact_phone', value: '+92 300 0000000', group: 'GENERAL' },
  { key: 'currency', value: 'PKR', group: 'GENERAL' },
  { key: 'timezone', value: 'Asia/Karachi', group: 'GENERAL' },
  { key: 'tax_rate', value: '0', group: 'STORE' },
  { key: 'enable_wishlist', value: 'true', group: 'STORE' },
  { key: 'enable_coupons', value: 'true', group: 'STORE' },
  { key: 'enable_reviews', value: 'true', group: 'STORE' },
  { key: 'stripe_enabled', value: 'true', group: 'PAYMENTS' },
  { key: 'jazzcash_enabled', value: 'true', group: 'PAYMENTS' },
  { key: 'easypaisa_enabled', value: 'true', group: 'PAYMENTS' },
  { key: 'bank_transfer_enabled', value: 'true', group: 'PAYMENTS' },
  { key: 'wallet_enabled', value: 'true', group: 'PAYMENTS' },
  { key: 'smtp_host', value: '', group: 'EMAIL' },
  { key: 'smtp_port', value: '587', group: 'EMAIL' },
  { key: 'smtp_user', value: '', group: 'EMAIL' },
  { key: 'sender_name', value: 'PlayBeat Digital', group: 'EMAIL' },
  { key: 'sender_email', value: 'noreply@playbeat.digital', group: 'EMAIL' },
  { key: 'session_timeout', value: '60', group: 'SECURITY' },
  { key: 'password_min_length', value: '8', group: 'SECURITY' },
  { key: 'enable_2fa', value: 'false', group: 'SECURITY' },
  { key: 'seo_title', value: 'PlayBeat Digital — Premium Digital Marketplace', group: 'SEO' },
  { key: 'seo_description', value: 'Buy digital products, gaming keys, gift cards, streaming subscriptions, IPTV and more. Instant delivery, secure payments, 24/7 support.', group: 'SEO' },
  { key: 'social_facebook', value: 'https://facebook.com/playbeat.digital', group: 'SOCIAL' },
  { key: 'social_instagram', value: 'https://instagram.com/playbeat.digital', group: 'SOCIAL' },
  { key: 'social_tiktok', value: 'https://tiktok.com/@playbeat.digital', group: 'SOCIAL' },
  { key: 'social_youtube', value: 'https://youtube.com/@playbeat.digital', group: 'SOCIAL' },
  { key: 'social_whatsapp', value: 'https://wa.me/923000000000', group: 'SOCIAL' },
  { key: 'social_telegram', value: 'https://t.me/playbeatdigital', group: 'SOCIAL' },
]

// ----------------- CMS SECTIONS -----------------
const CMS_SECTIONS = [
  { sectionKey: 'HERO', title: 'Hero Banner', subtitle: 'Main homepage banner', isVisible: true, sortOrder: 1, config: JSON.stringify({ heading: 'Premium Digital Products, Delivered Instantly', subheading: 'Gaming keys, software licenses, gift cards, streaming, IPTV and more — at unbeatable prices with 24/7 support.', ctaPrimary: 'Shop Now', ctaSecondary: 'Browse Deals', bg: 'navy' }) },
  { sectionKey: 'TRENDING', title: 'Trending Now', subtitle: 'Hot products right now', isVisible: true, sortOrder: 2, config: '{}' },
  { sectionKey: 'CATEGORIES', title: 'Featured Categories', subtitle: 'Browse by category', isVisible: true, sortOrder: 3, config: '{}' },
  { sectionKey: 'DEALS', title: 'Deals of the Week', subtitle: 'Limited-time offers', isVisible: true, sortOrder: 4, config: '{}' },
  { sectionKey: 'BEST_SELLERS', title: 'Best Sellers', subtitle: 'Top picks this month', isVisible: true, sortOrder: 5, config: '{}' },
  { sectionKey: 'RECENT', title: 'Recently Added', subtitle: 'Newest products', isVisible: true, sortOrder: 6, config: '{}' },
  { sectionKey: 'TRUST', title: 'Why Shop With Us', subtitle: 'Customer trust badges', isVisible: true, sortOrder: 7, config: '{}' },
]

async function seed() {
  console.log('🌱 Seeding PlayBeat Digital...')

  // 1. Categories
  console.log('  → Categories')
  for (const cat of CATEGORIES) {
    const existing = await db.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      await db.category.update({ where: { slug: cat.slug }, data: cat })
    } else {
      await db.category.create({ data: cat })
    }
  }

  // 2. Admin user
  console.log('  → Admin user')
  const adminEmail = 'admin@playbeat.digital'
  const adminPw = await bcrypt.hash('playbeat1122', SALT_ROUNDS)
  const adminExisting = await db.user.findUnique({ where: { email: adminEmail } })
  if (adminExisting) {
    await db.user.update({ where: { email: adminEmail }, data: { passwordHash: adminPw, role: 'SUPER_ADMIN' } })
  } else {
    await db.user.create({ data: { email: adminEmail, name: 'PlayBeat Admin', passwordHash: adminPw, role: 'SUPER_ADMIN', status: 'ACTIVE', walletBalance: 0 } })
  }

  // 3. Demo customer
  const custEmail = 'customer@playbeat.digital'
  const custPw = await bcrypt.hash('customer123', SALT_ROUNDS)
  const custExisting = await db.user.findUnique({ where: { email: custEmail } })
  if (custExisting) {
    // skip — keep existing customer data
  } else {
    await db.user.create({ data: { email: custEmail, name: 'Demo Customer', passwordHash: custPw, role: 'CUSTOMER', status: 'ACTIVE', walletBalance: 5000 } })
  }

  // 4. Products
  console.log('  → Products')
  for (const p of PRODUCTS) {
    const { variants, inventoryKeys, ...productData } = p
    const existing = await db.product.findUnique({ where: { slug: p.slug }, include: { variants: true, inventory: true } })
    const createData: any = {
      ...productData,
      galleryUrls: JSON.stringify(p.galleryUrls || []),
      features: JSON.stringify(p.features || []),
      specifications: JSON.stringify(p.specifications || []),
      faqs: JSON.stringify(p.faqs || []),
      tags: JSON.stringify(p.tags || []),
    }
    let productId: string
    if (existing) {
      await db.product.update({ where: { slug: p.slug }, data: createData })
      productId = existing.id
    } else {
      const created = await db.product.create({ data: createData })
      productId = created.id
      // Add variants and inventory keys for new products
      if (variants && variants.length > 0) {
        for (const v of variants) {
          await db.productVariant.create({ data: { ...v, productId } })
        }
      }
      if (inventoryKeys && inventoryKeys.length > 0) {
        for (const k of inventoryKeys) {
          await db.inventoryKey.create({ data: { ...k, productId } })
        }
      }
    }
  }

  // 5. Coupons
  console.log('  → Coupons')
  for (const c of COUPONS) {
    const existing = await db.coupon.findUnique({ where: { code: c.code } })
    if (!existing) {
      await db.coupon.create({ data: c as any })
    }
  }

  // 6. Settings
  console.log('  → Settings')
  for (const s of SETTINGS) {
    const existing = await db.setting.findUnique({ where: { key: s.key } })
    if (existing) {
      await db.setting.update({ where: { key: s.key }, data: { value: s.value } })
    } else {
      await db.setting.create({ data: s })
    }
  }

  // 7. CMS Sections
  console.log('  → CMS Sections')
  for (const sec of CMS_SECTIONS) {
    const existing = await db.cMSSection.findUnique({ where: { sectionKey: sec.sectionKey } })
    if (!existing) {
      await db.cMSSection.create({ data: sec as any })
    }
  }

  console.log('✅ Seed complete!')
  console.log('')
  console.log('Admin login:')
  console.log('  Email: admin@playbeat.digital')
  console.log('  Password: playbeat1122')
  console.log('')
  console.log('Customer login:')
  console.log('  Email: customer@playbeat.digital')
  console.log('  Password: customer123')
  console.log('')
  console.log('Default currency: PKR (with conversion to USD/GBP/AED)')
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
