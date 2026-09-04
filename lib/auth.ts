import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from './prisma'

export async function getUser() {
  const store = await cookies()
  const token = store.get('auth')?.value
  if (!token) return null
  try {
    const payload = verify(token, process.env.AUTH_SECRET || 'secret') as { sub: string; role: string }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    return user
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
