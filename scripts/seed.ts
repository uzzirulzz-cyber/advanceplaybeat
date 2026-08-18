// PlayBeat Digital — Seed script
// Run: bun run scripts/seed.ts
import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

// ----------------- CATEGORIES -----------------
// Note: Social Media, Web Hosting, and Digital Marketing categories were removed per request.
const CATEGORIES = [
  { name: 'Gaming', slug: 'gaming', description: 'Game keys, top-ups, DLCs, in-game currency and accounts for PC, console and mobile.', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&q=80', sortOrder: 1, isFeatured: true },
  { name: 'Software', slug: 'software', description: 'Genuine license keys for Windows, Office, Adobe, antivirus, VPNs and developer tools.', imageUrl: 'https://images.unsplash.com/photo-1629654290458-8e6da9212d1f?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa7c?w=1600&q=80', sortOrder: 2, isFeatured: true },
  { name: 'Gift Cards', slug: 'gift-cards', description: 'Digital gift cards for Steam, PlayStation, Xbox, Google Play, iTunes, Amazon and more.', imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd3e05?w=1600&q=80', sortOrder: 3, isFeatured: true },
  { name: 'Streaming', slug: 'streaming', description: 'Premium subscriptions for Netflix, Spotify, Disney+, YouTube Premium, HBO Max and Prime Video.', imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe7a?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1522869635100-9f4465a86a72?w=1600&q=80', sortOrder: 4, isFeatured: true },
  { name: 'IPTV', slug: 'iptv', description: 'Premium IPTV subscriptions with HD/4K channels, VOD libraries and multi-device support.', imageUrl: 'https://images.unsplash.com/photo-1593784991095-a2055888d3f1?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1521903101605-0a8d2c8b7ef8?w=1600&q=80', sortOrder: 5, isFeatured: true },
  { name: 'Smart Projectors', slug: 'smart-projectors', description: 'Premium Magcubic smart projectors — HY300, HY300 Pro, HY300 Plus, HT23, HCS350, HM103-A, HY7 with Android TV, Wi-Fi 6, and 4K support.', imageUrl: 'https://www.zerobyte.store/cdn/shop/files/S6002d940582649c9be0292811be6b4e5I.jpg', bannerUrl: 'https://www.zerobyte.store/cdn/shop/files/HCS350_PRO_WHITE.png', sortOrder: 6, isFeatured: true },
  { name: 'Web3', slug: 'web3', description: 'NFTs, blockchain tools, crypto wallets, smart contract audits and DeFi utilities.', imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1600&q=80', sortOrder: 7, isFeatured: false },
  { name: 'Services', slug: 'services', description: 'Professional services — design, development, writing, voice-over and video editing.', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80', sortOrder: 8, isFeatured: false },
  { name: 'Subscriptions', slug: 'subscriptions', description: 'Recurring premium subscriptions for SaaS, productivity, education and entertainment.', imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80', sortOrder: 9, isFeatured: false },
  { name: 'Digital Downloads', slug: 'digital-downloads', description: 'E-books, templates, presets, stock assets, plugins and digital creative resources.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', bannerUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80', sortOrder: 10, isFeatured: false },
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
  // ===== GAMING =====
  {
    title: 'Cyberpunk 2077 — PC Steam Key',
    slug: 'cyberpunk-2077-pc',
    shortDesc: 'Become a cyberpunk, an urban mercenary equipped with cybernetic enhancements and build your legend on the streets of Night City.',
    description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamour, and ceaseless body modification. Play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. The game features a massive, branching storyline, deep character progression, and an ever-evolving world.',
    type: 'DIGITAL',
    categorySlug: 'gaming',
    basePrice: 16797, salePrice: 9797, sku: 'PB-CP2077-PC',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c8e32158?w=800&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1538481199705-c710c8e32158?w=1200&q=80','https://images.unsplash.com/photo-1556438230-1b75b3b0e3d4?w=1200&q=80'],
    features: ['Instant Steam activation key','Official PC version','Lifetime ownership','All patches & DLCs included','Multi-language support'],
    specifications: [{label:'Platform',value:'PC / Steam'},{label:'Genre',value:'Open-World RPG'},{label:'Publisher',value:'CD Projekt'},{label:'Release',value:'2020'},{label:'Languages',value:'EN, FR, DE, ES, JP, PL'}],
    faqs: [{q:'How fast is the delivery?',a:'Keys are delivered instantly after successful payment to your account dashboard and email.'},{q:'Can I get a refund?',a:'Yes, refunds are available for unused keys within 14 days. See refund policy.'}],
    tags: ['rpg','open-world','single-player','steam'],
    rating: 4.6, reviewsCount: 1284, salesCount: 8930, isFeatured: true, isTrending: true, isBestSeller: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 3*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'STEAM_KEY',
    variants: [
      { name: 'Standard Edition', durationDays: 0, price: 9797, stock: 50 },
      { name: 'Deluxe Edition', durationDays: 0, price: 13997, salePrice: 11197, stock: 25 },
      { name: 'Phantom Liberty Bundle', durationDays: 0, price: 19597, salePrice: 15397, stock: 15 },
    ],
    inventoryKeys: [
      { key: 'CP2077-XXXX-XXXX-XXXX-STEAM-A1', keyType: 'LICENSE' },
      { key: 'CP2077-XXXX-XXXX-XXXX-STEAM-A2', keyType: 'LICENSE' },
      { key: 'CP2077-XXXX-XXXX-XXXX-STEAM-A3', keyType: 'LICENSE' },
      { key: 'CP2077-XXXX-XXXX-XXXX-STEAM-A4', keyType: 'LICENSE' },
      { key: 'CP2077-XXXX-XXXX-XXXX-STEAM-A5', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'PlayStation Plus Deluxe — 12 Months',
    slug: 'ps-plus-deluxe-12m',
    shortDesc: '12-month PS Plus Deluxe subscription with monthly games, online multiplayer and exclusive discounts.',
    description: 'PlayStation Plus Deluxe is the premium tier of PlayStation Plus, giving members access to a catalogue of beloved PlayStation games, the Classics Catalogue, online multiplayer, cloud storage for saves, exclusive discounts, and the monthly PS Plus games lineup. A must-have for any PlayStation gamer looking to maximise their console experience.',
    type: 'SUBSCRIPTION',
    categorySlug: 'gaming',
    basePrice: 27997, salePrice: 22397, sku: 'PB-PSPLUS-12M',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    features: ['12 months of PS Plus Deluxe','Monthly free games','Online multiplayer access','Classics Catalogue access','Exclusive store discounts','Cloud save storage 100GB'],
    specifications: [{label:'Platform',value:'PS4 / PS5'},{label:'Region',value:'Region-free'},{label:'Duration',value:'12 months'},{label:'Delivery',value:'Digital code'}],
    faqs: [{q:'Can I activate this on any PSN account?',a:'Yes — region-free codes work on any PlayStation Network account.'},{q:'What happens after 12 months?',a:'You can renew at the then-current price or downgrade to a lower tier.'}],
    tags: ['playstation','subscription','multiplayer','ps-plus'],
    rating: 4.8, reviewsCount: 542, salesCount: 3120, isBestSeller: true, isTrending: true,
    deliveryMethod: 'INSTANT', licenseType: 'SUBSCRIPTION_CODE',
    variants: [
      { name: '1 Month', durationDays: 30, price: 3357.2, stock: 100 },
      { name: '3 Months', durationDays: 90, price: 8397, salePrice: 7557, stock: 60 },
      { name: '12 Months', durationDays: 365, price: 27997, salePrice: 22397, stock: 40 },
    ],
    inventoryKeys: [
      { key: 'PSPLUS-D12M-XXXXXXXX01', keyType: 'LICENSE' },
      { key: 'PSPLUS-D12M-XXXXXXXX02', keyType: 'LICENSE' },
      { key: 'PSPLUS-D12M-XXXXXXXX03', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'EA FC 25 — PC Origin Key',
    slug: 'ea-fc-25-pc',
    shortDesc: 'The latest instalment of the legendary football franchise with HyperMotion V and updated rosters.',
    description: 'EA FC 25 brings the world\'s game to your screen with the new HyperMotion V technology, updated player rosters, improved Ultimate Team mode, and the new Rush 5v5 mode. Compete online or build your dream squad in Career Mode.',
    type: 'DIGITAL',
    categorySlug: 'gaming',
    basePrice: 19597, salePrice: 12597, sku: 'PB-EAFC25-PC',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
    features: ['Instant Origin activation','HyperMotion V gameplay','Ultimate Team access','Rush 5v5 mode','Updated 2025 rosters'],
    specifications: [{label:'Platform',value:'PC / EA App'},{label:'Genre',value:'Sports / Football'},{label:'Publisher',value:'EA Sports'},{label:'Release',value:'2024'}],
    faqs: [{q:'Does this include the Ultimate Team points?',a:'No — Ultimate Team points are sold separately. The base game includes full Ultimate Team mode access.'}],
    tags: ['sports','football','multiplayer','ea'],
    rating: 4.4, reviewsCount: 312, salesCount: 1980, isFeatured: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 5*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'ORIGIN_KEY',
    variants: [
      { name: 'Standard Edition', durationDays: 0, price: 12597, stock: 30 },
      { name: 'Ultimate Edition', durationDays: 0, price: 25197, salePrice: 19597, stock: 12 },
    ],
    inventoryKeys: [
      { key: 'EAFC25-STD-XXXX-XXXX-ORIGIN-01', keyType: 'LICENSE' },
      { key: 'EAFC25-STD-XXXX-XXXX-ORIGIN-02', keyType: 'LICENSE' },
      { key: 'EAFC25-ULT-XXXX-XXXX-ORIGIN-03', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'Steam Wallet — $50 Code',
    slug: 'steam-wallet-50',
    shortDesc: 'Add $50 to your Steam Wallet instantly. Use it on any game, DLC or in-game item.',
    description: 'Steam Wallet codes are a fast and secure way to add funds to your Steam account without a credit card. Use the balance to purchase games, DLCs, in-game items, soundtracks, and even hardware on the Steam store. Perfect as a gift or for personal use.',
    type: 'DIGITAL',
    categorySlug: 'gaming',
    basePrice: 14837, salePrice: 14000, sku: 'PB-STMWL-50',
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80',
    features: ['Instant digital delivery','Works on any Steam region','No expiry date','Perfect as a gift','No credit card required'],
    specifications: [{label:'Value',value:'$50 USD'},{label:'Region',value:'Global'},{label:'Delivery',value:'Digital code'}],
    faqs: [{q:'Why is the price slightly higher than $50?',a:'The small premium covers processing fees for instant delivery and 24/7 support.'}],
    tags: ['steam','wallet','gift','topup'],
    rating: 4.9, reviewsCount: 2156, salesCount: 14500, isBestSeller: true,
    deliveryMethod: 'INSTANT', licenseType: 'WALLET_CODE',
    variants: [
      { name: '$10', durationDays: 0, price: 3077.2, stock: 200 },
      { name: '$25', durationDays: 0, price: 7557, stock: 150 },
      { name: '$50', durationDays: 0, price: 14837, salePrice: 14000, stock: 80 },
      { name: '$100', durationDays: 0, price: 29397, salePrice: 27997, stock: 40 },
    ],
    inventoryKeys: [
      { key: 'STEAM-W50-XXXXXXXX-01', keyType: 'LICENSE' },
      { key: 'STEAM-W50-XXXXXXXX-02', keyType: 'LICENSE' },
      { key: 'STEAM-W50-XXXXXXXX-03', keyType: 'LICENSE' },
      { key: 'STEAM-W50-XXXXXXXX-04', keyType: 'LICENSE' },
      { key: 'STEAM-W50-XXXXXXXX-05', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'Xbox Game Pass Ultimate — 3 Months',
    slug: 'xbox-gpu-3m',
    shortDesc: '3 months of Xbox Game Pass Ultimate with 100+ games, EA Play, cloud gaming and Xbox Live Gold.',
    description: 'Xbox Game Pass Ultimate is the ultimate gaming subscription. Get access to over 100 high-quality games on console, PC, and cloud. Includes EA Play membership, Xbox Live Gold for online multiplayer, exclusive member discounts, day-one access to new Xbox Game Studios titles, and cloud gaming on supported devices.',
    type: 'SUBSCRIPTION',
    categorySlug: 'gaming',
    basePrice: 12597, salePrice: 10917, sku: 'PB-XBGPU-3M',
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    features: ['3 months of Game Pass Ultimate','100+ games on console, PC, cloud','EA Play included','Xbox Live Gold','Day-one Xbox releases','Cloud gaming on mobile'],
    specifications: [{label:'Platform',value:'Xbox / PC / Cloud'},{label:'Duration',value:'3 months'},{label:'Delivery',value:'Digital code'}],
    tags: ['xbox','subscription','game-pass','ea-play'],
    rating: 4.7, reviewsCount: 823, salesCount: 4500, isTrending: true, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'SUBSCRIPTION_CODE',
    variants: [
      { name: '1 Month', durationDays: 30, price: 4757.2, stock: 80 },
      { name: '3 Months', durationDays: 90, price: 12597, salePrice: 10917, stock: 50 },
      { name: '6 Months', durationDays: 180, price: 25197, salePrice: 20997, stock: 20 },
    ],
    inventoryKeys: [
      { key: 'XBGPU-3M-XXXXXXXX-01', keyType: 'LICENSE' },
      { key: 'XBGPU-3M-XXXXXXXX-02', keyType: 'LICENSE' },
      { key: 'XBGPU-3M-XXXXXXXX-03', keyType: 'LICENSE' },
    ],
  },

  // ===== SOFTWARE =====
  {
    title: 'Windows 11 Pro — Genuine License',
    slug: 'windows-11-pro',
    shortDesc: 'Lifetime genuine Windows 11 Pro OEM license with Microsoft activation guarantee.',
    description: 'Get a genuine Windows 11 Pro OEM license at a fraction of retail price. Each license is verified and comes with a Microsoft activation guarantee. Includes all Pro features: BitLocker, Remote Desktop, Hyper-V, Windows Sandbox, and Active Directory support. Perfect for personal or business use.',
    type: 'DIGITAL',
    categorySlug: 'software',
    basePrice: 55997, salePrice: 6997, sku: 'PB-W11PRO',
    imageUrl: 'https://images.unsplash.com/photo-1629654290458-8e6da9212d1f?w=800&q=80',
    features: ['Lifetime OEM license','Microsoft activation guarantee','All Pro features included','Instant digital delivery','24/7 activation support'],
    specifications: [{label:'Version',value:'Windows 11 Pro'},{label:'License Type',value:'OEM Lifetime'},{label:'Bit',value:'64-bit'},{label:'Languages',value:'All'}],
    faqs: [{q:'Is this a legitimate license?',a:'Yes — we source genuine OEM licenses through authorised Microsoft resellers.'},{q:'Will it survive a hardware upgrade?',a:'OEM licenses tie to the motherboard. For transferable licenses, please contact support.'}],
    tags: ['windows','os','microsoft','pro'],
    rating: 4.8, reviewsCount: 3421, salesCount: 18900, isBestSeller: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 2*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'OEM_LICENSE',
    variants: [
      { name: '1 PC Lifetime', durationDays: 0, price: 55997, salePrice: 6997, stock: 200 },
      { name: '2 PC Lifetime', durationDays: 0, price: 11197, salePrice: 11197, stock: 100 },
      { name: '5 PC Lifetime', durationDays: 0, price: 25197, salePrice: 22397, stock: 40 },
    ],
    inventoryKeys: [
      { key: 'W11PRO-OEM-XXXXXXXX-01', keyType: 'LICENSE' },
      { key: 'W11PRO-OEM-XXXXXXXX-02', keyType: 'LICENSE' },
      { key: 'W11PRO-OEM-XXXXXXXX-03', keyType: 'LICENSE' },
      { key: 'W11PRO-OEM-XXXXXXXX-04', keyType: 'LICENSE' },
      { key: 'W11PRO-OEM-XXXXXXXX-05', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'Microsoft Office 2024 Pro Plus',
    slug: 'office-2024-pro-plus',
    shortDesc: 'Lifetime license for Office 2024 Professional Plus — Word, Excel, PowerPoint, Outlook, Access and Publisher.',
    description: 'Microsoft Office 2024 Professional Plus is the latest perpetual Office suite. Includes Word, Excel, PowerPoint, Outlook, Access (PC only), and Publisher (PC only). One-time purchase, no subscriptions required. Activates on one PC or Mac for lifetime use.',
    type: 'DIGITAL',
    categorySlug: 'software',
    basePrice: 120397, salePrice: 13997, sku: 'PB-OFFICE24-PP',
    imageUrl: 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?w=800&q=80',
    features: ['Lifetime license — no subscription','Word, Excel, PowerPoint, Outlook','Access & Publisher (PC)','1 PC or Mac','Instant activation'],
    specifications: [{label:'Version',value:'2024 Pro Plus'},{label:'License Type',value:'Lifetime perpetual'},{label:'Languages',value:'All'}],
    faqs: [{q:'Does this work on Mac?',a:'Yes — Mac version is supported. Please specify during activation.'},{q:'Can I reinstall after format?',a:'Yes — licenses can be reactivated on the same device after format.'}],
    tags: ['office','microsoft','productivity','lifetime'],
    rating: 4.7, reviewsCount: 1834, salesCount: 9200, isBestSeller: true, isTrending: true,
    deliveryMethod: 'INSTANT', licenseType: 'PRODUCT_KEY',
    variants: [
      { name: '1 PC Lifetime', durationDays: 0, price: 120397, salePrice: 13997, stock: 150 },
      { name: '2 PC Lifetime', durationDays: 0, price: 22397, stock: 60 },
    ],
    inventoryKeys: [
      { key: 'OFC24-PP-XXXX-XXXX-01', keyType: 'LICENSE' },
      { key: 'OFC24-PP-XXXX-XXXX-02', keyType: 'LICENSE' },
      { key: 'OFC24-PP-XXXX-XXXX-03', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'NordVPN — 2 Year Subscription',
    slug: 'nordvpn-2yr',
    shortDesc: 'Secure your online activity with NordVPN — 2 year plan with 6 simultaneous connections.',
    description: 'NordVPN is one of the world\'s most trusted VPN services. With 5400+ servers in 60 countries, military-grade AES-256 encryption, a strict no-logs policy, Threat Protection Pro, and the lightning-fast NordLynx protocol, NordVPN keeps your data private and unlocks global content.',
    type: 'SUBSCRIPTION',
    categorySlug: 'software',
    basePrice: 80080, salePrice: 22120, sku: 'PB-NORD-2Y',
    imageUrl: 'https://images.unsplash.com/photo-1563167337398-8c6d4453a6c9?w=800&q=80',
    features: ['2 years of NordVPN Premium','Up to 6 simultaneous connections','5400+ servers in 60 countries','No-logs policy audited','Threat Protection Pro','NordLynx high-speed protocol'],
    specifications: [{label:'Plan',value:'2 Years'},{label:'Connections',value:'6 devices'},{label:'Servers',value:'5400+'}],
    faqs: [{q:'Can I use this on multiple devices?',a:'Yes — one license covers up to 6 simultaneous devices across platforms.'}],
    tags: ['vpn','privacy','security','subscription'],
    rating: 4.7, reviewsCount: 2104, salesCount: 7300, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'SUBSCRIPTION_CODE',
    variants: [
      { name: '1 Month', durationDays: 30, price: 3637.2, stock: 80 },
      { name: '1 Year', durationDays: 365, price: 16520, salePrice: 13720, stock: 60 },
      { name: '2 Years', durationDays: 730, price: 80080, salePrice: 22120, stock: 100 },
      { name: 'Lifetime', durationDays: 36500, price: 55720, stock: 5 },
    ],
    inventoryKeys: [
      { key: 'NORD-2Y-XXXX-XXXX-01', keyType: 'LICENSE' },
      { key: 'NORD-2Y-XXXX-XXXX-02', keyType: 'LICENSE' },
      { key: 'NORD-2Y-XXXX-XXXX-03', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'Adobe Creative Cloud — All Apps (1 Year)',
    slug: 'adobe-cc-all-1yr',
    shortDesc: 'Full Adobe Creative Cloud suite — Photoshop, Illustrator, Premiere Pro, After Effects and 20+ apps.',
    description: 'Get the entire Adobe Creative Cloud suite for one year at a discounted price. Includes Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, Lightroom, Acrobat Pro, Adobe Express, Adobe Fonts, 100GB cloud storage, and 20+ other creative apps. Perfect for designers, photographers, video editors and content creators.',
    type: 'SUBSCRIPTION',
    categorySlug: 'software',
    basePrice: 167966, salePrice: 92397, sku: 'PB-ACC-1Y',
    imageUrl: 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?w=800&q=80',
    features: ['1 year of Creative Cloud All Apps','20+ Adobe apps included','100GB cloud storage','Adobe Fonts library','Adobe Portfolio','Multi-device access'],
    specifications: [{label:'Apps',value:'20+ Creative Cloud apps'},{label:'Storage',value:'100GB cloud'},{label:'Plan',value:'Annual pre-paid'}],
    tags: ['adobe','design','creative','subscription'],
    rating: 4.6, reviewsCount: 921, salesCount: 3100, isFeatured: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 7*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'SUBSCRIPTION_CODE',
    variants: [
      { name: '1 Month', durationDays: 30, price: 16797, stock: 60 },
      { name: '1 Year', durationDays: 365, price: 167966, salePrice: 92397, stock: 30 },
    ],
    inventoryKeys: [
      { key: 'ACC-1Y-XXXX-XXXX-01', keyType: 'LICENSE' },
      { key: 'ACC-1Y-XXXX-XXXX-02', keyType: 'LICENSE' },
    ],
  },

  // ===== GIFT CARDS =====
  {
    title: 'Google Play Gift Card — $25',
    slug: 'google-play-25',
    shortDesc: 'Add $25 to your Google Play balance — use for apps, games, in-app purchases, books and more.',
    description: 'Google Play gift cards are the perfect way to add credit to your Google Play account. Use the balance to purchase apps, games, in-app items, movies, books, and subscriptions on the Google Play Store. Works on any Google account, region-free for supported countries.',
    type: 'DIGITAL',
    categorySlug: 'gift-cards',
    basePrice: 7837, salePrice: 7277, sku: 'PB-GPLAY-25',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    features: ['Instant digital delivery','Works on any Google account','No expiry','Use on apps, games, books, movies','Region-free'],
    specifications: [{label:'Value',value:'$25 USD'},{label:'Region',value:'Global (selected)'},{label:'Delivery',value:'Digital code'}],
    tags: ['google-play','gift-card','topup'],
    rating: 4.8, reviewsCount: 4231, salesCount: 23400, isBestSeller: true,
    deliveryMethod: 'INSTANT', licenseType: 'WALLET_CODE',
    variants: [
      { name: '$10', durationDays: 0, price: 3217.2, stock: 200 },
      { name: '$25', durationDays: 0, price: 7837, salePrice: 7277, stock: 100 },
      { name: '$50', durationDays: 0, price: 15397, stock: 80 },
      { name: '$100', durationDays: 0, price: 30797, stock: 40 },
    ],
    inventoryKeys: [
      { key: 'GPLAY-25-XXXXXXXX-01', keyType: 'LICENSE' },
      { key: 'GPLAY-25-XXXXXXXX-02', keyType: 'LICENSE' },
      { key: 'GPLAY-25-XXXXXXXX-03', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'iTunes / Apple Gift Card — $50',
    slug: 'apple-gift-50',
    shortDesc: '$50 Apple Gift Card — use for App Store, iTunes, Apple Music, iCloud+, and Apple hardware.',
    description: 'The unified Apple Gift Card can be used across the entire Apple ecosystem. Buy apps, games, music, movies, TV shows, books, Apple Music subscriptions, iCloud+ storage, and even Apple hardware. Delivered instantly to your email and account dashboard.',
    type: 'DIGITAL',
    categorySlug: 'gift-cards',
    basePrice: 14837, salePrice: 14277, sku: 'PB-APPL-50',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80',
    features: ['Instant digital delivery','Works on App Store, iTunes, Apple Music','Can be used for Apple hardware','Region-free for supported countries','No expiry'],
    specifications: [{label:'Value',value:'$50 USD'},{label:'Region',value:'Global'},{label:'Delivery',value:'Digital code'}],
    tags: ['apple','itunes','gift-card'],
    rating: 4.9, reviewsCount: 1872, salesCount: 9800, isTrending: true,
    deliveryMethod: 'INSTANT', licenseType: 'WALLET_CODE',
    variants: [
      { name: '$15', durationDays: 0, price: 4617.2, stock: 150 },
      { name: '$25', durationDays: 0, price: 7557, stock: 120 },
      { name: '$50', durationDays: 0, price: 14837, salePrice: 14277, stock: 80 },
      { name: '$100', durationDays: 0, price: 29397, stock: 30 },
    ],
    inventoryKeys: [
      { key: 'APPL-50-XXXXXXXX-01', keyType: 'LICENSE' },
      { key: 'APPL-50-XXXXXXXX-02', keyType: 'LICENSE' },
    ],
  },
  {
    title: 'Amazon Gift Card — $100',
    slug: 'amazon-gift-100',
    shortDesc: '$100 Amazon.com gift card — instantly delivered digital code.',
    description: 'Amazon gift cards can be used to purchase millions of items on Amazon.com including electronics, books, household goods, and digital content. No expiry, no fees, and accepted worldwide on supported Amazon marketplaces.',
    type: 'DIGITAL',
    categorySlug: 'gift-cards',
    basePrice: 29397, salePrice: 28837, sku: 'PB-AMZN-100',
    imageUrl: 'https://images.unsplash.com/photo-1523474253046-8e2743393d36?w=800&q=80',
    features: ['Instant digital delivery','No expiry date','Use on millions of products','Accepted on supported Amazon marketplaces','Perfect as a gift'],
    specifications: [{label:'Value',value:'$100 USD'},{label:'Region',value:'US'},{label:'Delivery',value:'Digital code'}],
    tags: ['amazon','gift-card','shopping'],
    rating: 4.9, reviewsCount: 982, salesCount: 5400, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'WALLET_CODE',
    variants: [
      { name: '$25', durationDays: 0, price: 7557, stock: 100 },
      { name: '$50', durationDays: 0, price: 14837, stock: 80 },
      { name: '$100', durationDays: 0, price: 29397, salePrice: 28837, stock: 60 },
    ],
    inventoryKeys: [
      { key: 'AMZN-100-XXXXXXXX-01', keyType: 'LICENSE' },
      { key: 'AMZN-100-XXXXXXXX-02', keyType: 'LICENSE' },
    ],
  },

  // ===== STREAMING =====
  {
    title: 'Netflix Premium — 1 Month (4K UHD)',
    slug: 'netflix-premium-1m',
    shortDesc: '1 month of Netflix Premium with 4K UHD streaming on 4 devices simultaneously.',
    description: 'Netflix Premium plan offers the highest streaming quality available — up to 4K Ultra HD with HDR and Dolby Atmos on supported titles. Watch on 4 screens simultaneously, download on 6 devices, and access the entire Netflix library of movies, TV shows, documentaries, and Netflix Originals.',
    type: 'SUBSCRIPTION',
    categorySlug: 'streaming',
    basePrice: 6437, salePrice: 4197.2, sku: 'PB-NFLX-1M',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe7a?w=800&q=80',
    features: ['1 month Netflix Premium','4K UHD + HDR streaming','4 simultaneous streams','Downloads on 6 devices','All Netflix Originals included'],
    specifications: [{label:'Plan',value:'Premium 4K'},{label:'Duration',value:'1 month'},{label:'Devices',value:'4 streams'}],
    faqs: [{q:'Is this a shared account?',a:'You receive a private Premium slot with full 4K streaming access on your own profile.'}],
    tags: ['netflix','streaming','4k','subscription'],
    rating: 4.7, reviewsCount: 1521, salesCount: 8200, isBestSeller: true, isDeal: true, isTrending: true,
    dealEndsAt: new Date(Date.now() + 1*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'ACCOUNT_CREDENTIALS',
    variants: [
      { name: '1 Month', durationDays: 30, price: 6437, salePrice: 4197.2, stock: 50 },
      { name: '3 Months', durationDays: 90, price: 18197, salePrice: 11197, stock: 30 },
      { name: '12 Months', durationDays: 365, price: 55720, salePrice: 41720, stock: 15 },
    ],
    inventoryKeys: [
      { key: 'NFLX-P1M-EMAIL:PW-01', keyType: 'ACCOUNT' },
      { key: 'NFLX-P1M-EMAIL:PW-02', keyType: 'ACCOUNT' },
    ],
  },
  {
    title: 'Spotify Premium — 3 Months',
    slug: 'spotify-premium-3m',
    shortDesc: '3 months of Spotify Premium — ad-free music, offline downloads, and high-quality audio.',
    description: 'Spotify Premium gives you ad-free music streaming, offline downloads, unlimited skips, high-quality audio (up to 320kbps), and Spotify Connect for streaming to compatible speakers. Access over 100 million songs and 5 million podcasts on any device.',
    type: 'SUBSCRIPTION',
    categorySlug: 'streaming',
    basePrice: 9232, salePrice: 5597, sku: 'PB-SPOT-3M',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-fbf48c2a13ab?w=800&q=80',
    features: ['3 months of Spotify Premium','Ad-free listening','Offline downloads','High-quality audio 320kbps','Spotify Connect support'],
    specifications: [{label:'Plan',value:'Premium Individual'},{label:'Duration',value:'3 months'},{label:'Region',value:'Global'}],
    tags: ['spotify','music','premium','subscription'],
    rating: 4.8, reviewsCount: 2104, salesCount: 12400, isBestSeller: true, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'ACCOUNT_CREDENTIALS',
    variants: [
      { name: '1 Month', durationDays: 30, price: 3357.2, stock: 80 },
      { name: '3 Months', durationDays: 90, price: 9232, salePrice: 5597, stock: 60 },
      { name: '6 Months', durationDays: 180, price: 18463, salePrice: 9797, stock: 30 },
      { name: '12 Months', durationDays: 365, price: 36926, salePrice: 18197, stock: 20 },
    ],
    inventoryKeys: [
      { key: 'SPOT-P3M-EMAIL:PW-01', keyType: 'ACCOUNT' },
      { key: 'SPOT-P3M-EMAIL:PW-02', keyType: 'ACCOUNT' },
    ],
  },
  {
    title: 'Disney+ Premium — 1 Year',
    slug: 'disney-plus-1yr',
    shortDesc: '12 months of Disney+ Premium with 4K UHD streaming on 4 devices.',
    description: 'Disney+ Premium offers a full year of access to the entire Disney, Pixar, Marvel, Star Wars, and National Geographic library. Includes new release movies, exclusive Originals, and 4K UHD streaming on 4 devices simultaneously. Perfect for families and fans of any Disney franchise.',
    type: 'SUBSCRIPTION',
    categorySlug: 'streaming',
    basePrice: 44797, salePrice: 27997, sku: 'PB-DSP-1Y',
    imageUrl: 'https://images.unsplash.com/photo-1521903101605-0a8d2c8b7ef8?w=800&q=80',
    features: ['12 months Disney+ Premium','4K UHD + HDR streaming','4 simultaneous streams','Downloads on 10 devices','All Disney+ Originals'],
    specifications: [{label:'Plan',value:'Premium 4K'},{label:'Duration',value:'12 months'},{label:'Devices',value:'4 streams'}],
    tags: ['disney','streaming','4k','subscription','family'],
    rating: 4.7, reviewsCount: 642, salesCount: 4100, isTrending: true,
    deliveryMethod: 'INSTANT', licenseType: 'ACCOUNT_CREDENTIALS',
    variants: [
      { name: '1 Month', durationDays: 30, price: 3917.2, stock: 80 },
      { name: '1 Year', durationDays: 365, price: 44797, salePrice: 27997, stock: 25 },
    ],
    inventoryKeys: [
      { key: 'DSP-1Y-EMAIL:PW-01', keyType: 'ACCOUNT' },
    ],
  },
  {
    title: 'YouTube Premium — 6 Months',
    slug: 'youtube-premium-6m',
    shortDesc: '6 months of YouTube Premium + YouTube Music Premium — ad-free videos, background play, downloads.',
    description: 'YouTube Premium gives you an ad-free experience across YouTube, background play on mobile, downloads for offline viewing, and access to YouTube Originals. Includes YouTube Music Premium — ad-free music streaming with downloads and background play.',
    type: 'SUBSCRIPTION',
    categorySlug: 'streaming',
    basePrice: 20143, salePrice: 11197, sku: 'PB-YTP-6M',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    features: ['6 months YouTube Premium','Ad-free videos','Background play','Offline downloads','YouTube Music Premium included','YouTube Originals'],
    specifications: [{label:'Plan',value:'Premium Individual'},{label:'Duration',value:'6 months'}],
    tags: ['youtube','streaming','music','subscription'],
    rating: 4.6, reviewsCount: 421, salesCount: 2100,
    deliveryMethod: 'INSTANT', licenseType: 'ACCOUNT_CREDENTIALS',
    variants: [
      { name: '1 Month', durationDays: 30, price: 3917.2, stock: 60 },
      { name: '6 Months', durationDays: 180, price: 20143, salePrice: 11197, stock: 30 },
      { name: '12 Months', durationDays: 365, price: 40286, salePrice: 20997, stock: 15 },
    ],
    inventoryKeys: [
      { key: 'YTP-6M-EMAIL:PW-01', keyType: 'ACCOUNT' },
    ],
  },

  // ===== IPTV =====
  {
    title: 'Premium IPTV — 12 Months Subscription',
    slug: 'iptv-12m-premium',
    shortDesc: '12,000+ live HD/4K channels, 80,000+ VOD movies and series, with multi-device support.',
    description: 'Our Premium IPTV subscription gives you access to over 12,000 live HD/4K channels from around the world, including sports, movies, TV shows, news, kids, and entertainment. Includes 80,000+ VOD titles, multi-device support, EPG guide, and 99.9% uptime guarantee. Works on Smart TV, Android, iOS, Firestick, MAG, and PC.',
    type: 'SUBSCRIPTION',
    categorySlug: 'iptv',
    basePrice: 33597, salePrice: 19597, sku: 'PB-IPTV-12M',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a2055888d3f1?w=800&q=80',
    features: ['12,000+ live HD/4K channels','80,000+ VOD titles','Multi-device support','EPG programme guide','Anti-freeze technology','99.9% uptime SLA','24/7 live support'],
    specifications: [{label:'Channels',value:'12,000+'},{label:'VOD',value:'80,000+'},{label:'Devices',value:'Smart TV, Android, iOS, Firestick, MAG, PC'},{label:'Quality',value:'HD / 4K'}],
    faqs: [{q:'Is this legal?',a:'We only provide M3U playlist URLs and credentials. The legality of streaming depends on your jurisdiction. Please check local laws.'},{q:'Can I use this on multiple devices?',a:'Standard plans support 1 connection. Multi-connection plans available — contact support.'}],
    tags: ['iptv','streaming','live-tv','4k','subscription'],
    rating: 4.7, reviewsCount: 823, salesCount: 5600, isBestSeller: true, isTrending: true, isFeatured: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 4*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'M3U_PLAYLIST',
    variants: [
      { name: '1 Month', durationDays: 30, price: 4197.2, stock: 80 },
      { name: '3 Months', durationDays: 90, price: 9797, salePrice: 8397, stock: 60 },
      { name: '6 Months', durationDays: 180, price: 16797, salePrice: 13997, stock: 40 },
      { name: '12 Months', durationDays: 365, price: 33597, salePrice: 19597, stock: 50 },
    ],
    inventoryKeys: [
      { key: 'IPTV-12M-USER:PASS-01|M3U:https://m3u.playbeat.example/playlist/abc123.m3u', keyType: 'M3U' },
      { key: 'IPTV-12M-USER:PASS-02|M3U:https://m3u.playbeat.example/playlist/def456.m3u', keyType: 'M3U' },
      { key: 'IPTV-12M-USER:PASS-03|M3U:https://m3u.playbeat.example/playlist/ghi789.m3u', keyType: 'M3U' },
    ],
  },
  {
    title: 'Sports IPTV Pack — 6 Months',
    slug: 'iptv-sports-6m',
    shortDesc: 'All major sports channels including beIN, Sky Sports, ESPN, BT Sport, and TSN with 60fps streaming.',
    description: 'A dedicated sports-focused IPTV package with every major sports network worldwide. Includes beIN Sports (all regions), Sky Sports, BT Sport, ESPN, TSN, DAZN, and 200+ league-specific channels. Watch live football, cricket, F1, NBA, NFL, UFC, tennis, and more in up to 60fps Full HD.',
    type: 'SUBSCRIPTION',
    categorySlug: 'iptv',
    basePrice: 18197, salePrice: 11197, sku: 'PB-IPTV-SP6',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
    features: ['6 months Sports IPTV','beIN Sports all regions','Sky Sports, BT Sport, ESPN','200+ sports channels','60fps Full HD streaming','Multi-device support'],
    specifications: [{label:'Channels',value:'200+ sports'},{label:'Quality',value:'60fps FHD'},{label:'Duration',value:'6 months'}],
    tags: ['iptv','sports','streaming','football'],
    rating: 4.6, reviewsCount: 412, salesCount: 2800, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'M3U_PLAYLIST',
    variants: [
      { name: '1 Month', durationDays: 30, price: 3637.2, stock: 60 },
      { name: '3 Months', durationDays: 90, price: 8397, stock: 50 },
      { name: '6 Months', durationDays: 180, price: 18197, salePrice: 11197, stock: 40 },
    ],
    inventoryKeys: [
      { key: 'IPTV-SP6-USER:PASS-01|M3U:https://m3u.playbeat.example/sports/abc123.m3u', keyType: 'M3U' },
      { key: 'IPTV-SP6-USER:PASS-02|M3U:https://m3u.playbeat.example/sports/def456.m3u', keyType: 'M3U' },
    ],
  },

  // ===== SMART PROJECTORS (real Magcubic products from zerobyte.store) =====
  {
    title: 'Magcubic HY300 PRO',
    slug: 'magcubic-hy300-pro',
    shortDesc: '290 ANSI, Manual Focus, Android 14, 8K support, Dual Wi-Fi 6, BT 5.4 Projector.',
    description: 'The Magcubic HY300 PRO is a powerful portable smart projector featuring 290 ANSI lumens brightness, manual focus, Android 14.0 OS, and 8K video decoding support. With native 1280x720P resolution (supports up to 1080p/2K/4K decoding via HD signal), dual Wi-Fi 6 (2.4G + 5G), and Bluetooth 5.4, this projector delivers crisp images and seamless streaming. Built-in 1/4 screw hole for tripod mounting, HDMI input, and remote controller included. Perfect for home cinema, gaming, and outdoor movie nights.',
    type: 'DIGITAL',
    categorySlug: 'smart-projectors',
    basePrice: 24750, salePrice: null, sku: 'PB-MGC-HY300PRO',
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
    rating: 4.7, reviewsCount: 312, salesCount: 1840, isFeatured: true, isBestSeller: true, isTrending: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 24750, stock: 30 },
      { name: 'With Tripod', durationDays: 0, price: 26500, stock: 15 },
      { name: 'With 80" Screen + Tripod', durationDays: 0, price: 34500, stock: 8 },
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
    basePrice: 24750, salePrice: null, sku: 'PB-MGC-HY300PLUS',
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
    rating: 4.6, reviewsCount: 184, salesCount: 920, isFeatured: true, isTrending: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 24750, stock: 25 },
      { name: 'With Free Tripod', durationDays: 0, price: 26500, stock: 12 },
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
    basePrice: 29150, salePrice: null, sku: 'PB-MGC-HY300PROPLUS',
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
    rating: 4.8, reviewsCount: 247, salesCount: 1380, isFeatured: true, isBestSeller: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 5*24*60*60*1000),
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 29150, stock: 20 },
      { name: 'With Tripod + Carry Case', durationDays: 0, price: 32999, stock: 10 },
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
    basePrice: 29150, salePrice: null, sku: 'PB-MGC-HT23',
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
      { name: 'Single Unit', durationDays: 0, price: 29150, stock: 22 },
      { name: 'With Free HDMI Cable', durationDays: 0, price: 29999, stock: 15 },
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
    basePrice: 37950, salePrice: null, sku: 'PB-MGC-HCS350PRO',
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
    rating: 4.7, reviewsCount: 198, salesCount: 870, isFeatured: true, isBestSeller: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 3*24*60*60*1000),
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit (White)', durationDays: 0, price: 37950, stock: 18 },
      { name: 'Single Unit (Black)', durationDays: 0, price: 37950, stock: 12 },
      { name: 'Bundle with 100" Screen', durationDays: 0, price: 49999, stock: 6 },
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
    basePrice: 42900, salePrice: null, sku: 'PB-MGC-HM103A',
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
    rating: 4.9, reviewsCount: 89, salesCount: 410, isFeatured: true, isBestSeller: true, isTrending: true,
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit (White)', durationDays: 0, price: 42900, stock: 15 },
      { name: 'With Soundbar Bundle', durationDays: 0, price: 49999, stock: 8 },
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
    basePrice: 48950, salePrice: null, sku: 'PB-MGC-HY7',
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
    rating: 4.6, reviewsCount: 234, salesCount: 1120, isFeatured: true, isTrending: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 7*24*60*60*1000),
    deliveryMethod: 'MANUAL', licenseType: 'PHYSICAL_PRODUCT',
    variants: [
      { name: 'Single Unit', durationDays: 0, price: 48950, stock: 12 },
      { name: 'With Carry Bag + Tripod', durationDays: 0, price: 52999, stock: 6 },
      { name: 'With 80" Outdoor Screen', durationDays: 0, price: 57999, stock: 4 },
    ],
    inventoryKeys: [
      { key: 'PB-MGC-HY7-SN-0001', keyType: 'LICENSE' },
      { key: 'PB-MGC-HY7-SN-0002', keyType: 'LICENSE' },
    ],
  },

  // ===== WEB3 =====
  {
    title: 'Crypto Wallet Setup + Security Audit',
    slug: 'crypto-wallet-setup',
    shortDesc: 'Professional setup of a secure multi-currency wallet with hardware integration and security audit.',
    description: 'Get a professionally configured crypto wallet with hardware (Ledger/Trezor) integration, multi-sig setup, and a complete security audit. Includes wallet installation, secure backup configuration, integration with Ledger/Trezor, phishing protection setup, and a 30-minute security consultation.',
    type: 'SERVICE',
    categorySlug: 'web3',
    basePrice: 27720, salePrice: 13720, sku: 'PB-W3-WALLET',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    features: ['Multi-currency wallet setup','Hardware wallet integration','Multi-sig security setup','Phishing protection','Secure backup configuration','30-min consultation'],
    specifications: [{label:'Wallets',value:'MetaMask, Trust, Ledger, Trezor'},{label:'Coins',value:'BTC, ETH, SOL, USDT + ERC-20'}],
    tags: ['crypto','wallet','web3','security'],
    rating: 4.5, reviewsCount: 47, salesCount: 180,
    deliveryMethod: 'SCHEDULED', licenseType: 'SERVICE_ORDER',
    variants: [
      { name: 'Software Wallet', durationDays: 0, price: 13720, stock: 30 },
      { name: 'Hardware + Software', durationDays: 0, price: 27720, salePrice: 13720, stock: 20 },
      { name: 'Enterprise Multi-sig', durationDays: 0, price: 83720, stock: 5 },
    ],
    inventoryKeys: [],
  },
  {
    title: 'NFT Mint Smart Contract — ERC-721',
    slug: 'nft-mint-contract',
    shortDesc: 'Custom ERC-721 NFT minting smart contract with whitelist, presale, and metadata hosting.',
    description: 'Get a custom-deployed ERC-721 NFT smart contract with all modern features: whitelist (Merkle proof), presale and public sale phases, dynamic pricing, metadata hosting on IPFS, OpenSea compatibility, and full contract ownership transfer. Includes deployment on mainnet or testnet.',
    type: 'SERVICE',
    categorySlug: 'web3',
    basePrice: 167720, salePrice: 83720, sku: 'PB-W3-NFT',
    imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80',
    features: ['Custom ERC-721 contract','Whitelist with Merkle proofs','Presale + public sale phases','IPFS metadata hosting','OpenSea compatible','Royalties configuration','Contract ownership transfer','Deployment on mainnet/testnet'],
    specifications: [{label:'Standard',value:'ERC-721'},{label:'Blockchain',value:'Ethereum / Polygon / Arbitrum'},{label:'Delivery',value:'7 business days'}],
    tags: ['nft','smart-contract','web3','ethereum'],
    rating: 4.7, reviewsCount: 38, salesCount: 120,
    deliveryMethod: 'SCHEDULED', licenseType: 'SERVICE_ORDER',
    variants: [
      { name: 'Testnet Deployment', durationDays: 0, price: 55720, stock: 20 },
      { name: 'Mainnet Deployment', durationDays: 0, price: 167720, salePrice: 83720, stock: 10 },
    ],
    inventoryKeys: [],
  },

  // ===== SERVICES =====
  {
    title: 'Custom Logo Design — 5 Concepts',
    slug: 'logo-design-5',
    shortDesc: '5 custom logo concepts with unlimited revisions and full source files.',
    description: 'Professional logo design service. Our award-winning designers create 5 unique logo concepts based on your brief, with unlimited revisions on the chosen concept. Final delivery includes AI, EPS, PDF, PNG, JPG, and SVG formats in full color, black, and white variants.',
    type: 'SERVICE',
    categorySlug: 'services',
    basePrice: 55720, salePrice: 24920, sku: 'PB-SVC-LOGO',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    features: ['5 custom logo concepts','Unlimited revisions','Full source files (AI, EPS, PDF, SVG, PNG, JPG)','Black/white/color variants','3-5 day delivery','100% ownership rights'],
    specifications: [{label:'Concepts',value:'5'},{label:'Revisions',value:'Unlimited'},{label:'Delivery',value:'3-5 days'},{label:'Files',value:'AI, EPS, PDF, SVG, PNG, JPG'}],
    tags: ['logo','design','branding','services'],
    rating: 4.8, reviewsCount: 234, salesCount: 1100, isBestSeller: true, isFeatured: true,
    deliveryMethod: 'SCHEDULED', licenseType: 'SERVICE_ORDER',
    variants: [
      { name: '5 Concepts', durationDays: 0, price: 55720, salePrice: 24920, stock: 30 },
      { name: '10 Concepts + Brand Guide', durationDays: 0, price: 111720, salePrice: 55720, stock: 15 },
    ],
    inventoryKeys: [],
  },
  {
    title: 'WordPress Website Development',
    slug: 'wp-site-dev',
    shortDesc: 'Custom WordPress website with premium theme, plugins, security hardening, and 30 days support.',
    description: 'Get a fully custom WordPress website built by experienced developers. Includes premium theme (value $59), essential premium plugins ($200+ value), SSL setup, security hardening, SEO optimisation, contact form setup, 5 pages of content upload, and 30 days of post-launch support.',
    type: 'SERVICE',
    categorySlug: 'services',
    basePrice: 223720, salePrice: 111720, sku: 'PB-SVC-WP',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    features: ['Custom WordPress website','Premium theme included','Premium plugins ($200+ value)','Security hardening','SEO optimisation','SSL setup','5 pages content upload','30 days post-launch support'],
    specifications: [{label:'Pages',value:'5'},{label:'Delivery',value:'10-14 days'},{label:'Support',value:'30 days'}],
    tags: ['wordpress','development','website','services'],
    rating: 4.7, reviewsCount: 87, salesCount: 320, isTrending: true,
    deliveryMethod: 'SCHEDULED', licenseType: 'SERVICE_ORDER',
    variants: [
      { name: '5 Page Site', durationDays: 0, price: 223720, salePrice: 111720, stock: 10 },
      { name: '10 Page + E-commerce', durationDays: 0, price: 419720, salePrice: 223720, stock: 5 },
    ],
    inventoryKeys: [],
  },

  // ===== SUBSCRIPTIONS =====
  {
    title: 'ChatGPT Plus — 1 Month',
    slug: 'chatgpt-plus-1m',
    shortDesc: '1 month of ChatGPT Plus with GPT-4, DALL-E 3, advanced data analysis, and priority access.',
    description: 'ChatGPT Plus gives you priority access to OpenAI\'s most advanced models including GPT-4, GPT-4 Turbo, and GPT-4o. Includes DALL-E 3 image generation, advanced data analysis with code execution, file uploads, web browsing, and faster response times even during peak hours.',
    type: 'SUBSCRIPTION',
    categorySlug: 'subscriptions',
    basePrice: 6997, salePrice: 4757.2, sku: 'PB-SUB-GPT1M',
    imageUrl: 'https://images.unsplash.com/photo-1620712940745-6cd2e2c51913?w=800&q=80',
    features: ['1 month ChatGPT Plus','Access to GPT-4 and GPT-4o','DALL-E 3 image generation','Advanced data analysis','File uploads','Web browsing','Priority response speed'],
    specifications: [{label:'Plan',value:'Plus Individual'},{label:'Duration',value:'1 month'},{label:'Region',value:'Global'}],
    tags: ['chatgpt','openai','ai','subscription'],
    rating: 4.8, reviewsCount: 1421, salesCount: 9800, isBestSeller: true, isTrending: true,
    deliveryMethod: 'INSTANT', licenseType: 'ACCOUNT_CREDENTIALS',
    variants: [
      { name: '1 Month', durationDays: 30, price: 6997, salePrice: 4757.2, stock: 60 },
      { name: '3 Months', durationDays: 90, price: 20992, salePrice: 13997, stock: 30 },
      { name: '12 Months', durationDays: 365, price: 83966, salePrice: 50397, stock: 15 },
    ],
    inventoryKeys: [
      { key: 'GPT-P1M-EMAIL:PW-01', keyType: 'ACCOUNT' },
      { key: 'GPT-P1M-EMAIL:PW-02', keyType: 'ACCOUNT' },
    ],
  },
  {
    title: 'Notion Plus — 1 Year',
    slug: 'notion-plus-1y',
    shortDesc: '12 months of Notion Plus for individuals — unlimited blocks, file uploads, and version history.',
    description: 'Notion Plus is the perfect plan for individuals and small teams. Get unlimited blocks and pages, unlimited file uploads with no size limit, 30-day version history, advanced permissions, and API access. Perfect for personal productivity, project management, and knowledge bases.',
    type: 'SUBSCRIPTION',
    categorySlug: 'subscriptions',
    basePrice: 26880, salePrice: 16520, sku: 'PB-SUB-NOT1Y',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042973ab?w=800&q=80',
    features: ['12 months Notion Plus','Unlimited blocks and pages','Unlimited file uploads','30-day version history','Advanced permissions','API access','Priority support'],
    specifications: [{label:'Plan',value:'Plus Individual'},{label:'Duration',value:'12 months'},{label:'Members',value:'1'}],
    tags: ['notion','productivity','saas','subscription'],
    rating: 4.7, reviewsCount: 482, salesCount: 2100, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'ACCOUNT_CREDENTIALS',
    variants: [
      { name: '1 Month', durationDays: 30, price: 2797.2, stock: 80 },
      { name: '1 Year', durationDays: 365, price: 26880, salePrice: 16520, stock: 30 },
    ],
    inventoryKeys: [
      { key: 'NOT-1Y-EMAIL:PW-01', keyType: 'ACCOUNT' },
    ],
  },

  // ===== DIGITAL DOWNLOADS =====
  {
    title: '500 Lightroom Presets — Pro Bundle',
    slug: 'lightroom-presets-500',
    shortDesc: '500 professional Lightroom presets for portraits, landscapes, weddings, and travel photography.',
    description: 'A massive bundle of 500 professional Lightroom presets covering every photography style. Includes 80 portrait presets, 70 landscape presets, 50 wedding presets, 60 travel presets, 40 film-emulation presets, 50 HDR presets, 50 B&W presets, and 100 creative effects. Compatible with desktop and mobile Lightroom.',
    type: 'DOWNLOAD',
    categorySlug: 'digital-downloads',
    basePrice: 22120, salePrice: 5320, sku: 'PB-DL-LR500',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
    features: ['500 professional presets','Categories: portrait, landscape, wedding, travel, film, HDR, B&W, creative','Desktop + mobile compatible','One-click installation','PDF guide included','Lifetime ownership and updates'],
    specifications: [{label:'Format',value:'XMP + DNG'},{label:'Compatibility',value:'Lightroom CC, Classic, Mobile'},{label:'License',value:'Personal + commercial'}],
    tags: ['lightroom','presets','photography','download'],
    rating: 4.6, reviewsCount: 612, salesCount: 4500, isBestSeller: true, isDeal: true,
    dealEndsAt: new Date(Date.now() + 2*24*60*60*1000),
    deliveryMethod: 'INSTANT', licenseType: 'DOWNLOAD_LINK',
    variants: [
      { name: '500 Presets Bundle', durationDays: 0, price: 22120, salePrice: 5320, stock: 200 },
      { name: '1000 Presets Mega Bundle', durationDays: 0, price: 41720, salePrice: 10920, stock: 100 },
    ],
    inventoryKeys: [
      { key: 'https://download.playbeat.example/lr500/abc123.zip', keyType: 'DOWNLOAD' },
    ],
  },
  {
    title: 'After Effects Templates — 50 Pack',
    slug: 'ae-templates-50',
    shortDesc: '50 premium After Effects templates for intros, logos, social media, and promos.',
    description: 'A bundle of 50 premium After Effects templates for video editors. Includes 10 logo reveals, 10 intro templates, 10 social media story templates, 10 promo/corporate templates, and 10 motion graphics packs. All templates are fully customisable with editable text, colors, and media placeholders.',
    type: 'DOWNLOAD',
    categorySlug: 'digital-downloads',
    basePrice: 36120, salePrice: 10920, sku: 'PB-DL-AE50',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    features: ['50 premium AE templates','Logo reveals, intros, social, promos','Fully customisable','No plugins required (most)','CC 2021+ compatible','Tutorial videos included','Lifetime updates'],
    specifications: [{label:'Software',value:'After Effects CC 2021+'},{label:'Resolution',value:'4K ready'},{label:'Format',value:'.aep'}],
    tags: ['after-effects','templates','video','download'],
    rating: 4.7, reviewsCount: 234, salesCount: 1100, isFeatured: true,
    deliveryMethod: 'INSTANT', licenseType: 'DOWNLOAD_LINK',
    variants: [
      { name: '50 Templates', durationDays: 0, price: 36120, salePrice: 10920, stock: 80 },
      { name: '150 Templates Mega', durationDays: 0, price: 83720, salePrice: 24920, stock: 30 },
    ],
    inventoryKeys: [
      { key: 'https://download.playbeat.example/ae50/xyz789.zip', keyType: 'DOWNLOAD' },
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
  { code: 'GAMING20', description: '20% off gaming category', type: 'PERCENTAGE', value: 20, categorySlugs: '["gaming"]', usageLimit: 300, isActive: true },
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
