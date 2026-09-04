'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!r.ok) setError('Invalid credentials')
    else router.push('/files')
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm border rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2 text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2 text-sm" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full bg-foreground text-background rounded py-2 text-sm">Sign in</button>
        <div className="text-xs text-muted-foreground">Seed admin: admin@docly.local / admin123</div>
      </form>
    </div>
  )
}
