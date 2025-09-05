import { NextRequest, NextResponse } from 'next/server'
import type { MiddlewareConfig, MiddlewareContext, MiddlewareHandler } from './types'


function isTelegramWebAppRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer') || ''
  const origin = request.headers.get('origin') || ''
  const url = request.nextUrl
  
  // Принудительное определение через параметр URL (для тестирования)
  if (url.searchParams.has('forceTelegramWebApp')) {
    console.log('[Middleware] Force Telegram WebApp detection via URL parameter')
    return true
  }
  
  // Проверяем User-Agent
  const hasTelegramUserAgent = userAgent.includes('TelegramWebApp') || 
                              userAgent.includes('Telegram') ||
                              userAgent.includes('tgWebApp')
  
  // Проверяем Referer и Origin
  const hasTelegramReferer = referer.includes('t.me') || 
                            referer.includes('telegram.org') ||
                            referer.includes('web.telegram.org')
  
  const hasTelegramOrigin = origin.includes('t.me') || 
                           origin.includes('telegram.org') ||
                           origin.includes('web.telegram.org')
  
  // Проверяем параметры URL
  const hasTelegramParams = url.searchParams.has('tgWebAppData') ||
                           url.searchParams.has('tgWebAppStartParam') ||
                           url.searchParams.has('tgWebAppTheme') ||
                           url.searchParams.has('tgWebAppVersion')
  
  // Проверяем заголовки
  const hasTelegramHeaders = request.headers.get('x-telegram-init-data') ||
                            request.headers.get('x-telegram-web-app') ||
                            request.headers.get('x-telegram-bot-token')
  
  // Проверяем путь (Telegram WebApp часто открывается с определенными путями)
  const hasTelegramPath = url.pathname.includes('webapp') ||
                         url.pathname.includes('telegram')
  
  
  return hasTelegramUserAgent || 
         hasTelegramReferer || 
         hasTelegramOrigin || 
         hasTelegramParams || 
         !!hasTelegramHeaders ||
         hasTelegramPath
}

export function createMiddleware(config: MiddlewareConfig, auth: () => Promise<any>) {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Check if it's a Telegram WebApp request
    const isTelegramWebApp = isTelegramWebAppRequest(request)
    
    // Skip middleware for API routes and static files
    if (pathname.startsWith('/api/') || 
        pathname.startsWith('/_next/') || 
        pathname.startsWith('/images/') ||
        pathname.startsWith('/videos/') ||
        config.publicPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    const context: MiddlewareContext = {
      request,
      pathname,
      userAgent: request.headers.get('user-agent') || '',
      isTelegramWebApp
    }

    // Для Telegram WebApp - разрешаем доступ к dashboard без проверки сессии
    // Авторизация будет происходить автоматически на клиенте
    if (isTelegramWebApp && pathname.startsWith(config.dashboardPath)) {
      console.log('[Middleware] Allowing Telegram WebApp access to dashboard')
      return NextResponse.next()
    }

    // Для Telegram WebApp на главной странице - редиректим на dashboard
    if (isTelegramWebApp && pathname === '/') {
      console.log('[Middleware] Redirecting Telegram WebApp to dashboard')
      return NextResponse.redirect(new URL(config.dashboardPath, request.url))
    }

    // Для обычных браузеров - стандартная логика авторизации
    if (!isTelegramWebApp) {
      // For dashboard routes, check authentication
      if (pathname.startsWith(config.dashboardPath)) {
        try {
          const session = await auth()
          if (!session) {
            console.log('[Middleware] Redirecting to auth page')
            return NextResponse.redirect(new URL(config.authRedirectPath, request.url))
          }
        } catch (error) {
          console.error('Error checking session in middleware:', error)
          return NextResponse.redirect(new URL(config.authRedirectPath, request.url))
        }
      }
    }

    return NextResponse.next()
  }
}

export function createMiddlewareWithHandlers(
  config: MiddlewareConfig, 
  auth: () => Promise<any>,
  handlers: MiddlewareHandler[]
) {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    const isTelegramWebApp = isTelegramWebAppRequest(request)
    
    const context: MiddlewareContext = {
      request,
      pathname,
      userAgent: request.headers.get('user-agent') || '',
      isTelegramWebApp
    }

    // Run custom handlers
    for (const handler of handlers) {
      const result = await handler(context, config)
      if (result) {
        return result
      }
    }

    // Default middleware logic
    return createMiddleware(config, auth)(request)
  }
} 