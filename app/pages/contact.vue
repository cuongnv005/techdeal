<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  AlertCircle,
  Handshake,
  CheckCircle2,
  AlertTriangle
} from 'lucide-vue-next'

import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'

const { t } = useI18n()

useSeoMeta({
  title: computed(() => t('contact.seo_title')),
  description: computed(() => t('contact.seo_desc')),
  ogTitle: computed(() => `${t('contact.seo_title')} - TechDeal`),
  ogType: 'website',
  ogUrl: 'https://techdeal.io.vn/contact',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: 'https://techdeal.io.vn/contact' }]
})

const form = ref({
  name: '',
  email: '',
  subject: computed(() => t('contact.subject_feedback')).value,
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const handleSubmit = async () => {
  // Simple validation
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.message.trim()) {
    submitError.value = t('contact.validation_error')
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = ''

  try {
    const response = await fetch('https://formspree.io/f/mkoaaajb', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message
      })
    })

    if (response.ok) {
      submitSuccess.value = true
      form.value = {
        name: '',
        email: '',
        subject: t('contact.subject_feedback'),
        message: ''
      }
    } else {
      const data = await response.json()
      submitError.value =
        data.errors?.map((e: any) => e.message).join(', ') || t('contact.network_error')
    }
  } catch (err) {
    submitError.value = t('contact.network_error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-5xl">
      <!-- Page Header -->
      <div class="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          {{ $t('contact.heading') }}
          <span class="text-[#3498db] dark:text-[#e74c3c]">TechDeal</span>
        </h1>
        <p class="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {{ $t('contact.subheading') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Contact Details & Common reasons (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Information Card -->
          <div
            class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xs space-y-6"
          >
            <h2
              class="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wide border-b border-gray-150 dark:border-zinc-800 pb-3"
            >
              {{ $t('contact.info_heading') }}
            </h2>

            <div class="space-y-4 text-xs">
              <div class="flex items-start gap-3.5 group">
                <div
                  class="p-2.5 rounded-xl bg-blue-50 dark:bg-zinc-950 text-blue-500 border border-blue-100 dark:border-zinc-800"
                >
                  <Mail class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="font-bold text-zinc-550 dark:text-zinc-400">
                    {{ $t('contact.email_label') }}
                  </h4>
                  <a
                    href="mailto:contact@techdeal.io.vn"
                    class="text-zinc-900 dark:text-white font-semibold hover:text-[#3498db] transition-colors"
                  >
                    contact@techdeal.io.vn
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-3.5 group">
                <div
                  class="p-2.5 rounded-xl bg-green-50 dark:bg-zinc-950 text-green-500 border border-green-100 dark:border-zinc-800"
                >
                  <Phone class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="font-bold text-zinc-550 dark:text-zinc-400">
                    {{ $t('contact.phone_label') }}
                  </h4>
                  <a
                    href="tel:+84822344589"
                    class="text-zinc-900 dark:text-white font-semibold hover:text-[#3498db] transition-colors"
                  >
                    +84 (0) 822 344 589
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-3.5 group">
                <div
                  class="p-2.5 rounded-xl bg-purple-50 dark:bg-zinc-950 text-purple-500 border border-purple-100 dark:border-zinc-800"
                >
                  <MapPin class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="font-bold text-zinc-550 dark:text-zinc-400">
                    {{ $t('contact.address_label') }}
                  </h4>
                  <p class="text-zinc-900 dark:text-white font-semibold">
                    {{ $t('contact.address_value') }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 group">
                <div
                  class="p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-950 text-amber-500 border border-amber-100 dark:border-zinc-800"
                >
                  <Clock class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="font-bold text-zinc-550 dark:text-zinc-400">
                    {{ $t('contact.hours_label') }}
                  </h4>
                  <p class="text-zinc-900 dark:text-white font-semibold">
                    {{ $t('contact.hours_value') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Common reasons Card -->
          <div
            class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-xs space-y-6"
          >
            <h2
              class="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wide border-b border-gray-150 dark:border-zinc-800 pb-3"
            >
              {{ $t('contact.reasons_heading') }}
            </h2>

            <div class="space-y-4 text-[11px] leading-relaxed">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5 font-bold text-zinc-850 dark:text-zinc-200">
                  <AlertTriangle class="w-3.5 h-3.5 text-amber-500" />
                  {{ $t('contact.reason1_title') }}
                </div>
                <p class="text-zinc-500 dark:text-zinc-400">
                  {{ $t('contact.reason1_desc') }}
                </p>
              </div>

              <div class="space-y-1">
                <div class="flex items-center gap-1.5 font-bold text-zinc-850 dark:text-zinc-200">
                  <Handshake class="w-3.5 h-3.5 text-blue-500" />
                  {{ $t('contact.reason2_title') }}
                </div>
                <p class="text-zinc-500 dark:text-zinc-400">
                  {{ $t('contact.reason2_desc') }}
                </p>
              </div>

              <div class="space-y-1">
                <div class="flex items-center gap-1.5 font-bold text-zinc-850 dark:text-zinc-200">
                  <Send class="w-3.5 h-3.5 text-emerald-500" />
                  {{ $t('contact.reason3_title') }}
                </div>
                <p class="text-zinc-500 dark:text-zinc-400">
                  {{ $t('contact.reason3_desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Message Form (7 cols) -->
        <div class="lg:col-span-7">
          <div
            class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8 shadow-xs space-y-6"
          >
            <h2
              class="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wide border-b border-gray-150 dark:border-zinc-800 pb-3"
            >
              {{ $t('contact.form_heading') }}
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Name Field -->
              <div class="space-y-1.5">
                <label for="name" class="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {{ $t('contact.name_label') }}
                  <span class="text-red-500">{{ $t('contact.required') }}</span>
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  :placeholder="$t('contact.name_placeholder')"
                  class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] transition-all"
                  required
                />
              </div>

              <!-- Email Field -->
              <div class="space-y-1.5">
                <label for="email" class="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {{ $t('contact.email_field_label') }}
                  <span class="text-red-500">{{ $t('contact.required') }}</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] transition-all"
                  required
                />
              </div>

              <!-- Subject Dropdown -->
              <div class="space-y-1.5">
                <label
                  for="subject"
                  class="block text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  {{ $t('contact.subject_label') }}
                  <span class="text-red-500">{{ $t('contact.required') }}</span>
                </label>
                <select
                  id="subject"
                  v-model="form.subject"
                  class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] transition-all cursor-pointer"
                >
                  <option :value="$t('contact.subject_feedback')">
                    {{ $t('contact.subject_feedback') }}
                  </option>
                  <option :value="$t('contact.subject_bug')">
                    {{ $t('contact.subject_bug') }}
                  </option>
                  <option :value="$t('contact.subject_collab')">
                    {{ $t('contact.subject_collab') }}
                  </option>
                  <option :value="$t('contact.subject_other')">
                    {{ $t('contact.subject_other') }}
                  </option>
                </select>
              </div>

              <!-- Message Textarea -->
              <div class="space-y-1.5">
                <label
                  for="message"
                  class="block text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  {{ $t('contact.message_label') }}
                  <span class="text-red-500">{{ $t('contact.required') }}</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  :placeholder="$t('contact.message_placeholder')"
                  rows="6"
                  class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] transition-all resize-none"
                  required
                ></textarea>
              </div>

              <!-- Notifications -->
              <div
                v-if="submitSuccess"
                class="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 rounded-xl flex gap-3 text-xs text-emerald-800 dark:text-emerald-400"
              >
                <CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-bold">{{ $t('contact.success_title') }}</h4>
                  <p class="mt-0.5 leading-normal">{{ $t('contact.success_desc') }}</p>
                </div>
              </div>

              <div
                v-if="submitError"
                class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex gap-3 text-xs text-red-800 dark:text-red-400"
              >
                <AlertCircle class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-bold">{{ $t('contact.error_title') }}</h4>
                  <p class="mt-0.5 leading-normal">{{ submitError }}</p>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full px-5 py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send class="w-4 h-4" />
                <span>{{
                  isSubmitting ? $t('contact.submitting') : $t('contact.submit_btn')
                }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
