<script setup lang="ts">
import type { BlogPost } from '../types/post.type'
import { User, Calendar, Eye, MessageSquare } from 'lucide-vue-next'

const props = defineProps<{
  post: BlogPost
}>()

// Dynamic category color mapping for a premium, clean look
const getCategoryColors = (category: string) => {
  const cat = category.toLowerCase()
  if (cat.includes('game') || cat.includes('esports') || cat.includes('fight')) {
    return 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'
  }
  if (cat.includes('mobile') || cat.includes('gadget') || cat.includes('phone')) {
    return 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400'
  }
  return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'
}
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-850 overflow-hidden group shadow-xs hover:shadow-md transition-all duration-300"
  >
    <!-- Image aspect-[16/10] -->
    <div class="relative overflow-hidden aspect-[16/10] bg-zinc-950">
      <NuxtLink :to="`/blog/${post.slug}`" class="block w-full h-full">
        <img
          :src="post.imageUrl"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
      </NuxtLink>
    </div>

    <!-- Content Area -->
    <div class="p-5 flex-grow flex flex-col justify-between">
      <div>
        <!-- Category Tag -->
        <span
          class="text-[10px] font-bold px-2.5 py-1 rounded mb-3 inline-block uppercase tracking-wider"
          :class="getCategoryColors(post.category)"
        >
          {{ post.category }}
        </span>

        <!-- Title -->
        <h4
          class="text-base font-bold leading-snug text-zinc-900 dark:text-white hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors mb-3 line-clamp-2"
        >
          <NuxtLink :to="`/blog/${post.slug}`">
            {{ post.title }}
          </NuxtLink>
        </h4>

        <!-- Summary -->
        <p class="text-xs text-zinc-655 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
          {{ post.summary }}
        </p>
      </div>

      <!-- Footer Metadata -->
      <div
        class="flex items-center gap-4 text-[10px] text-zinc-500 border-t border-gray-150 dark:border-zinc-850 pt-3 mt-auto"
      >
        <span class="flex items-center gap-1">
          <User class="w-3.5 h-3.5" :stroke-width="2.5" />
          {{ post.author }}
        </span>
        <span class="flex items-center gap-1">
          <Calendar class="w-3.5 h-3.5" :stroke-width="2.5" />
          {{ post.publishDate }}
        </span>
        <span class="flex items-center gap-1 ml-auto text-red-500 dark:text-red-400">
          <Eye class="w-3.5 h-3.5" :stroke-width="2.5" />
          <span class="font-medium">{{ post.views }}</span>
        </span>
        <span v-if="post.comments > 0" class="flex items-center gap-1">
          <MessageSquare class="w-3.5 h-3.5 text-zinc-400" :stroke-width="2.5" />
          <span>{{ post.comments }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
