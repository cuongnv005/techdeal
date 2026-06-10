<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
  Gift,
  Clock,
  Key,
  Flame,
  AlertTriangle,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MousePointerClick,
  UserPlus
} from 'lucide-vue-next'
import { usePublicGiveaway } from '../composables/use-giveaway'
import { useUserStore } from '@stores/user'
import { AuthRepository } from '../../auth/api/auth'
import AdBanner from '../../blog/components/AdBanner.vue'

const route = useRoute()
const userStore = useUserStore()
const authRepo = new AuthRepository()
const config = useRuntimeConfig()

const giveawayId = computed(() => (route.query.id as string) || '')

const { giveaway, isLoading, error, claim, claimError, isClaiming, refresh } =
  await usePublicGiveaway(giveawayId.value)

// Modals
const isAuthModalOpen = ref(false)
const authTab = ref<'login' | 'register'>('login')
const isExpiredModalOpen = ref(false)
const isHowItWorksOpen = ref(false)
const claimSuccessLink = ref<string | null>(null)

// Login / Register Form Fields
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isAuthLoading = ref(false)

// Google Sign-In initialization
const initGoogleSignIn = () => {
  if (!process.client) return

  let script = document.querySelector(
    'script[src="https://accounts.google.com/gsi/client"]'
  ) as HTMLScriptElement

  const setupButton = () => {
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
        const parentWidth = googleBtnEl.offsetWidth || googleBtnEl.clientWidth || 340
        const buttonWidth = Math.max(200, Math.min(340, parentWidth))
        g.accounts.id.renderButton(googleBtnEl, {
          theme: 'outline',
          size: 'large',
          width: buttonWidth,
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        })
      }
    }
  }

  if (!script) {
    script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = setupButton
    document.head.appendChild(script)
  } else {
    if ((window as any).google) {
      setupButton()
    } else {
      script.addEventListener('load', setupButton)
    }
  }
}

watch([isAuthModalOpen, authTab], async ([isOpen]) => {
  if (isOpen) {
    if (process.client) {
      localStorage.setItem(
        'google_login_redirect_url',
        window.location.pathname + window.location.search
      )
    }
    await nextTick()
    initGoogleSignIn()
  }
})

const isReferrerInvalid = ref(false)

// Check expiry status on load and show modal
onMounted(() => {
  if (process.client) {
    localStorage.removeItem('google_login_redirect_url')

    // Check if referrer is valid (came from techdeal.io.vn) or if we verified this session already
    if (sessionStorage.getItem('techdeal_valid_session') === 'true') {
      isReferrerInvalid.value = false
    } else {
      const referrer = document.referrer
      if (referrer) {
        try {
          const url = new URL(referrer)
          const hostname = url.hostname
          // Allow if it comes from techdeal.io.vn or subdomains, or localhost for local dev
          if (
            hostname.endsWith('techdeal.io.vn') ||
            hostname.includes('localhost') ||
            hostname.includes('192.168.1.56:3000')
          ) {
            isReferrerInvalid.value = false
            sessionStorage.setItem('techdeal_valid_session', 'true')
          } else {
            isReferrerInvalid.value = true
          }
        } catch (e) {
          isReferrerInvalid.value = true
        }
      } else {
        // Direct link paste
        isReferrerInvalid.value = true
      }
    }
  }
  if (giveaway.value?.is_expired) {
    isExpiredModalOpen.value = true
  }
})

// Listen to giveaway changes to trigger expired modal
watch(
  () => giveaway.value,
  (newVal) => {
    if (newVal?.is_expired) {
      isExpiredModalOpen.value = true
    }
  },
  { immediate: true }
)

const handleAuthAction = async () => {
  isAuthLoading.value = false
  if (authTab.value === 'login') {
    if (!email.value || !password.value) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }
    isAuthLoading.value = true
    try {
      const data = await authRepo.login(email.value, password.value)
      userStore.setAuth(data.token, data.user)
      isAuthModalOpen.value = false
      await refresh()
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Đăng nhập thất bại!')
    } finally {
      isAuthLoading.value = false
    }
  } else {
    if (!username.value || !email.value || !password.value || !confirmPassword.value) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }
    if (password.value !== confirmPassword.value) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    isAuthLoading.value = true
    try {
      await authRepo.register(username.value, email.value, password.value)
      const loginData = await authRepo.login(email.value, password.value)
      userStore.setAuth(loginData.token, loginData.user)
      isAuthModalOpen.value = false
      await refresh()
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Đăng ký thất bại!')
    } finally {
      isAuthLoading.value = false
    }
  }
}

