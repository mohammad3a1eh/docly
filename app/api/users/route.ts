import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { hash } from 'bcrypt'

export async function GET() {
  const user = await getUser()
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { email, password, role } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })
  const hashed = await hash(password, 10)
  const created = await prisma.user.create({ data: { email, password: hashed, role: role || 'user' } })
  return NextResponse.json({ id: created.id, email: created.email, role: created.role })
}

export async function DELETE(req: Request) {
  const user = await getUser()
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
