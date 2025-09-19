import { Providers } from "./providers"
import "@/app/globals.css"
import { Inter, Outfit } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "@/shared/ui/sonner"

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit",
})

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Generation:Fi - Инвестиционная игра",
  description: "Геймифицированное инвестиционное MiniApp с коллекционными картами",
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
    <html lang="ru" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
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
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster/>
        </Providers>
      </body>
    </html>
  )
} 