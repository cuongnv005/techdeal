<script setup lang="ts">
import Header from '@features/blog/components/Header.vue'
import Footer from '@features/blog/components/Footer.vue'

useSeoMeta({
  title: 'Privacy Policy - TechDeal',
  description:
    'Privacy Policy for TechDeal, outlining how we collect, use, and protect your information.',
  ogTitle: 'Privacy Policy - TechDeal',
  ogType: 'website'
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 p-6 md:p-10 shadow-xs space-y-6"
      >
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
        >
          Privacy Policy
        </h1>
        <p class="text-zinc-500 text-xs italic">Last updated: May 31, 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            We value your privacy. TechDeal collects minimal personal information when you interact
            with our website:
          </p>
          <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>
              <strong>Comments and Accounts:</strong> When you register or leave a comment, we
              collect your username, email, and IP address.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically track standard usage metrics (views,
              referrers, device type) using basic analytics to improve our content.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            2. Cookies and Tracking Technologies
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            We use cookies to maintain your login session state and personalize your experience.
            Third-party partners, such as Google AdSense, may also place and read cookies on your
            browser, or use web beacons to collect information in the course of ads being served on
            our website.
          </p>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            You can choose to disable or selectively turn off our cookies or third-party cookies in
            your browser settings.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            3. How We Use Your Information
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            The information we collect is used to:
          </p>
          <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>Manage and authenticate user accounts and comment sections.</li>
            <li>Monitor and analyze traffic to improve our blog content.</li>
            <li>Serve relevant advertisements and affiliate offers.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">4. Data Security</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            We prioritize the security of your data. We use standard industry practices (such as SSL
            encryption) to protect the transmission of information. However, please remember that no
            method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section class="space-y-3 border-t border-gray-200 dark:border-zinc-800 pt-6">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Contact Us</h2>
          <p class="text-xs text-zinc-650 dark:text-zinc-400">
            If you have any questions or concerns regarding this Privacy Policy, please reach out to
            us at
            <a
              href="mailto:privacy@techdeal.com"
              class="text-[#3498db] dark:text-[#e74c3c] hover:underline font-semibold"
              >privacy@techdeal.com</a
            >.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
