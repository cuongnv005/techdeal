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
        // Xác nhận quyền sở hữu domain cho Clickadu — chỉ là thẻ ownership, không phải quảng cáo.
        {
          name: 'clckd',
          content: '924856bf1987a333eb9dceb83ef86ce7'
        },
        // Xác nhận quyền sở hữu domain cho Mondiad — chỉ là thẻ ownership, không phải quảng cáo.
        {
          name: 'mnd-ver',
          content: 'xr92whnj3bkwyju8uezdeg'
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap',
          rel: 'stylesheet',
          crossorigin: 'anonymous'
        },
        { rel: 'shortcut icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'TechDeal RSS Feed',
          href: '/rss.xml'
        }
      ],
      // Script AdSense KHÔNG để global nữa — được inject có điều kiện theo route trong app.vue
      // để không bao giờ tải trên /giveaway, /go, auth... (tránh Auto Ads chạy trên trang cấm).

      // Chống nháy sai theme lúc load trang (FOIT): SSR luôn render <html> không có
      // class "dark" (server không biết theme đã lưu), UiThemeToggle (dùng useDark của
      // VueUse) lại chỉ chạy phía client SAU khi mount -> có 1 khoảng trễ hiển thị sai
      // theme trước khi JS kịp sửa. Script inline này chạy đồng bộ ngay khi trình duyệt
      // parse <head>, TRƯỚC khi Vue hydrate và trước khi <body> được vẽ, nên set đúng
      // class "dark" ngay từ đầu. Logic phải khớp CHÍNH XÁC config mặc định của
      // useDark() trong shared/ui/ThemeToggle.vue (storageKey "vueuse-color-scheme",
      // giá trị "dark"/"light"/"auto", valueLight rỗng) — đổi 1 bên phải đổi bên kia.
      script: [
        {
          key: 'theme-init',
          innerHTML: `(function(){try{var s=localStorage.getItem('vueuse-color-scheme');var d=s==='dark'||((!s||s==='auto')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();`
        },
        {
          id: '9683823448',
          src: 'https://ads.maxvaluead.com/scripts/maxvalue_ads_9683823448.js',
          defer: true
        }
      ]
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
    'shadcn-nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    baseUrl: 'https://techdeal.io.vn',
    locales: [
      { code: 'vi', language: 'vi-VN', file: 'vi.json' },
      { code: 'en', language: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'vi',
    strategy: 'prefix_except_default',
    // Chỉ tự redirect theo Accept-Language khi vào đúng trang gốc "/" (redirectOn: 'root'),
    // KHÔNG áp dụng cho link sâu (vd 1 bài blog VI cụ thể) vì không phải bài nào cũng có
    // bản dịch tiếng Anh — redirect ở đó có thể dẫn tới 404. Cookie lưu lại lựa chọn
    // (auto-detect lẫn khi user tự bấm đổi ngôn ngữ) nên chỉ detect một lần duy nhất.
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'vi'
    },
    langDir: 'locales'
  },

  shadcn: {
    prefix: '',
    componentDir: '@@/shared/ui'
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
    // Deals pages được biên tập thủ công, cần thấy nội dung mới lập tức.
    // ssr true: render trực tiếp trên mỗi request để tránh lỗi kẹt cache SWR của Vercel/Cloudflare.
    '/deals/**': { ssr: true },
    '/admin/**': { ssr: false },
    // Trang tĩnh tuyệt đối, không có dữ liệu theo user/thời gian thực —
    // prerender ở build time, phục vụ như file tĩnh, không tốn CPU function.
    '/about': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/contact': { prerender: true }
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
  components: [{ path: '@@/shared/ui', prefix: 'Ui', extensions: ['vue'] }, '~/components']
})
