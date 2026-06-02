<script setup lang="ts">
import Header from '@features/blog/components/Header.vue'
import Footer from '@features/blog/components/Footer.vue'
import { Sparkles, Mail, Rss, Laptop, Gamepad2 } from 'lucide-vue-next'

useSeoMeta({
  title: 'About TechDeal & Newsletter - TechDeal',
  description:
    'Learn more about TechDeal blog, our gaming and tech coverage, and subscribe to our newsletter.',
  ogTitle: 'About & Newsletter - TechDeal',
  ogType: 'website'
})

const emailInput = ref('')
const isSubscribed = ref(false)

const handleSubscribe = () => {
  if (emailInput.value.trim()) {
    isSubscribed.value = true
    emailInput.value = ''
    alert('Thank you for subscribing to TechDeal newsletter!')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 p-6 md:p-10 shadow-xs space-y-8"
      >
        <!-- About Section -->
        <div class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4 flex items-center gap-2"
          >
            <Sparkles class="w-8 h-8 text-[#3498db] dark:text-[#e74c3c]" /> About TechDeal
          </h1>

          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Welcome to <strong>TechDeal</strong>, a dedicated blog and community sharing space for
            all things technology and gaming. We are not a formal news publication, but rather a hub
            run by tech enthusiasts and gamers who love sharing the latest hardware reviews,
            software tips, dynamic discussions, and hot deals.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850 flex gap-3"
            >
              <Laptop class="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">Tech Insights</h3>
                <p class="text-[11px] text-zinc-500 mt-1 leading-normal">
                  Guides, operating systems tutorials, hardware breakdowns, and review articles.
                </p>
              </div>
            </div>
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850 flex gap-3"
            >
              <Gamepad2 class="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">Gaming Deals</h3>
                <p class="text-[11px] text-zinc-500 mt-1 leading-normal">
                  Updates on free game distribution programs from Steam, Epic Games, and other major
                  gaming platforms.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-6">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail class="w-6 h-6 text-[#3498db]" /> TechDeal Newsletter
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Don't miss out on free game promotions and handpicked tech deals. Subscribe to our
            newsletter to receive weekly summaries of our best posts directly to your inbox.
          </p>

          <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-2 max-w-lg">
            <input
              v-model="emailInput"
              type="email"
              placeholder="Enter your email address..."
              class="flex-grow text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
            <button
              type="submit"
              class="px-5 py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Rss class="w-4 h-4" /> Subscribe
            </button>
          </form>

          <p v-if="isSubscribed" class="text-xs text-emerald-500 font-semibold">
            🎉 Successfully subscribed! Stay tuned for awesome deals!
          </p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
