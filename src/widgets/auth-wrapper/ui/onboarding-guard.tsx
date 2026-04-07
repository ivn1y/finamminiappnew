'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/app-store'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isOnboardingComplete } = useAppStore()

  // Пути, которые не требуют завершения онбординга
  const onboardingPaths = ['/', '/onboarding', '/auth', '/privacy-policy', '/qr-test', '/bugbounty']
  const isOnboardingPath = onboardingPaths.some(path => pathname.startsWith(path))

  useEffect(() => {
    // Если пользователь не завершил онбординг и не находится на странице онбординга
    if (!isOnboardingComplete && !isOnboardingPath) {
      console.log('[OnboardingGuard] Redirecting to onboarding - not completed')
      router.push('/onboarding')
      return
    }

    // Если пользователь завершил онбординг и находится на главной странице или странице онбординга
    if (isOnboardingComplete && (pathname === '/' || pathname === '/onboarding')) {
      console.log('[OnboardingGuard] Redirecting to main app - onboarding completed')
      router.push('/collab/home')
      return
    }
  }, [isOnboardingComplete, pathname, router, isOnboardingPath])

  // Всегда показываем children - редиректы обрабатываются в useEffect
  return <>{children}</>
}
