import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import createMiddleware from 'next-intl/middleware'

import { check } from './auth/service'
import { routing } from './i18n/routing'

const publicRoutes = ['/admin/login', '/admin/es/login']

const i18nMiddleware = createMiddleware(routing)
 
export default async function middleware(req: NextRequest) {
  if (!publicRoutes.includes(req.nextUrl.basePath + req.nextUrl.pathname)) {
    try {
      const cookie = (await cookies()).get('session')?.value
      await check(cookie)
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }
  }
  return i18nMiddleware(req)
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/', '/(en|es)/:path*', '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
