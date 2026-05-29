<script setup lang="ts">
import { Eye } from 'lucide-vue-next'

import type { BlogPost } from '../../types/post.type'

defineProps<{
  spotlightBigPost: BlogPost
  spotlightSmallPosts: BlogPost[]
}>()
</script>

<template>
  <div>
    <div class="border-b border-gray-250 dark:border-zinc-800 pb-3 mb-6">
      <h3
        class="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white border-l-4 border-[#e74c3c] pl-3"
      >
        Tiêu điểm hôm nay
      </h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-10 gap-6">
      <!-- Big Post (Matches the user's specific requested layout) -->
      <div
        class="md:col-span-6 flex flex-col bg-white dark:bg-[#13161c] rounded-xl border border-gray-200 dark:border-zinc-850 overflow-hidden group shadow-xs"
      >
        <div class="aspect-[16/10] overflow-hidden">
          <img
            :src="spotlightBigPost.imageUrl"
            :alt="spotlightBigPost.title"
            class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
        </div>
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <span
              class="bg-[#e74c3c]/15 text-[#e74c3c] text-[10px] font-bold px-2.5 py-1 rounded mb-3 inline-block uppercase"
            >
              {{ spotlightBigPost.category }}
            </span>
            <h4
              class="text-base font-bold leading-snug text-zinc-900 dark:text-white hover:text-[#e74c3c] transition-colors mb-3"
            >
              <NuxtLink :to="`/blog/${spotlightBigPost.slug}.${spotlightBigPost.id}`">{{
                spotlightBigPost.title
              }}</NuxtLink>
            </h4>
            <p class="text-xs text-zinc-655 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
              {{ spotlightBigPost.summary }}
            </p>
          </div>
          <div
            class="flex items-center gap-4 text-[10px] text-zinc-550 border-t border-gray-150 dark:border-zinc-850 pt-3"
          >
            <span>Bởi {{ spotlightBigPost.author }}</span>
            <span>{{ spotlightBigPost.publishDate }}</span>
            <span class="flex items-center gap-1 ml-auto text-red-550 dark:text-red-400">
              <Eye class="w-3.5 h-3.5" :stroke-width="2.5" />
              <span class="font-medium">{{ spotlightBigPost.views }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Small List -->
      <div class="md:col-span-4 space-y-4">
        <div
          v-for="sPost in spotlightSmallPosts"
          :key="sPost.id"
          class="bg-white dark:bg-[#13161c] border border-gray-200 dark:border-zinc-850 rounded-xl p-3 flex gap-3 group hover:border-gray-300 dark:hover:border-zinc-800 transition-colors shadow-xs"
        >
          <div class="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-zinc-950">
            <img
              :src="sPost.imageUrl"
              :alt="sPost.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col justify-between flex-grow">
            <h5
              class="text-xs font-bold text-zinc-800 dark:text-white line-clamp-2 leading-tight group-hover:text-[#e74c3c] transition-colors"
            >
              <NuxtLink :to="`/blog/${sPost.slug}.${sPost.id}`">{{ sPost.title }}</NuxtLink>
            </h5>
            <span class="text-[9px] font-semibold text-zinc-500 uppercase mt-2">{{
              sPost.category
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
