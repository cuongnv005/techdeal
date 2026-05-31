<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  theme?: 'blue' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'blue'
})

const isBlue = computed(() => props.theme === 'blue')

// Compute classes/content based on theme
const footerBgClass = computed(() =>
  isBlue.value
    ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
    : 'bg-zinc-955 dark:bg-zinc-950 border-zinc-900 text-zinc-550'
)
const hoverTextClass = computed(() =>
  isBlue.value ? 'hover:text-[#3498db]' : 'hover:text-[#e74c3c]'
)
const textMutedClass = computed(() => (isBlue.value ? 'text-zinc-500' : 'text-zinc-400'))
const titleText = computed(() => (isBlue.value ? 'TECHDEAL.' : 'TECHDEAL GAMING.'))
const descriptionText = computed(() =>
  isBlue.value
    ? 'Trang blog cập nhật tin công nghệ và khoa học máy tính nhanh chóng, chuẩn xác.'
    : 'Kênh thông tin game và phần cứng chơi game chuyên nghiệp hàng đầu Việt Nam.'
)
const middleColTitle = computed(() => (isBlue.value ? 'Liên kết hữu ích' : 'Danh mục phổ biến'))
const supportEmail = computed(() => (isBlue.value ? 'contact@techdeal.com' : 'gaming@techdeal.com'))
const supportPhone = computed(() => (isBlue.value ? '+84 (0) 822144589' : '+84 (0) 874557944'))
const copyrightText = computed(() =>
  isBlue.value
    ? '© 2026 TECHDEAL News Magazine. Mọi quyền được bảo lưu.'
    : '© 2026 TECHDEAL Gaming Hub. All rights reserved.'
)
</script>

<template>
  <footer
    class="text-xs py-10 mt-16 border-t transition-colors duration-300"
    :class="footerBgClass"
  >
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand Info -->
        <div>
          <NuxtLink to="/">
            <h4
              class="text-white text-lg font-black tracking-tight mb-4 transition-colors"
              :class="hoverTextClass"
            >
              {{ titleText }}
            </h4>
          </NuxtLink>
          <p class="leading-relaxed" :class="textMutedClass">
            {{ descriptionText }}
          </p>
        </div>

        <!-- Links Column -->
        <div>
          <h4 class="text-white font-bold uppercase mb-4">{{ middleColTitle }}</h4>
          <ul v-if="isBlue" class="space-y-2">
            <li><NuxtLink to="/terms" class="hover:text-white transition-colors">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-white transition-colors">About & Newsletter</NuxtLink></li>
          </ul>
          <ul v-else class="space-y-2">
            <li>
              <NuxtLink to="/cong-nghe" class="hover:text-white transition-colors"
                >Công nghệ</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/windows" class="hover:text-white transition-colors">Windows</NuxtLink>
            </li>
            <li><NuxtLink to="/ios" class="hover:text-white transition-colors">iOS</NuxtLink></li>
            <li>
              <NuxtLink to="/android" class="hover:text-white transition-colors">Android</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/pc" class="hover:text-white transition-colors">PC máy tính</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div>
          <h4 class="text-white font-bold uppercase mb-4">Liên hệ hỗ trợ</h4>
          <p class="mb-2" :class="textMutedClass">Email: {{ supportEmail }}</p>
          <p :class="textMutedClass">Điện thoại: {{ supportPhone }}</p>
        </div>
      </div>
      <div
        class="border-t mt-8 pt-6 text-center text-[10px] border-zinc-800 dark:border-zinc-900 text-zinc-600"
      >
        {{ copyrightText }}
      </div>
    </div>
  </footer>
</template>
