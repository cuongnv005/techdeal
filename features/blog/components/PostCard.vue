<script setup lang="ts">
import type { BlogPost } from '../types/post.type'
import { User, Calendar, Eye, MessageSquare, ChevronRight } from 'lucide-vue-next'

defineProps<{
  post: BlogPost
}>()
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <!-- Title Bar -->
    <div class="bg-[#3498db] dark:bg-sky-700 px-4 py-3 text-white">
      <h3 class="font-bold text-[16px] leading-snug line-clamp-2">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:underline">
          {{ post.title }}
        </NuxtLink>
      </h3>
    </div>

    <!-- Meta Information -->
    <div
      class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-[12px] text-gray-500 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div class="flex items-center gap-1">
        <User class="w-3.5 h-3.5" :stroke-width="2.5" />
        <span>{{ post.author }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Calendar class="w-3.5 h-3.5" :stroke-width="2.5" />
        <span>{{ post.publishDate }}</span>
      </div>
      <div class="flex items-center gap-1 ml-auto sm:ml-0">
        <Eye class="w-3.5 h-3.5 text-red-500 dark:text-red-400" :stroke-width="2.5" />
        <span class="font-medium">{{ post.views }}</span>
      </div>
      <div class="flex items-center gap-1">
        <MessageSquare class="w-3.5 h-3.5" :stroke-width="2.5" />
        <span>{{ post.comments }}</span>
      </div>
    </div>

    <!-- Image -->
    <div class="relative overflow-hidden aspect-[16/10]">
      <NuxtLink :to="`/blog/${post.slug}`">
        <img
          :src="post.imageUrl"
          :alt="post.title"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </NuxtLink>
    </div>

    <!-- Summary & Footer Button -->
    <div class="flex flex-col justify-between flex-grow p-4">
      <p class="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4 mb-4">
        {{ post.summary }}
      </p>

      <div class="flex justify-end">
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="inline-flex items-center gap-1 px-4 py-2 bg-[#f39c12] hover:bg-[#e67e22] text-white text-xs font-bold rounded shadow transition-colors"
        >
          <span>Xem tiếp...</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
