import { Language } from '@/localization'

type Locale = Language | '[slug]'

export const ROUTES = {
  HOME: {
    INDEX: (lang: Locale) => `/${lang}`,
    FEATURES: {
      ID: 'features',
      SECTION: (lang: Locale) => `/${lang}#features`
    },
    PRICING: {
      ID: 'pricing',
      SECTION: (lang: Locale) => `/${lang}#pricing`
    }
  },

  TERMS: (lang: Locale) => `/${lang}/terms`,
  PRIVACY: (lang: Locale) => `/${lang}/privacy`,

  SUPPORT: (lang: Locale) => `/${lang}/support`,
  CONTACT: (lang: Locale) => `/${lang}/contact`,

  LOGIN: (lang: Locale) => `/${lang}/sign-in`,
  SIGNUP: (lang: Locale) => `/${lang}/sign-up`,

  DASHBOARD: {
    INDEX: (lang: Locale) => `/${lang}/dashboard`,

    PROJECTS: {
      INDEX: (lang: Locale) => `/${lang}/dashboard/projects`,
      DETAILS: (lang: Locale, projectId: string) =>
        `/${lang}/dashboard/projects/${projectId}`,
      TASKS: (lang: Locale, projectId: string) =>
        `/${lang}/dashboard/projects/${projectId}/tasks`,
      TIME_LOGS: (lang: Locale, projectId: string) =>
        `/${lang}/dashboard/projects/${projectId}/time-logs`
    },

    TASKS: {
      INDEX: (lang: Locale) => `/${lang}/dashboard/tasks`
    },

    SETTINGS: (lang: Locale) => `/${lang}/dashboard/settings`
  }
} as const
