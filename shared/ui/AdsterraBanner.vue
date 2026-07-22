<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  adKey: string
  width: number
  height: number
}>()

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // atOptions là biến TOÀN CỤC mà invoke.js đọc ngay khi chạy — vì trang có
  // nhiều banner Adsterra cùng lúc (trái/phải/giữa), phải ép invoke.js chạy
  // ĐÚNG THỨ TỰ ngay sau khi set atOptions của chính nó (async = false), nếu
  // không dễ bị lẫn kích thước giữa các vị trí khi nhiều component cùng mount.
  const optionsScript = document.createElement('script')
  optionsScript.text = `atOptions = {
    'key': '${props.adKey}',
    'format': 'iframe',
    'height': ${props.height},
    'width': ${props.width},
    'params': {}
  };`
  container.value?.appendChild(optionsScript)

  const invokeScript = document.createElement('script')
  invokeScript.src = `https://www.highperformanceformat.com/${props.adKey}/invoke.js`
  invokeScript.async = false
  container.value?.appendChild(invokeScript)
})
</script>

<template>
  <div
    ref="container"
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="overflow-hidden"
  ></div>
</template>
