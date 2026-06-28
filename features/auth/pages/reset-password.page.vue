<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRoute } from '#app'
import { Lock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-vue-next'

const route = useRoute()
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const errorMsg = ref('')

onMounted(() => {
  token.value = (route.query.token as string) || ''
  if (!token.value) {
    errorMsg.value =
      'Mã xác nhận không hợp lệ hoặc đã thiếu. Vui lòng kiểm tra lại liên kết trong email của bạn.'
  }
})

const handleResetPassword = async () => {
  if (!token.value) {
    alert('Mã token không hợp lệ!')
    return
  }

  if (newPassword.value.length < 6) {
    alert('Mật khẩu mới phải có ít nhất 6 ký tự!')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  try {
    const res = await fetch(
      'https://techdeal-worker.mdchannelvn.workers.dev/api/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token.value, password: newPassword.value })
      }
    )
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đặt lại mật khẩu thất bại!')
    }
    isSubmitted.value = true
  } catch (error: any) {
    errorMsg.value = error.message || 'Có lỗi xảy ra, vui lòng thử lại sau!'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex bg-gray-150 dark:bg-zinc-950 transition-colors duration-300 font-display"
  >
    <!-- Left side: Beautiful branding column (hidden on mobile) -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-sky-600 to-indigo-900 dark:from-red-950 dark:to-zinc-900 text-white p-12 flex-col justify-between relative overflow-hidden"
    >
      <div
        class="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-500/20 dark:bg-red-500/10 blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-500/20 dark:bg-zinc-800/20 blur-3xl"
      ></div>

      <!-- Top logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 relative z-10 hover:opacity-90 transition-opacity"
      >
        <span class="text-3xl font-black tracking-tighter">
          TECHDEAL<span class="text-[#f1c40f]">.</span>
        </span>
        <span class="px-2 py-0.5 text-[10px] font-bold bg-[#e74c3c] text-white rounded">HUBS</span>
      </NuxtLink>

      <!-- Mid text -->
      <div class="my-auto relative z-10 max-w-md space-y-4">
        <h2 class="text-4xl font-extrabold leading-tight">Đặt lại mật khẩu mới</h2>
        <p class="text-zinc-300 text-sm leading-relaxed">
          Tạo mật khẩu mạnh để bảo vệ tài khoản tốt hơn. Mật khẩu nên kết hợp chữ, số và ký tự đặc
          biệt.
        </p>
      </div>

      <!-- Bottom copy -->
      <div class="text-xs text-zinc-400 relative z-10">
        © 2026 TECHDEAL News Magazine. All rights reserved.
      </div>
    </div>

    <!-- Right side: Reset Password Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div
        class="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-md transition-all duration-300"
      >
        <!-- Back to login link -->
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft class="w-4 h-4" /> Quay lại đăng nhập
        </NuxtLink>

        <!-- Error view if token invalid or loaded error -->
        <div
          v-if="errorMsg && !isSubmitted"
          class="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs space-y-3"
        >
          <p class="font-medium">{{ errorMsg }}</p>
          <NuxtLink
            to="/forgot-password"
            class="inline-block text-xs font-bold underline hover:opacity-85"
          >
            Yêu cầu liên kết mới
          </NuxtLink>
        </div>

        <div v-if="!isSubmitted && token" class="space-y-6">
          <div>
            <h1 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              Đặt lại mật khẩu
            </h1>
            <p class="text-xs text-zinc-550 dark:text-zinc-400 mt-2">
              Nhập mật khẩu mới của bạn bên dưới.
            </p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-5">
            <!-- Password Input -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 block"
                >Mật khẩu mới</label
              >
              <div class="relative">
                <span class="absolute left-3 top-3 text-zinc-400">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="••••••••"
                  class="w-full text-xs pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                  required
                />
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 block"
                >Xác nhận mật khẩu mới</label
              >
              <div class="relative">
                <span class="absolute left-3 top-3 text-zinc-400">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  class="w-full text-xs pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                  required
                />
              </div>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span v-if="isLoading">Đang lưu...</span>
              <span v-else class="flex items-center gap-1.5"
                >Cập nhật mật khẩu <ArrowRight class="w-4 h-4"
              /></span>
            </button>
          </form>
        </div>

        <!-- Success view -->
        <div v-else-if="isSubmitted" class="space-y-6 text-center lg:text-left">
          <div
            class="w-12 h-12 bg-green-500/10 text-green-500 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto lg:mx-0"
          >
            <CheckCircle2 class="w-6 h-6" :stroke-width="2.5" />
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Cập nhật thành công!</h2>
            <p class="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
              Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập vào tài
              khoản của mình bằng mật khẩu mới này.
            </p>
          </div>
          <NuxtLink
            to="/login"
            class="w-full py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Đăng nhập ngay
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
