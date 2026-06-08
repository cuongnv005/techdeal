<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-vue-next'

import { AuthRepository } from '../api/auth'

import { useUserStore } from '@stores/user'

const username = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const userStore = useUserStore()
const authRepo = new AuthRepository()
const config = useRuntimeConfig()

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value) {
    alert('Vui lòng nhập đầy đủ các trường thông tin bắt buộc!')
    return
  }
  isLoading.value = true
  try {
    await authRepo.register(username.value, email.value, password.value)
    alert(`Đăng ký thành công tài khoản: ${username.value}. Hãy đăng nhập!`)
    navigateTo('/login')
  } catch (e: any) {
    console.error(e)
    alert(e?.response?.data?.error || 'Đăng ký tài khoản thất bại!')
  } finally {
    isLoading.value = false
  }
}

const handleCredentialResponse = async (response: any) => {
  const idToken = response.credential
  isLoading.value = true
  try {
    const res = await fetch('https://techdeal-worker.mdchannelvn.workers.dev/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken: idToken })
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(
        errorData.error || errorData.message || 'Đăng nhập Google thất bại từ server!'
      )
    }

    const resData = await res.json()
    const authData = resData.data || resData

    if (authData && authData.token && authData.user) {
      userStore.setAuth(authData.token, authData.user)
      alert(`Đăng nhập thành công! Chào mừng ${authData.user.username || authData.user.email}`)
      let redirectUrl = '/'
      if (process.client) {
        const savedRedirect = localStorage.getItem('google_login_redirect_url')
        if (savedRedirect) {
          redirectUrl = savedRedirect
          localStorage.removeItem('google_login_redirect_url')
        }
      }
      navigateTo(redirectUrl)
    } else {
      throw new Error('Không nhận được thông tin xác thực từ máy chủ!')
    }
  } catch (e: any) {
    console.error(e)
    alert(e?.message || 'Đăng nhập bằng Google thất bại!')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const route = useRoute()
  const token = route.query.token as string
  const userId = route.query.userId as string
  const usernameParam = route.query.username as string
  const roleParam = route.query.role as 'admin' | 'mod' | 'user'

  if (token && userId && usernameParam) {
    try {
      const decodedUsername = decodeURIComponent(usernameParam).replace(/\+/g, ' ')
      const user = {
        id: userId,
        username: decodedUsername,
        email: (route.query.email as string) || '',
        role: roleParam || 'user'
      }
      userStore.setAuth(token, user)
      alert(`Đăng nhập thành công! Chào mừng ${user.username}`)
      let redirectUrl = '/'
      if (process.client) {
        const savedRedirect = localStorage.getItem('google_login_redirect_url')
        if (savedRedirect) {
          redirectUrl = savedRedirect
          localStorage.removeItem('google_login_redirect_url')
        }
      }
      navigateTo(redirectUrl)
      return
    } catch (e) {
      console.error('Lỗi đăng nhập Google Redirect:', e)
    }
  }

  if (process.client) {
    // Dynamically load Google Identity Services SDK
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      const g = (window as any).google
      if (g) {
        g.accounts.id.initialize({
          client_id: config.public.googleClientId,
          login_uri: 'https://techdeal-worker.mdchannelvn.workers.dev/api/auth/google',
          ux_mode: 'redirect',
          auto_select: false
        })

        const googleBtnEl = document.getElementById('google-btn-container')
        if (googleBtnEl) {
          const parentWidth = googleBtnEl.offsetWidth || googleBtnEl.clientWidth || 380
          const buttonWidth = Math.max(200, Math.min(380, parentWidth))
          g.accounts.id.renderButton(googleBtnEl, {
            theme: 'outline',
            size: 'large',
            width: buttonWidth,
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          })
        }
      }
    }
    document.head.appendChild(script)
  }
})
</script>

<template>
  <div
    class="min-h-screen flex bg-gray-155 dark:bg-zinc-950 transition-colors duration-300 font-display"
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
      <NuxtLink
        to="/"
        class="flex items-center gap-2 relative z-10 hover:opacity-90 transition-opacity"
      >
        <span class="text-3xl font-black tracking-tighter">
          TECHDEAL<span class="text-[#f1c40f]">.</span>
        </span>
        <span class="px-2 py-0.5 text-[10px] font-bold bg-[#e74c3c] text-white rounded">HUBS</span>
      </NuxtLink>

      <!-- Mid quote/text -->
      <div class="my-auto relative z-10 max-w-md space-y-4">
        <h2 class="text-4xl font-extrabold leading-tight">
          Tham gia cộng đồng TechDeal ngay hôm nay
        </h2>
        <p class="text-zinc-300 text-sm leading-relaxed">
          Tạo tài khoản để thảo luận các chủ đề nóng hổi về công nghệ, bình luận đánh giá game và
          lưu các bài viết yêu thích của riêng bạn.
        </p>
      </div>

      <!-- Bottom copy -->
      <div class="text-xs text-zinc-400 relative z-10">
        © 2026 TECHDEAL News Magazine. All rights reserved.
      </div>
    </div>

    <!-- Right side: Registration Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
      <div
        class="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-md transition-all duration-300 my-8"
      >
        <div class="text-center lg:text-left">
          <h1 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            Đăng ký tài khoản
          </h1>
          <p class="text-xs text-zinc-550 dark:text-zinc-400 mt-2">
            Đăng ký nhanh chóng chỉ trong vài bước đơn giản.
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Username Input -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 block"
              >Tên tài khoản (Username)</label
            >
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-zinc-400">
                <User class="w-4 h-4" />
              </span>
              <input
                v-model="username"
                type="text"
                placeholder="Nhập tên tài khoản của bạn..."
                class="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                required
              />
            </div>
          </div>

          <!-- Email Input -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Email</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-zinc-400">
                <Mail class="w-4 h-4" />
              </span>
              <input
                v-model="email"
                type="email"
                placeholder="Nhập địa chỉ email..."
                class="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Mật khẩu</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-zinc-400">
                <Lock class="w-4 h-4" />
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                class="w-full text-xs pl-10 pr-10 py-2.5 border border-gray-200 dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                minlength="6"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-650"
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
            class="w-full py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span v-if="isLoading">Đang đăng ký...</span>
            <span v-else class="flex items-center gap-1.5"
              >Đăng ký tài khoản <ArrowRight class="w-4 h-4"
            /></span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          <span
            class="flex-shrink mx-4 text-[10px] text-zinc-450 dark:text-zinc-550 uppercase font-semibold"
            >Hoặc tiếp tục với</span
          >
          <div class="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        <!-- Google login -->
        <div class="w-full flex justify-center">
          <div id="google-btn-container" class="w-full min-h-[40px]"></div>
        </div>

        <!-- Redirect back to login -->
        <p class="text-xs text-center text-zinc-555 dark:text-zinc-400">
          Đã có tài khoản?
          <NuxtLink to="/login" class="font-bold text-[#3498db] dark:text-red-400 hover:underline"
            >Đăng nhập</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
