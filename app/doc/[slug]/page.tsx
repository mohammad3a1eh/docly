import { prisma } from '@/lib/prisma'
import { marked } from 'marked'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await prisma.document.findUnique({ where: { slug } })
  return { title: doc?.filename || 'Not found' }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await prisma.document.findUnique({ where: { slug } })
  if (!doc) notFound()
  const html = await marked.parse(doc.content)
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <a href="/" className="text-sm text-muted-foreground hover:underline">← Docly</a>
        <article className="prose prose-neutral dark:prose-invert max-w-none mt-6" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-8 text-xs text-muted-foreground">Updated {new Date(doc.updatedAt).toLocaleString()} · <a className="underline" href={`/doc/${doc.slug}/raw`}>Raw Markdown</a></div>
      </div>
    </div>
  )
}
