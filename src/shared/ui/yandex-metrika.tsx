'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

function metrikaEnabled(): boolean {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  if (!id) return false
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'false') return false
  return true
}

function getMetrikaId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  if (!raw) return null
  const id = Number(raw)
  return Number.isFinite(id) ? id : null
}

/**
 * Дополнение к {@link YandexMetrikaHead}: хиты при клиентских переходах (App Router) и &lt;noscript&gt;.
 * Инициализация ym — только в head, без дубля.
 */
export function YandexMetrika() {
  const pathname = usePathname()
  const id = getMetrikaId()
  const prevPathname = useRef<string | null>(null)

  useEffect(() => {
    if (!id || !metrikaEnabled()) return
    if (typeof window === 'undefined') return

    if (prevPathname.current === null) {
      prevPathname.current = pathname
      return
    }
    if (prevPathname.current === pathname) {
      return
    }

    prevPathname.current = pathname
    window.ym?.(id, 'hit', window.location.href)
  }, [id, pathname])

  if (!id || !metrikaEnabled()) {
    return null
  }

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${id}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  )
}
