'use client'

import { Facebook, Instagram, Youtube, Twitter, Send, MessageCircle, Mail, Phone, MapPin, Shield, Zap, CreditCard, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'

export function Footer() {
  const { setSelectedCategory, setView, openModal } = useStore()
  const openCat = (slug: string) => {
    setSelectedCategory(slug)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-16 bg-navy text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center"><Shield className="text-yellow" size={20} /></div>
            <div><div className="font-semibold text-sm">Secure Checkout</div><div className="text-xs text-white/60">SSL encrypted payments</div></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center"><Zap className="text-yellow" size={20} /></div>
            <div><div className="font-semibold text-sm">Instant Delivery</div><div className="text-xs text-white/60">Auto-fulfilled in seconds</div></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center"><CreditCard className="text-yellow" size={20} /></div>
            <div><div className="font-semibold text-sm">Multiple Payment Methods</div><div className="text-xs text-white/60">Stripe, JazzCash, Easypaisa, Bank</div></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center"><MessageCircle className="text-yellow" size={20} /></div>
            <div><div className="font-semibold text-sm">24/7 Support</div><div className="text-xs text-white/60">Chat, email & WhatsApp</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand + newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow flex items-center justify-center">
                <Zap className="text-navy" fill="currentColor" size={20} />
              </div>
              <div>
                <div className="font-extrabold text-lg leading-none" style={{ fontFamily: 'var(--font-display), system-ui' }}>PlayBeat</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-yellow">Digital</div>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-sm mb-4">
              Premium digital products marketplace. Gaming keys, software licenses, gift cards, streaming subscriptions, IPTV, web hosting and more — delivered instantly with 24/7 support.
            </p>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2"><Mail size={14} className="text-yellow" /> support@playbeat.digital</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-yellow" /> +92 300 0000000</div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-yellow" /> Karachi, Pakistan</div>
            </div>

            {/* Newsletter */}
            <form onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!') }} className="mt-4 flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Your email for exclusive deals"
                className="flex-1 h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow"
              />
              <button type="submit" className="h-10 px-4 rounded-lg bg-yellow text-navy font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-1">
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-yellow">Categories</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><button onClick={() => openCat('gaming')} className="hover:text-yellow transition-colors">Gaming</button></li>
              <li><button onClick={() => openCat('software')} className="hover:text-yellow transition-colors">Software</button></li>
              <li><button onClick={() => openCat('gift-cards')} className="hover:text-yellow transition-colors">Gift Cards</button></li>
              <li><button onClick={() => openCat('streaming')} className="hover:text-yellow transition-colors">Streaming</button></li>
              <li><button onClick={() => openCat('iptv')} className="hover:text-yellow transition-colors">IPTV</button></li>
              <li><button onClick={() => openCat('smart-projectors')} className="hover:text-yellow transition-colors">Smart Projectors</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-yellow">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><button onClick={() => openCat('all')} className="hover:text-yellow transition-colors">All Products</button></li>
              <li><button onClick={() => openModal({ type: 'support' })} className="hover:text-yellow transition-colors">Support Center</button></li>
              <li><button onClick={() => openModal({ type: 'account', tab: 'orders' })} className="hover:text-yellow transition-colors">Track Order</button></li>
              <li><button className="hover:text-yellow transition-colors">About Us</button></li>
              <li><button className="hover:text-yellow transition-colors">Become a Vendor</button></li>
              <li><button className="hover:text-yellow transition-colors">Affiliate Program</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-yellow">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><button className="hover:text-yellow transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-yellow transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-yellow transition-colors">Refund Policy</button></li>
              <li><button className="hover:text-yellow transition-colors">Cookie Policy</button></li>
              <li><button className="hover:text-yellow transition-colors">DMCA</button></li>
              <li><button className="hover:text-yellow transition-colors">Compliance</button></li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-yellow">We Accept</h4>
            <div className="grid grid-cols-3 gap-2">
              {['VISA', 'MC', 'AMEX', 'STRIPE', 'JC', 'EP'].map((p) => (
                <div key={p} className="h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/80">
                  {p}
                </div>
              ))}
            </div>
            <h4 className="font-bold text-sm mt-6 mb-3 uppercase tracking-wider text-yellow">Follow Us</h4>
            <div className="flex gap-2">
              {[Facebook, Instagram, Youtube, Twitter, MessageCircle].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-yellow hover:text-navy transition-colors flex items-center justify-center">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} PlayBeat Digital. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>🔒 SSL Secured</span>
            <span>⚡ Instant Delivery</span>
            <span>🌍 Worldwide Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ---------- Category filter bar ----------
import { cn } from '@/lib/utils'

export function CategoryFilterBar() {
  const { categories, selectedCategory, setSelectedCategory } = useStore()

  const cats = [{ id: 'all', name: 'All', slug: 'all', imageUrl: '' }, ...categories]

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {cats.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={cn(
              'px-4 h-9 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
              selectedCategory === cat.slug
                ? 'bg-navy text-white dark:bg-yellow dark:text-navy'
                : 'bg-muted text-foreground/80 hover:bg-muted/70'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
