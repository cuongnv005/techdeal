export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gtagId = config.public.gtagId

  if (!gtagId) {
    if (process.dev) {
      console.warn('Google Analytics tracking ID (NUXT_PUBLIC_GTAG_ID) is not defined.')
    }
    return
  }

  // Inject Google Tag script and initialize dataLayer
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
        async: true
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtagId}', {
            page_path: '${useRoute().fullPath}'
          });
        `,
        type: 'text/javascript'
      }
    ]
  })

  // Listen to router changes and send page views to Google Analytics
  const router = useRouter()
  router.afterEach((to) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('config', gtagId, {
        page_path: to.fullPath,
        page_title: to.meta.title || (typeof document !== 'undefined' ? document.title : '')
      })
    }
  })
})
