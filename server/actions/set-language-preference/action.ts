'use server'

import { env } from '@/env'
import {
  type Language,
  LANGUAGE_COOKIE_EXPIRY,
  LANGUAGE_COOKIE_NAME
} from '@/localization'
import { cookies } from 'next/headers'

export async function setLanguagePreference(language: Language) {
  const cookieStore = await cookies()

  cookieStore.set(LANGUAGE_COOKIE_NAME, language, {
    path: '/',
    maxAge: LANGUAGE_COOKIE_EXPIRY * 24 * 60 * 60,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
}
