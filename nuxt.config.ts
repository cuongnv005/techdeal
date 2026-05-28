import * as fs from 'fs'
import path from 'path'

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: false },
  alias: {
    '@features': path.resolve(__dirname, './features'),
    '@core': path.resolve(__dirname, './core'),
    '@shared': path.resolve(__dirname, './shared'),
    '@stores': path.resolve(__dirname, './stores'),
    '@i18n': path.resolve(__dirname, './i18n')
  },

  app: {
    head: {
      title: process.env['APP_NAME'] || '',
      titleTemplate: '%s | ' + (process.env['APP_NAME'] || ''),
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      meta: [
        {
          name: 'description',
          content: process.env['APP_DESCRIPTION'] || process.env['APP_NAME'] || ''
        },
        { name: 'author', content: process.env['APP_AUTHOR'] || '' },
        { name: 'keywords', content: process.env['APP_KEYWORDS'] || '' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: process.env['APP_URL'] || '' },
        { property: 'og:title', content: process.env['APP_NAME'] || '' },
        {
          property: 'og:description',
          content: process.env['APP_DESCRIPTION'] || process.env['APP_NAME'] || ''
        },
        { property: 'og:image', content: process.env['APP_IMAGE'] || '/images/og-image.jpg' },
        { property: 'og:locale', content: 'ja_JP' },
        { property: 'og:site_name', content: process.env['APP_NAME'] || '' },
        { name: 'fb:app_id', content: process.env['FB_APP_ID'] || '' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: process.env['APP_URL'] || '' },
        { name: 'twitter:title', content: process.env['APP_NAME'] || '' },
        {
          name: 'twitter:description',
          content: process.env['APP_DESCRIPTION'] || process.env['APP_NAME'] || ''
        },
        { name: 'twitter:image', content: process.env['APP_IMAGE'] || '/images/twitter-image.jpg' },
        { name: 'twitter:creator', content: process.env['TWITTER_CREATOR'] || '' },

        // Apple specific
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: process.env['APP_NAME'] || '' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap',
          rel: 'stylesheet',
          crossorigin: 'anonymous'
        },
        { rel: 'shortcut icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  ssr: true,

  // work when ssr: false
  spaLoadingTemplate: './app-loading.html',

  css: ['~/assets/styles/index.scss', '~/assets/styles/tailwind.css'],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@sentry/nuxt/module',
    'shadcn-nuxt'
  ],

  shadcn: {
    prefix: '',
    componentDir: '@shared/ui'
  },
  site: {
    url: process.env['APP_URL'] || '',
    name: process.env['APP_NAME'] || ''
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        } as any
      }
    },

    plugins: [tailwindcss()]
  },

  imports: {
    autoImport: true,
    global: true,
    scan: true
  },

  typescript: {
    typeCheck: true,
    strict: true,
    tsConfig: {}
  },

  build: {},

  devServer: {
    host: '0.0.0.0',
    port: Number(process.env['APP_PORT']) || 8000
  },

  i18n: {
    defaultLocale: 'jp',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'jp', name: 'Japanese', file: 'jp.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  compatibilityDate: '2024-11-04',

  // Allow dots (.) in dynamic route params - needed for /blog/{slug}.{id} URL format
  router: {
    options: {
      strict: false
    }
  },

  // Nitro: force /blog/** to be treated as app routes (not static files)
  // This prevents Nitro from interpreting ".id" suffix as a file extension
  nitro: {
    routeRules: {
      '/blog/**': { ssr: true }
    }
  },

  sentry: {
    org: 'bekisoft-40',
    project: 'javascript-nuxt'
  },

  sourcemap: {
    client: 'hidden'
  }
})
