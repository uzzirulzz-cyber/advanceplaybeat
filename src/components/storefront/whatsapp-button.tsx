'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showInitial, setShowInitial] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowInitial(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const phoneNumber = '923321029333' // WhatsApp number with country code, no +
  const defaultMessage = encodeURIComponent("Hi PlayBeat Digital! I'm interested in your products. Can you help me?")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-2xl shadow-card-hover p-4 max-w-xs border border-border relative animate-in fade-in slide-in-from-right-4 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center"
            aria-label="Close"
          >
            <X size={12} />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground">Chat with us on WhatsApp!</div>
              <p className="text-xs text-muted-foreground mt-1">
                Quick replies for orders, product info, technical support and instant quotes. Available 9am - 11pm PKT.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle size={12} fill="currentColor" /> Start Chat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div className="relative">
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />

        {/* Initial popup bubble */}
        {showInitial && !showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 mr-2 whitespace-nowrap bg-white dark:bg-slate-800 text-foreground text-xs font-medium shadow-card-hover px-3 py-2 rounded-full border border-border animate-in fade-in slide-in-from-bottom-2 duration-500">
            👋 Need help? Chat with us!
            <button onClick={() => setShowInitial(false)} className="ml-2 text-muted-foreground hover:text-foreground">×</button>
          </div>
        )}

        <button
          onClick={() => { setShowTooltip(!showTooltip); setShowInitial(false) }}
          className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-card-hover flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          {/* WhatsApp SVG icon */}
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
