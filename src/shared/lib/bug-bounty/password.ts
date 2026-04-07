import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(nodeScrypt)

const SALT_BYTES = 16
const KEY_BYTES = 64

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES)
  const derived = (await scrypt(plain, salt, KEY_BYTES)) as Buffer
  return `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  try {
    const salt = Buffer.from(parts[1], 'base64')
    const expected = Buffer.from(parts[2], 'base64')
    if (expected.length !== KEY_BYTES) return false
    const derived = (await scrypt(plain, salt, expected.length)) as Buffer
    if (derived.length !== expected.length) return false
    return timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}
