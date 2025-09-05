import type { NextRequest, NextResponse } from 'next/server'

export interface AuthUser {
  id: string
  name: string
  email: string | null
  image: string | null
  telegramId?: number
  username?: string
  accessToken?: string
  points?: number
  seasonPoints?: number
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface AuthConfig {
  secret: string
  telegramBotToken: string
  apiBaseUrl: string
}

// Расширения для NextAuth
declare module "next-auth" {
  interface User {
    telegramId?: number
    username?: string
    accessToken?: string
    points?: number
    seasonPoints?: number
  }
  
  interface Session {
    user: {
      id: string
      name: string
      email: string | null
      image: string | null
      telegramId?: number
      username?: string
      accessToken?: string
      points?: number
      seasonPoints?: number
    }
  }
} 


export interface MiddlewareConfig {
  authRedirectPath: string
  dashboardPath: string
  publicPaths: string[]
  telegramBotToken: string
}

export interface MiddlewareContext {
  request: NextRequest
  pathname: string
  userAgent: string
  isTelegramWebApp: boolean
}

export type MiddlewareHandler = (
  context: MiddlewareContext,
  config: MiddlewareConfig
) => Promise<NextResponse | null> 