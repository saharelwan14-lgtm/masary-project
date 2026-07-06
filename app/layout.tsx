import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'مساري | متابعة دراستي وتعلّم البرمجة',
  description:
    'موقع شامل لمتابعة الدراسة الأزهرية وتعلّم البرمجة: جداول، مذاكرة، متابعة يومية، إحصائيات وإنجازات.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#2f8f6a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`light ${cairo.variable}`}>
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
