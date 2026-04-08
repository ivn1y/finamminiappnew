'use client'

import Script from 'next/script'
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

  const src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        src={src}
        onLoad={() => {
          if (typeof window === 'undefined' || !window.ym) return
          window.ym(id, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: 'dataLayer',
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true,
          })
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
