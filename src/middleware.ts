import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dashboard routes require auth - check for token in cookie or let client-side handle it
  // Since we use localStorage, we rely on client-side auth context for protection
  // This middleware handles basic redirects

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
