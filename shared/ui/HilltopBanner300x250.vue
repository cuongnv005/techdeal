<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Script HilltopAds tự chèn quảng cáo vào script cuối cùng trong DOM tại thời
// điểm nó chạy (dùng d.scripts[d.scripts.length - 1] + insertBefore) — vì vậy
// phải tạo bằng document.createElement('script') + appendChild (chạy được),
// KHÔNG dùng v-html (trình duyệt không thực thi script chèn qua innerHTML).
const HILLTOP_SCRIPT = `(function(uchiwl){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = uchiwl || {};
s.src = "\\/\\/sophisticatedpin.com\\/b.XGVFsrdgGHln0DY\\/Wqcs\\/revm_9OufZJUTlOkGPxTbchy\\/NqD-YE5SMvDhkbtgNvzYIY0KNKjSkFxRMQwt";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const loader = document.createElement('script')
  loader.innerHTML = HILLTOP_SCRIPT
  container.value?.appendChild(loader)
})
</script>

<template>
  <div ref="container" class="w-[300px] h-[250px] overflow-hidden"></div>
</template>
