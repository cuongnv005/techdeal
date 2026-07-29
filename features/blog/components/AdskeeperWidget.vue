<script setup lang="ts">
import { onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    widgetId: string
    scriptUrl: string
  }>(),
  {
    widgetId: '2060410',
    scriptUrl: 'https://jsc.adskeeper.com/site/1106120.js'
  }
)

onMounted(() => {
  if (process.client) {
    // 1. Inject head script if not already present
    const scriptId = 'adskeeper-js-sdk'
    const isScriptLoaded =
      document.getElementById(scriptId) ||
      document.querySelector(`script[src="${props.scriptUrl}"]`) ||
      document.querySelector('script[src*="adskeeper.com"]')
    if (!isScriptLoaded) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = props.scriptUrl
      script.async = true
      document.head.appendChild(script)
    }

    // 2. Trigger loading queue for the widget
    try {
      const w = window as any
      w._mgq = w._mgq || []
      w._mgq.push(['_mgc.load'])
    } catch (e) {
      console.warn('Adskeeper load trigger error:', e)
    }
  }
})
</script>

<template>
  <div class="adskeeper-widget-wrapper w-full my-6">
    <!-- Adskeeper target container -->
    <div data-type="_mgwidget" :data-widget-id="props.widgetId"></div>
  </div>
</template>
