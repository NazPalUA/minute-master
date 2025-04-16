import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Environment (automatically set by Next.js)
    NODE_ENV: z.enum(['development', 'production', 'test']),

    // Atlas
    ATLAS_URI: z.string().min(1),
    ATLAS_DATABASE: z.string().min(1),

    ATLAS_COLLECTION_PROJECTS: z.string().min(1),
    ATLAS_COLLECTION_SECTIONS: z.string().min(1),
    ATLAS_COLLECTION_TASKS: z.string().min(1),
    ATLAS_COLLECTION_TIME_LOGS: z.string().min(1),

    // Limits
    PROJECTS_MAX_COUNT: z.coerce.number().int().positive(),
    SECTIONS_MAX_COUNT: z.coerce.number().int().positive(),
    TASKS_MAX_COUNT: z.coerce.number().int().positive(),

    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),

    // Sentry
    SENTRY_AUTH_TOKEN: z.string().min(1)
  },

  client: {
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),

    // Pricing
    NEXT_PUBLIC_PRICE_MONTHLY: z.coerce.number().int().positive(),
    NEXT_PUBLIC_PRICE_YEARLY: z.coerce.number().int().positive(),

    // Support
    NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email(),

    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1)
  },

  runtimeEnv: {
    // Environment
    NODE_ENV: process.env.NODE_ENV,

    // Atlas
    ATLAS_URI: process.env.ATLAS_URI,
    ATLAS_DATABASE: process.env.ATLAS_DATABASE,

    ATLAS_COLLECTION_PROJECTS: process.env.ATLAS_COLLECTION_PROJECTS,
    ATLAS_COLLECTION_SECTIONS: process.env.ATLAS_COLLECTION_SECTIONS,
    ATLAS_COLLECTION_TASKS: process.env.ATLAS_COLLECTION_TASKS,
    ATLAS_COLLECTION_TIME_LOGS: process.env.ATLAS_COLLECTION_TIME_LOGS,

    // Limits
    PROJECTS_MAX_COUNT: process.env.PROJECTS_MAX_COUNT,
    SECTIONS_MAX_COUNT: process.env.SECTIONS_MAX_COUNT,
    TASKS_MAX_COUNT: process.env.TASKS_MAX_COUNT,

    // Clerk
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

    // Pricing
    NEXT_PUBLIC_PRICE_MONTHLY: process.env.NEXT_PUBLIC_PRICE_MONTHLY,
    NEXT_PUBLIC_PRICE_YEARLY: process.env.NEXT_PUBLIC_PRICE_YEARLY,

    // Support
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,

    // Sentry
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },

  emptyStringAsUndefined: true
})
