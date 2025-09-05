import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    telegramId?: number
    username?: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      telegramId?: number
      username?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    telegramId?: number
    username?: string
  }
}