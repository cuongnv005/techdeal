import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 1.0 (trace 100% request) làm tăng CPU active trên mỗi request SSR
  // (Vercel Fluid Compute tính tiền theo CPU này) — giảm xuống mức đủ để
  // vẫn phát hiện lỗi/perf issue mà không tốn CPU trên toàn bộ traffic.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending of user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false
})
