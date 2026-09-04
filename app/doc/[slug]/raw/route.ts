import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await prisma.document.findUnique({ where: { slug } })
  if (!doc) return new Response('Not found', { status: 404 })
  return new Response(doc.content, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'no-cache' } })
}
