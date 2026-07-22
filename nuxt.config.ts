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

  runtimeConfig: {
    public: {
      googleClientId:
        process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '559334545172-uarhhls0lrd7rbgoa9538dm16p76kiv6.apps.googleusercontent.com',
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || ''
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'vi'
      },
      title: process.env['APP_NAME'] || '',
      titleTemplate: '%s | ' + (process.env['APP_NAME'] || ''),
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      meta: [
        {
          name: 'google-site-verification',
          content: '5IYbs9tdevZ7SmaVUYza_dFxPiVJFsj2o_BxPNOC_aw'
        },
        // Xác nhận quyền sở hữu AdSense — chỉ là thẻ ownership, KHÔNG phải quảng cáo,
        // nên an toàn đặt trên mọi trang. Script ads được inject riêng theo route (xem app.vue).
        {
          name: 'google-adsense-account',
          content: process.env['VITE_AD_CLIENT_ID'] || 'ca-pub-3940256099942544'
        },
        // Xác nhận quyền sở hữu domain cho Monetag — chỉ là thẻ ownership, không phải quảng cáo.
        {
          name: 'monetag',
          content: '14873d9f10b09a903fe9a25cb8c7125c'
        },
        // Xác nhận quyền sở hữu domain cho HilltopAds — chỉ là thẻ ownership, không phải quảng cáo.
        {
          name: '74a0ca2ef541da15ac02c1ce0adfefc1410a96d2',
          content: '74a0ca2ef541da15ac02c1ce0adfefc1410a96d2'
        },
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
        { property: 'og:locale', content: 'vi_VN' },
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
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' },
        { rel: 'apple-touch-icon', href: '/images/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap',
          rel: 'stylesheet',
          crossorigin: 'anonymous'
        },
        { rel: 'shortcut icon', type: 'image/png', href: '/images/logo.png' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'TechDeal RSS Feed',
          href: '/rss.xml'
        }
      ]
      // Script AdSense KHÔNG để global nữa — được inject có điều kiện theo route trong app.vue
      // để không bao giờ tải trên /giveaway, /go, auth... (tránh Auto Ads chạy trên trang cấm).
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  ssr: true,

  css: ['~/assets/styles/index.scss', '~/assets/styles/tailwind.css'],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/image',
    '@sentry/nuxt/module',
    'shadcn-nuxt'
  ],

  shadcn: {
    prefix: '',
    componentDir: '~/shared/ui'
  },

  site: {
    url: 'https://techdeal.io.vn',
    name: process.env['APP_NAME'] || 'TechDeal'
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: [
      '/forgot-password',
      '/login',
      '/register',
      '/reset-password',
      '/search',
      '/blog/publish'
    ]
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
    typeCheck: false,
    strict: true,
    tsConfig: {}
  },

  devServer: {
    host: '0.0.0.0',
    port: Number(process.env['APP_PORT']) || 8000
  },

  compatibilityDate: '2024-11-04',

  // Allow dots (.) in dynamic route params - needed for /blog/{slug}.{id} URL format
  router: {
    options: {
      strict: false
    }
  },

  routeRules: {
    '/forgot-password': { sitemap: false, robots: 'noindex, nofollow' },
    '/login': { sitemap: false, robots: 'noindex, nofollow' },
    '/register': { sitemap: false, robots: 'noindex, nofollow' },
    '/reset-password': { sitemap: false, robots: 'noindex, nofollow' },
    '/search': { sitemap: false, robots: 'noindex, nofollow' },
    '/blog/publish': { sitemap: false, robots: 'noindex, nofollow' },
    '/blog/**': { ssr: true },
    // Deals pages được biên tập thủ công và cần hiển thị nội dung mới ngay sau khi sửa.
    // Không dùng swr (cache) để tránh phục vụ bản HTML cũ.
    '/deals/**': { ssr: true },
    '/admin/**': { ssr: false },
    '/en': { redirect: '/' },
    '/en/**': { redirect: '/' }
  },

  nitro: {
    preset: (process.env['NITRO_PRESET'] as any) || 'vercel'
  },

  sentry: {
    org: 'bekisoft-40',
    project: 'javascript-nuxt',
    autoInjectServerSentry: 'top-level-import'
  },

  sourcemap: {
    client: 'hidden'
  },
  components: [{ path: '@shared/ui', prefix: 'Ui' }, '~/components']
})
