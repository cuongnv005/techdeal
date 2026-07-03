<script setup lang="ts">
// Banner tĩnh (ảnh + link) do publisher tự thiết kế hoặc nhà quảng cáo cung cấp.
// KHÔNG phải Google ad, KHÔNG có JS bên thứ ba — nên an toàn đặt trên mọi trang,
// kể cả /go, /giveaway (không dính chính sách vị trí quảng cáo của AdSense).
withDefaults(
  defineProps<{
    href: string
    image: string
    alt?: string
    width?: string
    height?: string
  }>(),
  {
    alt: 'Quảng cáo',
    width: '100%',
    height: 'auto'
  }
)
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer sponsored"
    class="block overflow-hidden rounded-lg mx-auto"
    :style="{ maxWidth: width }"
  >
    <img :src="image" :alt="alt" class="w-full h-full object-cover" :style="{ height }" />
  </a>
</template>
