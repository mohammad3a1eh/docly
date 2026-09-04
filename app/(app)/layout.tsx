import Link from 'next/link'
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b px-6 py-3 flex items-center gap-4">
        <Link href="/files" className="font-semibold">Docly</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/files" className="hover:underline">Files</Link>
          <Link href="/users" className="hover:underline">Users</Link>
        </nav>
        <form action="/api/auth/logout" method="post" className="ml-auto">
          <button className="text-sm border rounded px-2 py-1">Logout</button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  )
}
