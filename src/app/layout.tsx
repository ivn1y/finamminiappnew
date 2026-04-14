import { GlobalProviders } from "./providers"
import "@/app/globals.css"
import { Inter, Inter_Tight } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { Toaster } from "@/shared/ui/sonner"
import { Analytics } from '@vercel/analytics/react';
import { YandexMetrika } from '@/shared/ui/yandex-metrika'
import { YandexMetrikaHead } from '@/shared/ui/yandex-metrika-head'

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter-tight",
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  title: "Generation:Fi - Инвестиционная игра",
  description: "Геймифицированное инвестиционное MiniApp с коллекционными картами",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Generation:Fi",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'msapplication-navbutton-color': '#000000',
  },
  icons: {
    icon: [
      { url: "/images/icon.webp", sizes: "1024x1024", type: "image/webp" },
    ],
    apple: [
      { url: "/images/icon.webp", sizes: "1024x1024", type: "image/webp" }
    ]
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning style={{ backgroundColor: '#000000' }}>
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        {/* Android Chrome - цвет панели навигации */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        {/* Samsung Internet */}
        <meta name="theme-color" content="#000000" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#000000" />
        {/* iOS Safari - цвет области вокруг notch */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme') || 'system';
                if (theme === 'system') {
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
                } else {
                  document.documentElement.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased" style={{ backgroundColor: '#000000' }}>
        <YandexMetrikaHead />
        <GlobalProviders>
          {children}
          <Toaster/>
        </GlobalProviders>
        <Analytics />
        <YandexMetrika />
      </body>
    </html>
  )
} 