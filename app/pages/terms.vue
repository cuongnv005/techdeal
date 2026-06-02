<script setup lang="ts">
import Header from '@features/blog/components/Header.vue'
import Footer from '@features/blog/components/Footer.vue'

useSeoMeta({
  title: 'Terms of Service - TechDeal',
  description:
    'Terms and conditions for using TechDeal, a blog covering technology, gaming, and consumer electronics.',
  ogTitle: 'Terms of Service - TechDeal',
  ogType: 'website'
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-955 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 p-6 md:p-10 shadow-xs space-y-6"
      >
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
        >
          Terms of Service
        </h1>
        <p class="text-zinc-500 text-xs italic">Last updated: May 31, 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Welcome to TechDeal (referred to as "we", "us", "our", or "TechDeal"). By accessing or
            using our website, you agree to comply with and be bound by these Terms of Service. If
            you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            2. Content & Intellectual Property
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            TechDeal is a personal blog and news platform sharing information, reviews, and guides
            about technology, consumer electronics, and gaming. All content on this site, including
            articles, images, and logos, is the property of TechDeal or its content creators and is
            protected by copyright laws. You may not copy, reproduce, or distribute our content
            without our prior written permission.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            3. User Conduct & Comments
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            If you create an account or participate in discussions by leaving comments:
          </p>
          <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>You agree to provide true, accurate, and complete information.</li>
            <li>You are responsible for keeping your credentials safe.</li>
            <li>
              You must not post abusive, offensive, spammy, or unlawful content in the comment
              sections.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            4. Third-Party Links & Advertisements
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Our website contains links to third-party websites, services, and affiliate programs
            (such as Steam, Epic Games Store, and Google AdSense). TechDeal is not responsible for
            the content, privacy policies, or practices of any third-party websites. Clicking on
            these links is at your own risk.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            5. Disclaimer of Warranties
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            All information on TechDeal is provided "as is" and "as available" for informational and
            entertainment purposes only. While we strive to present accurate tech guides and deals,
            we make no representations or warranties of any kind regarding the accuracy,
            completeness, or reliability of our content.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">6. Changes to Terms</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            We reserves the right to modify these terms at any time. Any changes will be posted on
            this page with the updated date. Your continued use of the website after changes are
            posted constitutes your acceptance of the new Terms of Service.
          </p>
        </section>

        <section class="space-y-3 border-t border-gray-200 dark:border-zinc-800 pt-6">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Contact Us</h2>
          <p class="text-xs text-zinc-650 dark:text-zinc-400">
            If you have any questions about these Terms of Service, please contact us at
            <a
              href="mailto:contact@techdeal.com"
              class="text-[#3498db] dark:text-[#e74c3c] hover:underline font-semibold"
              >contact@techdeal.com</a
            >.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
