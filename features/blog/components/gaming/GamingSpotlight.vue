<script setup lang="ts">
import { computed } from 'vue'
import { Eye } from 'lucide-vue-next'

import type { BlogPost } from '../../types/post.type'

const props = defineProps<{
  spotlightBigPost: BlogPost
  spotlightSmallPosts: BlogPost[]
}>()

const allSpotlightPosts = computed(() => {
  const list = []
  if (props.spotlightBigPost) {
    list.push(props.spotlightBigPost)
  }
  if (props.spotlightSmallPosts && props.spotlightSmallPosts.length > 0) {
    list.push(...props.spotlightSmallPosts)
  }
  return list
})
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in allSpotlightPosts"
        :key="post.id"
        class="flex flex-col bg-white dark:bg-[#13161c] rounded-xl border border-gray-200 dark:border-zinc-850 overflow-hidden group shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div class="aspect-[16/10] overflow-hidden">
          <img
            :src="post.imageUrl"
            :alt="post.title"
            class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
        </div>
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <span
              class="bg-[#e74c3c]/15 text-[#e74c3c] text-[10px] font-bold px-2.5 py-1 rounded mb-3 inline-block uppercase"
            >
              {{ post.category }}
            </span>
            <h4
              class="text-base font-bold leading-snug text-zinc-900 dark:text-white hover:text-[#e74c3c] transition-colors mb-3 line-clamp-2"
            >
              <NuxtLink :to="`/blog/${post.slug}.${post.id}`">{{ post.title }}</NuxtLink>
            </h4>
            <p class="text-xs text-zinc-650 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
              {{ post.summary }}
            </p>
          </div>
          <div
            class="flex items-center gap-4 text-[10px] text-zinc-550 border-t border-gray-150 dark:border-zinc-850 pt-3"
          >
            <span>Bởi {{ post.author }}</span>
            <span>{{ post.publishDate }}</span>
            <span class="flex items-center gap-1 ml-auto text-red-550 dark:text-red-400">
              <Eye class="w-3.5 h-3.5" :stroke-width="2.5" />
              <span class="font-medium">{{ post.views }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
