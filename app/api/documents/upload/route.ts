import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) return NextResponse.json({ error: 'Only .md/.markdown allowed' }, { status: 400 })
  const content = await file.text()
  const base = file.name.replace(/\.(md|markdown)$/, '')
  let slug = slugify(base)
  let n = 1
  while (await prisma.document.findUnique({ where: { slug } })) slug = `${slugify(base)}-${n++}`
  const doc = await prisma.document.create({ data: { filename: file.name, slug, content, ownerId: user.id } })
  return NextResponse.json(doc)
}
