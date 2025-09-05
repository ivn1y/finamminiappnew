'use client'

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { TelegramProvider } from "@/shared/lib/telegram/providers/telegram-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}