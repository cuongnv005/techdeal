<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  if (process.client) {
    const scriptId = 'accesstrade-floating-ad-script'
    const isScriptLoaded = document.getElementById(scriptId)

    const initAd = (): void => {
      const w = window as any
      if (typeof w.FloatingAd !== 'undefined') {
        try {
          const config = {
            imageUrl:
              'https://content.accesstrade.vn/evidence_add_lost/2026/img/upload/1787815251_add_lost_add_lost_tmpbo5loshf.png',
            linkUrl:
              'https://go.isclix.com/deep_link/v6/7033129334406990266/5087153089503673507?sub3=floating_ads_icon&url_enc=aHR0cHM6Ly93d3cubGF6YWRhLnZuL3Byb2R1Y3RzL3BkcC1pMjc4OTg2NTEyNi1zMTQ2ODQ0NDkxMDEuaHRtbD9yZWZlcmVyPWF0LWtvbA%3D%3D',
            position: { top: '40%', right: '20px', bottom: null, left: null },
            width: '120px',
            height: '120px',
            showCloseButton: true,
            animation: 'zoom',
            autoCloseAfter: 0,
            isBaitClick: false,
            openModal: false,
            openDelay: 3000
          }

          if (typeof w.FloatingAd.init === 'function') {
            w.accesstradeAdInstance = w.FloatingAd.init(config)
          } else if (typeof w.FloatingAd.create === 'function') {
            w.accesstradeAdInstance = w.FloatingAd.create(config)
          }
        } catch (e) {
          console.error('Failed to initialize AccessTrade Floating Ad:', e)
        }
      }
    }

    const checkAndInit = (): void => {
      const w = window as any
      if (typeof w.FloatingAd !== 'undefined') {
        initAd()
      } else {
        let attempts = 0
        const interval = setInterval((): void => {
          attempts++
          if (typeof w.FloatingAd !== 'undefined') {
            clearInterval(interval)
            initAd()
          } else if (attempts > 50) {
            clearInterval(interval)
          }
        }, 100)
      }
    }

    if (!isScriptLoaded) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://static.accesstrade.vn/js/v2/floating-ads-icon.min.js'
      script.async = true
      script.onload = (): void => {
        checkAndInit()
      }
      document.head.appendChild(script)
    } else {
      checkAndInit()
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    const w = window as any
    if (w.accesstradeAdInstance && typeof w.accesstradeAdInstance.close === 'function') {
      try {
        w.accesstradeAdInstance.close()
        w.accesstradeAdInstance = null
      } catch (e) {
        console.error('Failed to close AccessTrade Floating Ad:', e)
      }
    }
  }
})
</script>

<template>
  <div style="display: none"></div>
</template>
