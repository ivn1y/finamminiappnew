import { createNextAuthHandler } from './auth-config'
import type { AuthConfig } from './types'

export function createAuth(config: AuthConfig) {
  const nextAuthHandler = createNextAuthHandler(config)
  return {
    handler: nextAuthHandler.handlers,
    auth: nextAuthHandler.auth,
    signIn: nextAuthHandler.signIn,
    signOut: nextAuthHandler.signOut
  }
}