export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export type UserMetadata = {
  role: UserRole
} 