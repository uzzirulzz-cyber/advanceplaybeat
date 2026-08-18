import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

const sans = Inter({ variable: '--font-geist-sans', subsets: ['latin'] })
const display = Plus_Jakarta_Sans({ variable: '--font-display', subsets: ['latin'], weight: ['400','500','600','700','800'] })
const mono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PlayBeat Digital — Premium Digital Marketplace',
  description: 'Buy gaming keys, software licenses, gift cards, streaming subscriptions, IPTV, web hosting, web3 services and more. Instant delivery, secure payments, 24/7 support.',
  keywords: ['digital marketplace','gaming keys','steam','software','gift cards','streaming','IPTV','subscriptions','SaaS','PlayBeat'],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'PlayBeat Digital — Premium Digital Marketplace',
    description: 'Premium digital products, delivered instantly. Gaming, Software, Streaming, IPTV and more.',
    siteName: 'PlayBeat Digital',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${mono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  )
}
