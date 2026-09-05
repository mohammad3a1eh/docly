'use client'
import Link from 'next/link'
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); location.href = '/login' }
  return (
    <div className="min-h-screen">
      <header className="border-b px-6 py-3 flex items-center gap-4">
        <Link href="/files" className="font-semibold">Docly</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/files" className="hover:underline">Files</Link>
          <Link href="/users" className="hover:underline">Users</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </nav>
        <button onClick={logout} className="ml-auto text-sm border rounded px-2 py-1">Logout</button>
      </header>
      <main>{children}</main>
    </div>
  )
}
