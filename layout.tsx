
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteMeta } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import AnalyticsLight from '@/components/AnalyticsLight'
import ClientVitals from '@/components/Vitals'

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.name,
    template: `%s • ${siteMeta.name}`
  },
  description: siteMeta.description,
  openGraph: {
    type: 'website',
    locale: siteMeta.locale,
    url: siteMeta.url,
    siteName: siteMeta.name,
    images: [{ url: siteMeta.ogImage, width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.name,
    description: siteMeta.description,
    images: [siteMeta.ogImage]
  }
}

export const viewport: Viewport = {
  themeColor: '#111827'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Header />
        <main className="container">{children}</main>
        <Footer />
        <Analytics />
        <AnalyticsLight />
        {/* AdSense global script (optional) */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`} crossOrigin="anonymous"></script>
        )}
        <ClientVitals />
      </body>
    </html>
  )
}
