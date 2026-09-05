import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { hash, compare } from 'bcrypt'

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { currentPassword, newPassword, targetId } = await req.json()
  if (!newPassword) return NextResponse.json({ error: 'newPassword required' }, { status: 400 })
  if (targetId && targetId !== user.id) {
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const hashed = await hash(newPassword, 10)
    await prisma.user.update({ where: { id: targetId }, data: { password: hashed } })
    return NextResponse.json({ ok: true })
  }
  if (!currentPassword) return NextResponse.json({ error: 'currentPassword required' }, { status: 400 })
  const fresh = await prisma.user.findUnique({ where: { id: user.id } })
  if (!fresh || !(await compare(currentPassword, fresh.password))) return NextResponse.json({ error: 'Wrong password' }, { status: 400 })
  const hashed = await hash(newPassword, 10)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
  return NextResponse.json({ ok: true })
}
