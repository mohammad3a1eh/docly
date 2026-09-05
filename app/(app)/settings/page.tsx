'use client'
import { useState } from 'react'
export default function SettingsPage() {
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [msg, setMsg] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: cur, newPassword: next }) })
    setMsg(r.ok ? 'Changed' : (await r.json()).error || 'Failed')
    if (r.ok) { setCur(''); setNext('') }
  }
  return (
    <div className="p-6 max-w-md">
      <h1 className="text-lg font-semibold mb-4">Change password</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" className="w-full border rounded px-3 py-2 text-sm" />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password" className="w-full border rounded px-3 py-2 text-sm" />
        <button className="w-full bg-foreground text-background rounded py-2 text-sm">Change</button>
        {msg && <div className="text-sm text-muted-foreground">{msg}</div>}
      </form>
    </div>
  )
}
