<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-vue-next'

// State variables
const loginIdentifier = ref('') // email or username
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = () => {
  if (!loginIdentifier.value || !password.value) {
    alert('Vui lòng điền đầy đủ thông tin!')
    return
  }
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    alert(`Đăng nhập thành công với tài khoản: ${loginIdentifier.value}`)
    navigateTo('/')
  }, 1000)
}

const handleGoogleLogin = () => {
  alert('Đang chuyển hướng sang cổng đăng nhập Google...')
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
      <!-- Decorative background blur circles -->
      <div
        class="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-500/20 dark:bg-red-500/10 blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-500/20 dark:bg-zinc-800/20 blur-3xl"
      ></div>

      <!-- Top logo -->
      <div class="flex items-center gap-2 relative z-10">
        <span class="text-3xl font-black tracking-tighter">
          ZAIRA<span class="text-[#f1c40f]">.</span>
        </span>
        <span class="px-2 py-0.5 text-[10px] font-bold bg-[#e74c3c] text-white rounded">HUBS</span>
      </div>

      <!-- Mid quote/text -->
      <div class="my-auto relative z-10 max-w-md space-y-4">
        <h2 class="text-4xl font-extrabold leading-tight">
          Kết nối & Cập nhật thế giới Công nghệ - Game hàng đầu
        </h2>
        <p class="text-zinc-300 text-sm leading-relaxed">
          Đăng nhập ngay để cá nhân hóa nguồn cấp tin tức của bạn, thảo luận cùng cộng đồng Zaira và
          nhận thông tin nóng hổi nhất.
        </p>
      </div>

      <!-- Bottom copy -->
      <div class="text-xs text-zinc-400 relative z-10">
        © 2026 ZAIRA News Magazine. All rights reserved.
      </div>
    </div>

    <!-- Right side: Authentication Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div
        class="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-md transition-all duration-300"
      >
        <div class="text-center lg:text-left">
          <h1 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            Đăng nhập tài khoản
          </h1>
          <p class="text-xs text-zinc-550 dark:text-zinc-400 mt-2">
            Chào mừng bạn quay lại với Zaira.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username / Email Input -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 block"
              >Username hoặc Email</label
            >
            <div class="relative">
              <span class="absolute left-3 top-3 text-zinc-400">
                <User class="w-4 h-4" />
              </span>
              <input
                v-model="loginIdentifier"
                type="text"
                placeholder="Nhập tên đăng nhập hoặc email..."
                class="w-full text-xs pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">Mật khẩu</label>
              <NuxtLink to="/forgot-password" class="text-[11px] text-[#3498db] dark:text-red-400 hover:underline"
                >Quên mật khẩu?</NuxtLink
              >
            </div>
            <div class="relative">
              <span class="absolute left-3 top-3 text-zinc-400">
                <Lock class="w-4 h-4" />
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu của bạn..."
                class="w-full text-xs pl-10 pr-10 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-zinc-400 hover:text-zinc-650"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="isLoading">Đang đăng nhập...</span>
            <span v-else class="flex items-center gap-1.5"
              >Đăng nhập <ArrowRight class="w-4 h-4"
            /></span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          <span
            class="flex-shrink mx-4 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold"
            >Hoặc đăng nhập với</span
          >
          <div class="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        <!-- Social login: Google Button -->
        <button
          type="button"
          @click="handleGoogleLogin"
          class="w-full py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors shadow-xs cursor-pointer"
        >
          <!-- SVG Google Icon -->
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <!-- Redirect path -->
        <p class="text-xs text-center text-zinc-500 dark:text-zinc-400">
          Chưa có tài khoản?
          <NuxtLink
            to="/register"
            class="font-bold text-[#3498db] dark:text-red-400 hover:underline"
            >Đăng ký ngay</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
