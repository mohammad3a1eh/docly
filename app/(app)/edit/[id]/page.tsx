'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { TiptapEditor } from '@/components/editor/TiptapEditor'

export default function EditPage() {
  const params = useParams() as { id: string }
  const id = params.id
  const router = useRouter()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/documents/${id}`)
      if (!res.ok) return setError('Load failed')
      const doc = await res.json()
      setTitle(doc.filename)
      setContent(doc.content)
      setLoaded(true)
    })()
  }, [id])

  const save = useCallback(async (md: string) => {
    setSaving(true)
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: md }),
    })
    setSaving(false)
    if (!res.ok) setError('Save failed')
  }, [id])

  useEffect(() => {
    if (!loaded) return
    const h = setTimeout(() => save(content), 1500)
    return () => clearTimeout(h)
  }, [content, save, loaded])

  if (!loaded && !error) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push('/files')} className="text-sm border rounded px-2 py-1">← Files</button>
        <h1 className="text-lg font-medium">{title}</h1>
        <span className="ml-auto text-xs text-muted-foreground">{saving ? 'Saving…' : 'Saved'}</span>
        <button onClick={() => save(content)} className="text-sm bg-foreground text-background rounded px-3 py-1.5">Save</button>
      </div>
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
      <div className="border rounded min-h-[60vh]">
        <TiptapEditor content={content} onChange={setContent} />
      </div>
    </div>
  )
}
