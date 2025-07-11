import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Force no caching on ALL requests
  const response = NextResponse.next()
  
  // NUCLEAR ANTI-CACHE HEADERS
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0, s-maxage=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('Surrogate-Control', 'no-store')
  response.headers.set('X-Vercel-Cache', 'MISS')
  response.headers.set('Vary', '*')
  response.headers.set('Last-Modified', new Date().toUTCString())
  response.headers.set('ETag', `"no-cache-${Date.now()}"`)
  
  console.log(`🚫 CACHE DISABLED for ${request.nextUrl.pathname}`)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
