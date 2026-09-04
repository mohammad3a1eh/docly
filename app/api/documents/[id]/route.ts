import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = await prisma.document.findUnique({ where: { id } })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (body.content !== undefined) data.content = body.content
  if (body.filename) {
    if (!body.filename.endsWith('.md') && !body.filename.endsWith('.markdown')) return NextResponse.json({ error: 'Only .md/.markdown allowed' }, { status: 400 })
    data.filename = body.filename
    const base = body.filename.replace(/\.(md|markdown)$/, '')
    let slug = slugify(base)
    const existing = await prisma.document.findUnique({ where: { slug } })
    if (existing && existing.id !== id) { let n = 1; while (await prisma.document.findUnique({ where: { slug: `${slugify(base)}-${n}` } })) n++; slug = `${slugify(base)}-${n}` }
    data.slug = slug
  }
  const doc = await prisma.document.update({ where: { id }, data })
  return NextResponse.json(doc)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.document.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
