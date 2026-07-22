<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  adKey: string
  width: number
  height: number
}>()

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // atOptions là biến TOÀN CỤC mà invoke.js đọc — nếu nhiều banner Adsterra
  // cùng đặt trên 1 trang (trái/phải/giữa), việc set atOptions tuần tự trên
  // CÙNG 1 window sẽ bị ghi đè lẫn nhau trước khi từng invoke.js (tải file
  // ngoài, có độ trễ mạng) kịp đọc đúng giá trị của chính nó — dẫn tới chỉ
  // banner set atOptions SAU CÙNG mới nhận đúng, các banner còn lại không
  // hiện gì (đã xác nhận qua HTML thật: chỉ 1/4 banner có iframe được tạo).
  // Cách sửa: mỗi banner chạy trong 1 <iframe> riêng, có window/document độc
  // lập — atOptions của banner này không thể bị banner khác ghi đè.
  const iframe = document.createElement('iframe')
  iframe.style.border = 'none'
  iframe.style.width = `${props.width}px`
  iframe.style.height = `${props.height}px`
  iframe.style.overflow = 'hidden'
  iframe.setAttribute('scrolling', 'no')
  container.value?.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return
  const closeTag = '</' + 'script>'
  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;">
        <script>
          atOptions = {
            'key': '${props.adKey}',
            'format': 'iframe',
            'height': ${props.height},
            'width': ${props.width},
            'params': {}
          };
        ${closeTag}
        <script src="https://www.highperformanceformat.com/${props.adKey}/invoke.js">${closeTag}
      </body>
    </html>
  `)
  doc.close()
})
</script>

<template>
  <div
    ref="container"
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="overflow-hidden"
  ></div>
</template>
