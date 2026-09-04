import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const docs = await prisma.document.findMany({
    where: q ? { OR: [{ filename: { contains: q } }, { content: { contains: q } }, { slug: { contains: q } }] } : {},
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(docs)
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  let { filename, content } = body as { filename: string; content?: string }
  if (!filename) return NextResponse.json({ error: 'filename required' }, { status: 400 })
  if (!filename.endsWith('.md') && !filename.endsWith('.markdown')) return NextResponse.json({ error: 'Only .md/.markdown allowed' }, { status: 400 })
  const base = filename.replace(/\.(md|markdown)$/, '')
  let slug = slugify(base)
  let n = 1
  while (await prisma.document.findUnique({ where: { slug } })) slug = `${slugify(base)}-${n++}`
  const doc = await prisma.document.create({ data: { filename, slug, content: content || `# ${base}\n`, ownerId: user.id } })
  return NextResponse.json(doc)
}
