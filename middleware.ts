import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth')?.value
  const isPublic = req.nextUrl.pathname.startsWith('/doc') || req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/api/auth')
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/files/:path*', '/edit/:path*', '/users/:path*', '/api/documents/:path*', '/api/users/:path*'] }
