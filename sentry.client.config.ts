import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://b1bb99e018720c7fe4c89efad37888b6@o4509162854023168.ingest.de.sentry.io/4509162863657040',

  integrations: [Sentry.replayIntegration()],
  // Session Replay
  // TODO: change replaysSessionSampleRate to 0.1 in production
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})
