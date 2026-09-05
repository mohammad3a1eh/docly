'use client'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    const r = await fetch('/api/users')
    if (r.ok) setUsers(await r.json())
    else setError('Forbidden - admin only')
  }
  useEffect(() => { load() }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!r.ok) setError('Create failed')
    else { setEmail(''); setPassword(''); load() }
  }
  const del = async (id: string) => {
    if (!confirm('Delete user?')) return
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    load()
  }
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <form onSubmit={create} className="flex gap-2 mb-6">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border rounded px-3 py-1.5 text-sm flex-1" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="border rounded px-3 py-1.5 text-sm flex-1" />
        <button className="px-3 py-1.5 text-sm bg-foreground text-background rounded">Create</button>
      </form>
      <div className="border rounded divide-y">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-2 p-3">
            <span className="text-sm flex-1">{u.email} <span className="text-xs text-muted-foreground">({u.role})</span></span>
            <button onClick={async () => { const p = prompt('New password for ' + u.email); if (!p) return; const r = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId: u.id, newPassword: p }) }); alert(r.ok ? 'Changed' : 'Failed') }} className="text-xs px-2 py-1 border rounded">Reset PW</button>
            <button onClick={() => del(u.id)} className="text-xs px-2 py-1 border rounded text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
