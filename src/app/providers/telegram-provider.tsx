'use client'

import React, { useEffect, useState } from 'react'
import { WebAppConfigurator } from '@/widgets/telegram/ui/config'
import { isTelegramWebApp } from '@/shared/lib/telegram/utils'

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isTelegram, setIsTelegram] = useState(false)

  useEffect(() => {
    // This check runs only on the client-side
    setIsTelegram(isTelegramWebApp())
  }, [])

  return (
    <>
      {isTelegram && <WebAppConfigurator />}
      {children}
    </>
  )
}
