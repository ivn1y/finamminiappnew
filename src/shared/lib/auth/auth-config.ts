import NextAuth from 'next-auth'
import { serverApiClient } from '../api-client-server'
import type { AuthConfig } from './types'
import { parseInitData } from './parse-init-data'

async function saveUserToLocalDb(userData: {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        languageCode: userData.language_code,
        isPremium: userData.is_premium,
        allowsWriteToPm: userData.allows_write_to_pm,
        photoUrl: userData.photo_url,
      }),
    })
    console.log('[NextAuth] User saved to local DB via API')
  } catch (error) {
    console.error('[NextAuth] Failed to save user to local DB (non-fatal):', error)
  }
}

export function createNextAuthHandler(config: AuthConfig) {
  console.log('[NextAuth] Creating handler with config:', {
    secret: config.secret ? '***' : 'DEFAULT',
    telegramBotToken: config.telegramBotToken ? '***' : 'DEFAULT',
    apiBaseUrl: config.apiBaseUrl || 'DEFAULT',
  })

  return NextAuth({
    providers: [
      {
        id: 'telegram',
        name: 'Telegram WebApp',
        type: 'credentials',
        credentials: {
          initData: { label: 'Telegram WebApp Init Data', type: 'text' }
        },
        async authorize(credentials: any) {
          console.log('[NextAuth] authorize called with credentials:', {
            hasInitData: !!credentials?.initData,
            initDataLength: credentials?.initData?.length || 0,
            initDataPreview: credentials?.initData?.substring(0, 50) + '...' || 'none'
          })

          if (!credentials?.initData) {
            console.log('[NextAuth] No initData provided')
            return null
          }

          try {
            console.log('[NextAuth] Starting authentication with main service...')
            
            // Parse initData to extract Telegram user info
            const parsedData = parseInitData(credentials.initData as string)
            
            // Save user to local database for broadcasts (via API to avoid edge runtime issues)
            if (parsedData.user) {
              saveUserToLocalDb(parsedData.user).catch(() => {})
            }
            
            // Authenticate with main service
            const authResponse = await serverApiClient.authenticateWithTelegram(credentials.initData as string)
            
            console.log('[NextAuth] Authentication successful:', {
              hasToken: !!authResponse.access_token,
              tokenType: authResponse.token_type,
              expiresIn: authResponse.expires_in,
              user: authResponse.user ? {
                user_id: authResponse.user.user_id,
                username: authResponse.user.username,
                fullname: authResponse.user.fullname,
                points: authResponse.user.points
              } : null
            })

            // Return user data for NextAuth session
            const userData = {
              id: authResponse.user.user_id,
              name: authResponse.user.fullname,
              email: null,
              image: null,
              telegramId: parseInt(authResponse.user.user_id),
              username: authResponse.user.username,
              accessToken: authResponse.access_token,
              points: authResponse.user.points,
              seasonPoints: authResponse.user.season_points,
            }
            
            console.log('[NextAuth] Returning user data:', userData)
            return userData
          } catch (error: any) {
            console.error('[NextAuth] Error in Telegram authorize:', error.message)
            return null
          }
        }
      }
    ],
    callbacks: {
      async jwt({ token, user, account }: any) {
        console.log('[NextAuth] JWT callback:', {
          hasToken: !!token,
          hasUser: !!user,
          hasAccount: !!account,
          tokenSub: token?.sub,
          userTelegramId: user?.telegramId,
          tokenTelegramId: token?.telegramId
        })
        
        // Если есть пользователь (при первой авторизации), обновляем токен
        if (user) {
          token.telegramId = user.telegramId
          token.username = user.username
          token.name = user.name
          token.image = user.image
          token.accessToken = user.accessToken
          token.points = user.points
          token.seasonPoints = user.seasonPoints
          console.log('[NextAuth] Updated token with user data:', {
            telegramId: token.telegramId,
            username: token.username,
            name: token.name,
            hasAccessToken: !!token.accessToken,
            points: token.points
          })
        }
        
        // Проверяем, что токен содержит необходимые данные
        if (!token.telegramId) {
          console.warn('[NextAuth] JWT token missing telegramId:', token)
        }
        
        return token
      },
      async session({ session, token }: any) {
        console.log('[NextAuth] Session callback:', {
          hasSession: !!session,
          hasToken: !!token,
          tokenSub: token?.sub,
          tokenTelegramId: token?.telegramId,
          sessionUser: session?.user ? {
            id: session.user.id,
            name: session.user.name,
            telegramId: session.user.telegramId,
            username: session.user.username
          } : null
        })
        
        // Обновляем сессию данными из токена
        if (token && token.sub) {
          session.user = {
            ...session.user,
            id: token.sub,
            telegramId: token.telegramId,
            username: token.username,
            name: token.name || session.user.name,
            image: token.image || session.user.image,
            accessToken: token.accessToken,
            points: token.points,
            seasonPoints: token.seasonPoints,
          }
          
          console.log('[NextAuth] Updated session with token data:', {
            id: session.user.id,
            telegramId: session.user.telegramId,
            username: session.user.username,
            name: session.user.name,
            hasAccessToken: !!session.user.accessToken,
            points: session.user.points
          })
        } else {
          console.warn('[NextAuth] Session callback: missing token or token.sub')
        }
        
        return session
      },
      async signIn({ user, account, profile }: any) {
        console.log('[NextAuth] SignIn callback:', {
          hasUser: !!user,
          hasAccount: !!account,
          hasProfile: !!profile,
          userTelegramId: user?.telegramId,
          accountProvider: account?.provider
        })
        
        // Проверяем, что пользователь имеет telegramId
        if (!user?.telegramId) {
          console.error('[NextAuth] SignIn callback: user missing telegramId')
          return false
        }
        
        return true
      }
    },
    pages: {
      signIn: '/auth',
      error: '/auth/error',
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: config.secret,
  })
}