const triggerConfetti = () => {
  return new Promise<void>((resolve) => {
    if (!process.client) {
      resolve()
      return
    }

    let script = document.querySelector(
      'script[src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"]'
    ) as HTMLScriptElement

    const runConfetti = () => {
      const confetti = (window as any).confetti
      if (confetti) {
        // Single light burst from left & right
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 45,
          origin: { x: 0, y: 0.8 },
          colors: ['#7C3AED', '#3498db', '#2ecc71', '#f1c40f']
        })
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 45,
          origin: { x: 1, y: 0.8 },
          colors: ['#7C3AED', '#3498db', '#2ecc71', '#f1c40f']
        })
      }
      // Wait 2.5 seconds for confetti to finish falling
      setTimeout(() => {
        resolve()
      }, 2500)
    }

    if (!script) {
      script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
      script.async = true
      script.defer = true
      script.onload = runConfetti
      document.head.appendChild(script)
    } else {
      if ((window as any).confetti) {
        runConfetti()
      } else {
        script.addEventListener('load', runConfetti)
      }
    }
  })
}

const handleClaim = async () => {
  if (!userStore.isAuthenticated) {
    authTab.value = 'login'
    isAuthModalOpen.value = true
    return
  }

  const link = await claim()
  if (link) {
    claimSuccessLink.value = link
    await triggerConfetti()
    if (process.client) {
      window.location.href = link
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}
</script>

<template>
  <div
    class="zeecast-wrap min-h-screen bg-white text-black font-sans relative overflow-hidden flex flex-col justify-between"
  >
    <!-- Import Fonts for Zee Cast aesthetic -->
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
    </Head>

    <!-- Subtle grid background & glow -->
    <div class="absolute inset-0 pointer-events-none hero-grid-bg"></div>
    <div
      class="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[900px] h-[700px] bg-[#7c3aed]/5 rounded-full blur-[160px] pointer-events-none"
    ></div>

    <!-- Left Skyscraper Ad -->
    <div class="hidden xl:block 2xl:hidden fixed left-4 top-[150px] z-20 w-[160px]">
      <AdBanner width="160px" height="600px" :is-google-ad="true" />
    </div>
    <div class="hidden 2xl:block fixed left-[calc(50%-770px)] top-[150px] z-20 w-[300px]">
      <AdBanner width="300px" height="600px" :is-google-ad="true" />
    </div>

    <!-- Right Skyscraper Ad -->
    <div class="hidden xl:block 2xl:hidden fixed right-4 top-[150px] z-20 w-[160px]">
      <AdBanner width="160px" height="600px" :is-google-ad="true" />
    </div>
    <div class="hidden 2xl:block fixed right-[calc(50%-770px)] top-[150px] z-20 w-[300px]">
      <AdBanner width="300px" height="600px" :is-google-ad="true" />
    </div>

    <!-- Minimal Header (Zee Cast Style) -->
    <header
      class="w-full py-6 px-8 relative z-25 flex items-center justify-between border-b border-black/5 bg-white/70 backdrop-blur-md"
    >
      <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-85 transition-opacity">
        <span class="text-xl font-extrabold font-serif tracking-tight text-black">
          TECHDEAL<span class="text-[#7C3AED]">.</span>
        </span>
        <span class="px-1.5 py-0.5 text-[8px] font-black bg-[#7C3AED] text-white rounded"
          >HUBS</span
        >
      </NuxtLink>
      <div
        v-if="userStore.isAuthenticated"
        class="text-[10px] font-bold uppercase tracking-wider text-zinc-500"
      >
        Hi, {{ userStore.username }}
      </div>
    </header>

    <!-- Main Content Section -->
    <main class="flex-grow py-12 px-4 relative z-10">
      <div class="container mx-auto max-w-4xl space-y-16">
        <!-- Loading State -->
        <div v-if="(isLoading || !giveaway) && !error" class="py-24 text-center space-y-6">
          <div
            class="w-14 h-14 border-[3px] border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto"
          ></div>
          <p class="text-zinc-550 text-xs font-semibold uppercase tracking-wider">
            Đang kết nối đến TechDeal Hub...
          </p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error || !giveaway || !giveawayId || isReferrerInvalid"
          class="py-16 px-8 text-center bg-white rounded-[32px] border-2 border-black shadow-[0_20px_60px_rgba(0,0,0,0.08)] max-w-lg mx-auto space-y-6"
        >
          <div
            class="w-16 h-16 mx-auto bg-red-50 text-red-650 rounded-2xl flex items-center justify-center border-2 border-black"
          >
            <AlertTriangle class="w-8 h-8" />
          </div>
          <h2 class="text-2xl font-black font-serif tracking-tight leading-none uppercase">
            {{ isReferrerInvalid ? 'Truy cập không hợp lệ' : 'Không tìm thấy giveaway' }}
          </h2>
          <p class="text-zinc-600 text-sm leading-relaxed max-w-xs mx-auto">
            <template v-if="isReferrerInvalid">
              Để nhận quà giveaway này, bạn vui lòng truy cập thông qua đường dẫn chính thức trong
              các bài viết trên trang web
              <a href="https://techdeal.io.vn" class="text-[#7C3AED] font-bold hover:underline"
                >TechDeal</a
              >. Chia sẻ hoặc dán trực tiếp link không được chấp nhận.
            </template>
            <template v-else>
              Chương trình giveaway không tồn tại, đã kết thúc hoặc đường dẫn không chính xác.
            </template>
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-900 text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] uppercase tracking-wider"
          >
            Về Trang Chủ <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Public Detail Content -->
        <template v-else>
          <!-- HERO BLOCK - HEADER ONLY -->
          <section class="text-center space-y-6 max-w-5xl mx-auto">
            <!-- App Icon with floating animation -->
            <div
              class="app-icon-container w-24 h-24 bg-white border-2 border-black rounded-[24px] flex items-center justify-center shadow-[0_20px_60px_rgba(124,58,237,0.15)] mx-auto animate-float"
            >
              <Gift class="w-12 h-12 text-[#7C3AED]" />
            </div>

            <!-- Brow label badge -->
            <div
              class="inline-flex items-center gap-1.5 bg-[#fbf8ff] border-2 border-black text-[#7c3aed] text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-[2px_2px_0_rgba(0,0,0,1)]"
            >
              <Sparkles class="w-3.5 h-3.5" /> CHƯƠNG TRÌNH ĐỘC QUYỀN
            </div>

            <!-- Serif H1 Title -->
            <div class="space-y-3">
              <h1
                class="font-serif font-extrabold text-4xl sm:text-7xl tracking-tight leading-none text-black uppercase title-heading"
              >
                BẢN QUYỀN <br />
                <span class="text-[#7C3AED]">{{ giveaway.app_name }}</span>
              </h1>
              <p
                class="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed"
              >
                Nhận khóa kích hoạt bản quyền chính hãng trị giá
                <span class="font-bold text-black line-through">{{
                  formatPrice(giveaway.original_price)
                }}</span>
                hoàn toàn miễn phí. Chương trình giới hạn số lượng dành riêng cho thành viên
                TechDeal.
              </p>
            </div>
          </section>

          <!-- Mobile Ad 1 (Below Hero Header, above PRO CARD) -->
          <div class="xl:hidden max-w-xl mx-auto px-4">
            <AdBanner width="100%" height="90px" :is-google-ad="true" />
          </div>

          <!-- PRO CARD / GIVEAWAY SPECIFICATIONS (Zee Cast Style) -->
          <section class="max-w-xl mx-auto">
            <div
              class="border-2 border-black rounded-[28px] p-8 sm:p-12 bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <!-- Decorative elements -->
              <div
                class="absolute top-0 right-0 w-24 h-24 bg-[#7c3aed]/5 rounded-bl-full pointer-events-none border-b border-l border-black/5"
              ></div>

              <div
                class="inline-flex items-center gap-1 bg-black text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-6 font-serif"
              >
                <Zap class="w-3.5 h-3.5 fill-current text-yellow-400" /> THÔNG TIN CHI TIẾT
              </div>

              <div
                class="flex items-start justify-between flex-wrap gap-4 border-b-2 border-black/5 pb-6 mb-6"
              >
                <div>
                  <h2
                    class="font-serif text-2xl sm:text-3xl font-extrabold uppercase text-black leading-none mb-1"
                  >
                    {{ giveaway.app_name }}
                  </h2>
                  <p class="text-zinc-500 text-xs font-semibold">Bản quyền phần mềm chính hãng</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-black font-serif text-black leading-none block"
                    >MIỄN PHÍ</span
                  >
                  <span class="text-xs text-zinc-400 line-through tracking-wider block mt-1"
                    >Gốc: {{ formatPrice(giveaway.original_price) }}</span
                  >
                </div>
              </div>

              <!-- List features -->
              <ul class="space-y-4 mb-6">
                <li class="flex items-start gap-3 text-xs text-black">
                  <div
                    class="w-5 h-5 bg-black rounded flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <CheckCircle class="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <strong>Khóa kích hoạt bản quyền 100% chính hãng:</strong>
                    <span class="text-zinc-650 block mt-0.5"
                      >Nhận mã bản quyền hoặc liên kết kích hoạt sạch từ nhà sản xuất.</span
                    >
                  </div>
                </li>

                <li class="flex items-start gap-3 text-xs text-black">
                  <div
                    class="w-5 h-5 bg-black rounded flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <CheckCircle class="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <strong>Số lượng giới hạn:</strong>
                    <span class="text-zinc-650 block mt-0.5">
                      Còn lại
                      <span class="font-bold text-black">{{
                        giveaway.key_quantity - giveaway.keys_claimed
                      }}</span>
                      / {{ giveaway.key_quantity }} key bản quyền.
                    </span>
                  </div>
                </li>

                <li class="flex items-start gap-3 text-xs text-black">
                  <div
                    class="w-5 h-5 bg-black rounded flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <CheckCircle class="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <strong>Thời hạn chương trình:</strong>
                    <span class="text-[#9a3412] font-semibold block mt-0.5">
                      Hết hạn vào: {{ formatDate(giveaway.expiry_date) }}
                    </span>
                  </div>
                </li>
              </ul>

              <!-- Danger Footnote inside Pro Card -->
              <div
                class="p-4 rounded-xl bg-amber-50 border-2 border-black border-dashed flex items-start gap-3"
              >
                <Flame class="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div class="space-y-0.5 text-[11px] text-zinc-700 leading-relaxed font-sans">
                  <strong>Chú ý:</strong> Số lượng có hạn nhanh lấy trước khi chương trình kết thúc
                  và quay về giá gốc. Đừng bỏ lỡ!
                </div>
              </div>
            </div>
          </section>

          <!-- Mobile Ad 2 (Below PRO CARD, above CTA Claim block) -->
          <div class="xl:hidden max-w-md mx-auto px-4">
            <AdBanner width="100%" height="90px" :is-google-ad="true" />
          </div>

          <!-- CTA Claim block -->
          <div class="max-w-md mx-auto pt-4 space-y-4">
            <!-- Case: Already claimed -->
            <div
              v-if="giveaway.has_claimed"
              class="p-6 bg-emerald-55/10 rounded-[24px] border-2 border-black text-center space-y-4 shadow-[4px_4px_0_rgba(0,0,0,1)]"
            >
              <div
                class="w-12 h-12 bg-white border-2 border-black text-emerald-600 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h3 class="font-serif font-bold text-lg text-black">
                  Bạn đã sở hữu khóa bản quyền!
                </h3>
                <p class="text-xs text-zinc-650 font-medium">
                  Khóa kích hoạt phần mềm đã được ghi nhận thành công.
                </p>
              </div>
              <a
                v-if="giveaway.activation_link"
                :href="giveaway.activation_link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[4px_4px_0_rgba(0,0,0,0.15)] border-2 border-black"
              >
                Đến trang kích hoạt ngay <ExternalLink class="w-4 h-4" />
              </a>
            </div>

            <!-- Case: Successful Claim Redirecting -->
            <div
              v-else-if="claimSuccessLink"
              class="p-8 bg-emerald-55/10 rounded-[24px] border-2 border-black text-center space-y-4 shadow-[4px_4px_0_rgba(0,0,0,1)]"
            >
              <div
                class="w-14 h-14 bg-white border-2 border-black text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce"
              >
                <CheckCircle class="w-8 h-8" />
              </div>
              <h3 class="font-serif font-black text-xl text-black uppercase">
                Đang chuyển hướng...
              </h3>
              <p class="text-xs text-zinc-600 leading-relaxed font-sans max-w-xs mx-auto">
                Vui lòng chờ trong giây lát, hệ thống đang chuyển bạn đến liên kết nhận bản quyền
                phần mềm...
              </p>
              <a
                :href="claimSuccessLink"
                class="text-xs font-bold underline hover:no-underline text-[#7C3AED]"
              >
                Hoặc click vào đây để chuyển hướng thủ công
              </a>
            </div>

            <!-- Case: Normal Claim CTA -->
            <div v-else class="space-y-4">
              <button
                @click="handleClaim"
                :disabled="isClaiming || giveaway.is_expired || giveaway.is_out_of_keys"
                class="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isClaiming">Đang xử lý kích hoạt...</span>
                <span v-else class="flex items-center gap-2">
                  LẤY KEY BẢN QUYỀN MIỄN PHÍ <ArrowRight class="w-4 h-4" />
                </span>
              </button>

              <div
                v-if="claimError"
                class="p-4 bg-red-50 border-2 border-black text-red-750 text-xs text-center font-bold rounded-xl shadow-[2px_2px_0_rgba(0,0,0,1)]"
              >
                {{ claimError }}
              </div>
            </div>

            <div class="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
              Yêu cầu tài khoản TechDeal hoạt động
            </div>
            <div class="pt-2">
              <button
                type="button"
                @click="isHowItWorksOpen = true"
                class="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <Clock class="w-3.5 h-3.5" /> Quy trình & Hướng dẫn nhận key
              </button>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Simple Footer (Zee Cast Style) -->
    <footer
      class="w-full py-8 text-center border-t border-black/10 bg-white/50 relative z-20 space-y-4"
    >
      <div class="flex items-center justify-center gap-4 text-xs font-semibold text-zinc-550">
        <NuxtLink to="/terms" class="hover:text-black transition-colors">Điều khoản</NuxtLink>
        <span class="text-zinc-300 text-[10px]">•</span>
        <NuxtLink to="/privacy" class="hover:text-black transition-colors">Bảo mật</NuxtLink>
        <span class="text-zinc-300 text-[10px]">•</span>
        <NuxtLink to="/" class="hover:text-black transition-colors">Trang chủ</NuxtLink>
      </div>
      <div class="text-[10px] text-zinc-400">© 2026 TechDeal.io.vn. Đã được bảo lưu mọi quyền.</div>
    </footer>

    <!-- Modals (Zee Cast inspired premium design) -->

    <!-- Expired Notification Modal -->
    <div
      v-if="isExpiredModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-4 animate-fadeIn"
    >
      <div
        class="bg-[#fffaf1] rounded-[28px] border-2 border-black w-full max-w-sm overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.3)] animate-scaleUp text-center p-8 space-y-6"
      >
        <div
          class="w-14 h-14 bg-white border-2 border-black rounded-2xl flex items-center justify-center mx-auto text-red-500"
        >
          <Clock class="w-7 h-7" />
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-serif font-black uppercase tracking-tight text-black">
            Giveaway Đã Kết Thúc
          </h3>
          <p class="text-xs text-zinc-650 leading-relaxed font-sans">
            Chương trình nhận key miễn phí của ứng dụng này đã kết thúc do hết thời gian hoặc toàn
            bộ key đã được phát hết. Hẹn gặp lại bạn ở các đợt giveaway tiếp theo!
          </p>
        </div>
        <button
          @click="isExpiredModalOpen = false"
          class="w-full py-3 bg-black hover:bg-zinc-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] cursor-pointer"
        >
          Tôi đã hiểu
        </button>
      </div>
    </div>

    <!-- Auth Modal Dialog -->
    <div
      v-if="isAuthModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-4 animate-fadeIn"
    >
      <div
        class="bg-white rounded-[28px] border border-black/15 w-full max-w-sm overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.25)] animate-scaleUp"
      >
        <!-- Modal Header / Tab Switcher -->
        <div class="flex border-b border-black/15 relative">
          <button
            @click="authTab = 'login'"
            class="flex-1 py-4 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors"
            :class="
              authTab === 'login' ? 'text-[#7C3AED] bg-[#7C3AED]/5' : 'text-zinc-400 bg-white'
            "
          >
            Đăng nhập
          </button>
          <button
            @click="authTab = 'register'"
            class="flex-1 py-4 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors"
            :class="
              authTab === 'register' ? 'text-[#7C3AED] bg-[#7C3AED]/5' : 'text-zinc-400 bg-white'
            "
          >
            Đăng ký
          </button>
          <button
            @click="isAuthModalOpen = false"
            class="absolute right-3 top-3 w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center text-zinc-400 hover:text-black cursor-pointer shadow-sm"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Forms -->
        <form @submit.prevent="handleAuthAction" class="p-6 space-y-4">
          <p class="text-xs text-zinc-500 leading-relaxed text-center font-medium font-sans">
            {{
              authTab === 'login'
                ? 'Vui lòng đăng nhập tài khoản TechDeal để nhận khóa kích hoạt.'
                : 'Đăng ký tài khoản TechDeal miễn phí để tham gia nhận key bản quyền.'
            }}
          </p>

          <!-- Username Input (Register only) -->
          <div v-if="authTab === 'register'" class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-450 block"
              >Tên hiển thị</label
            >
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-zinc-400">
                <UserIcon class="w-4 h-4" />
              </span>
              <input
                v-model="username"
                type="text"
                placeholder="Nhập tên của bạn..."
                class="w-full text-xs pl-10 pr-4 py-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <!-- Email Input -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-450 block"
              >Email đăng nhập</label
            >
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-zinc-400">
                <Mail class="w-4 h-4" />
              </span>
              <input
                v-model="email"
                type="email"
                placeholder="Nhập địa chỉ email..."
                class="w-full text-xs pl-10 pr-4 py-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-450 block"
              >Mật khẩu</label
            >
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-zinc-400">
                <Lock class="w-4 h-4" />
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu của bạn..."
                class="w-full text-xs pl-10 pr-10 py-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:outline-none"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-3.5 text-zinc-400 hover:text-black"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Confirm Password (Register only) -->
          <div v-if="authTab === 'register'" class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-450 block"
              >Xác nhận mật khẩu</label
            >
            <div class="relative">
              <span class="absolute left-3.5 top-3.5 text-zinc-400">
                <Lock class="w-4 h-4" />
              </span>
              <input
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập lại mật khẩu..."
                class="w-full text-xs pl-10 pr-10 py-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isAuthLoading"
            class="w-full py-3.5 bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-black cursor-pointer disabled:opacity-50"
          >
            <span v-if="isAuthLoading">{{
              authTab === 'login' ? 'Đang xác thực...' : 'Đang khởi tạo...'
            }}</span>
            <span v-else>{{ authTab === 'login' ? 'ĐĂNG NHẬP NGAY' : 'ĐĂNG KÝ NGAY' }}</span>
          </button>
        </form>

        <!-- Google Sign-In divider & button -->
        <div class="px-6 pb-6 space-y-4">
          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-black/10"></div>
            <span
              class="flex-shrink mx-4 text-[10px] text-zinc-450 uppercase font-bold tracking-wider"
            >
              Hoặc tiếp tục với
            </span>
            <div class="flex-grow border-t border-black/10"></div>
          </div>

          <div class="w-full flex justify-center">
            <div id="google-btn-container" class="w-full min-h-[40px] flex justify-center"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- How It Works Modal -->
    <div
      v-if="isHowItWorksOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-4 animate-fadeIn"
    >
      <div
        class="bg-white rounded-[28px] border-2 border-black w-full max-w-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.3)] animate-scaleUp p-6 relative"
      >
        <button
          @click="isHowItWorksOpen = false"
          class="absolute right-4 top-4 w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center text-zinc-400 hover:text-black cursor-pointer shadow-sm"
        >
          <X class="w-4 h-4" />
        </button>

        <div class="text-center mb-6">
          <span class="text-[10px] text-zinc-455 font-black uppercase tracking-widest block mb-1"
            >QUY TRÌNH NHẬN</span
          >
          <h2 class="font-serif font-black text-xl text-black">Nhận Bản Quyền Chỉ Với 3 Bước</h2>
        </div>

        <div
          class="flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-0 max-w-3xl mx-auto py-2"
        >
          <!-- Step 1 -->
          <div
            class="flex-1 text-center p-6 border-2 border-black rounded-2xl bg-[#fbf8ff] relative"
          >
            <div
              class="absolute -top-3.5 left-5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full font-serif border border-white"
            >
              Bước 1
            </div>
            <div
              class="w-12 h-12 bg-white border border-black rounded-xl flex items-center justify-center mx-auto mb-4 mt-2"
            >
              <MousePointerClick class="w-6 h-6 text-black" />
            </div>
            <h3 class="font-bold text-xs uppercase tracking-wide mb-1 text-black">Nhấp nhận</h3>
            <p class="text-[11px] text-zinc-550 leading-relaxed">
              Nhấp vào nút "Lấy Key Bản Quyền" ở ngoài.
            </p>
          </div>

          <!-- Connector -->
          <div class="hidden sm:flex items-center justify-center px-2">
            <div class="w-4 h-0.5 bg-black"></div>
          </div>

          <!-- Step 2 -->
          <div
            class="flex-1 text-center p-6 border-2 border-black rounded-2xl bg-[#fbf8ff] relative"
          >
            <div
              class="absolute -top-3.5 left-5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full font-serif border border-white"
            >
              Bước 2
            </div>
            <div
              class="w-12 h-12 bg-white border border-black rounded-xl flex items-center justify-center mx-auto mb-4 mt-2"
            >
              <UserPlus class="w-6 h-6 text-black" />
            </div>
            <h3 class="font-bold text-xs uppercase tracking-wide mb-1 text-black">Xác thực</h3>
            <p class="text-[11px] text-zinc-550 leading-relaxed">
              Đăng nhập hoặc Đăng ký tài khoản nhanh.
            </p>
          </div>

          <!-- Connector -->
          <div class="hidden sm:flex items-center justify-center px-2">
            <div class="w-4 h-0.5 bg-black"></div>
          </div>

          <!-- Step 3 -->
          <div
            class="flex-1 text-center p-6 border-2 border-black rounded-2xl bg-[#fbf8ff] relative"
          >
            <div
              class="absolute -top-3.5 left-5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full font-serif border border-white"
            >
              Bước 3
            </div>
            <div
              class="w-12 h-12 bg-white border border-black rounded-xl flex items-center justify-center mx-auto mb-4 mt-2"
            >
              <Zap class="w-6 h-6 text-black" />
            </div>
            <h3 class="font-bold text-xs uppercase tracking-wide mb-1 text-black">Chuyển hướng</h3>
            <p class="text-[11px] text-zinc-550 leading-relaxed">
              Nhận link kích hoạt bản quyền chính hãng.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="isHowItWorksOpen = false"
            class="px-5 py-2.5 bg-black hover:bg-zinc-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zeecast-wrap,
.zeecast-wrap *,
.zeecast-wrap .font-serif,
.zeecast-wrap .font-sans {
  font-family:
    'Quicksand', 'Nunito Sans', 'Helvetica Neue', Helvetica, Roboto, Oxygen, Ubuntu, Cantarell,
    'Fira Sans', 'Droid Sans', sans-serif !important;
}

.zeecast-wrap h1.title-heading,
.zeecast-wrap h1.title-heading * {
  font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif !important;
}

.hero-grid-bg {
  content: '';
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-scaleUp {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
