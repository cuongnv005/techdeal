<script setup lang="ts">
import { User, Calendar } from 'lucide-vue-next'
import type { BlogPost } from '../../types/post.type'

defineProps<{
  bannerPosts: BlogPost[]
}>()
</script>

<template>
  <section class="border-b border-gray-200 dark:border-zinc-900 bg-black">
    <div class="grid grid-cols-1 lg:grid-cols-2">
      <div
        v-for="bPost in bannerPosts"
        :key="bPost.id"
        class="relative group aspect-[16/9] lg:aspect-[16/8] overflow-hidden bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-900"
      >
        <img
          :src="bPost.imageUrl"
          :alt="bPost.title"
          class="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-700"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
          <span class="self-start bg-[#e74c3c] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm mb-3 tracking-wider">
            {{ bPost.category }}
          </span>
          <h2 class="text-lg md:text-2xl font-bold text-white hover:text-[#e74c3c] transition-colors leading-tight mb-3">
            <a href="#">{{ bPost.title }}</a>
          </h2>
          <div class="flex items-center gap-4 text-[11px] text-zinc-450">
            <span class="flex items-center gap-1"><User class="w-3.5 h-3.5" /> {{ bPost.author }}</span>
            <span class="flex items-center gap-1"><Calendar class="w-3.5 h-3.5" /> {{ bPost.publishDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
