'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { TelegramProvider } from './telegram-provider'
// import { OnboardingGuard } from '@/shared/components'

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TelegramProvider>
          {/* <OnboardingGuard> */}
            {children}
          {/* </OnboardingGuard> */}
        </TelegramProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}