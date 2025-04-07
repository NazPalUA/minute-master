import {
  availableLanguages,
  defaultLanguage,
  LANGUAGE_COOKIE_NAME,
  type Language
} from '@/localization'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'

function getLocale(request: NextRequest) {
  const cookieLanguage = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value as
    | Language
    | undefined

  if (cookieLanguage && availableLanguages.includes(cookieLanguage)) {
    return cookieLanguage
  }

  try {
    const headers = {
      'accept-language': request.headers.get('accept-language') || ''
    }
    const languages = new Negotiator({ headers }).languages()
    return match(languages, availableLanguages, defaultLanguage)
  } catch {
    return defaultLanguage
  }
}

const isProtectedRoute = createRouteMatcher(['/:lang/dashboard(.*)'])

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl
    const pathLang = pathname.split('/')[1]

    const isValidLanguage = availableLanguages.some(lang => lang === pathLang)
    const isApiRoute = pathname.startsWith('/api')

    if (!isValidLanguage && !isApiRoute) {
      const locale = getLocale(req)
      req.nextUrl.pathname = `/${locale}${pathname}`
      return NextResponse.redirect(req.nextUrl)
    }

    // Handle protected routes only for valid language paths
    if (isProtectedRoute(req)) await auth.protect()
  },
  req => ({
    signInUrl: `${req.nextUrl.origin}/${req.nextUrl.pathname.split('/')[1]}/sign-in`,
    signUpUrl: `${req.nextUrl.origin}/${req.nextUrl.pathname.split('/')[1]}/sign-up`
  })
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
