'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Doc {
  id: string
  filename: string
  slug: string
  updatedAt: string
}

export function FileList() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async (query = '') => {
    setLoading(true)
    const url = query ? `/api/documents?q=${encodeURIComponent(query)}` : '/api/documents'
    const res = await fetch(url)
    const data = await res.json()
    setDocs(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    const filename = prompt('New filename (e.g. notes.md):')
    if (!filename) return
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    })
    if (res.ok) load(q)
  }

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/documents/upload', { method: 'POST', body: fd })
    if (res.ok) load(q)
    e.target.value = ''
  }

  const rename = async (doc: Doc) => {
    const filename = prompt('New filename:', doc.filename)
    if (!filename || filename === doc.filename) return
    await fetch(`/api/documents/${doc.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    })
    load(q)
  }

  const del = async (doc: Doc) => {
    if (!confirm(`Delete ${doc.filename}?`)) return
    await fetch(`/api/documents/${doc.id}`, { method: 'DELETE' })
    load(q)
  }

  const copy = (url: string) => navigator.clipboard.writeText(url)

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    load(q)
  }

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={create} className="px-3 py-1.5 text-sm bg-foreground text-background rounded">+ New File</button>
        <label className="px-3 py-1.5 text-sm border rounded cursor-pointer">
          Upload
          <input type="file" accept=".md,.markdown" className="hidden" onChange={upload} />
        </label>
        <form onSubmit={search} className="ml-auto flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files…" className="px-3 py-1.5 text-sm border rounded w-64" />
          <button type="submit" className="px-3 py-1.5 text-sm border rounded">Search</button>
        </form>
      </div>
      <div className="border rounded divide-y">
        {docs.length === 0 && <div className="p-4 text-sm text-muted-foreground">No documents</div>}
        {docs.map((doc) => (
          <div key={doc.id} className="flex items-center gap-2 p-3 hover:bg-muted/50">
            <Link href={`/edit/${doc.id}`} className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{doc.filename}</div>
              <div className="text-xs text-muted-foreground">/{doc.slug} · {new Date(doc.updatedAt).toLocaleDateString()}</div>
            </Link>
            <button onClick={() => copy(`${location.origin}/doc/${doc.slug}`)} className="text-xs px-2 py-1 border rounded">Copy URL</button>
            <button onClick={() => copy(`${location.origin}/doc/${doc.slug}/raw`)} className="text-xs px-2 py-1 border rounded">Copy Raw</button>
            <button onClick={() => rename(doc)} className="text-xs px-2 py-1 border rounded">Rename</button>
            <button onClick={() => del(doc)} className="text-xs px-2 py-1 border rounded text-red-600">Delete</button>
            <Link href={`/doc/${doc.slug}`} target="_blank" className="text-xs px-2 py-1 border rounded">View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
