import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    if (pathname.startsWith('/api')) {
      return
    }
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/notes/:path*', '/starred', '/trash', '/folders/:path*'],
}
