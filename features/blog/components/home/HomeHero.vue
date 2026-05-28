<script setup lang="ts">
import type { BlogPost } from '../../types/post.type'

defineProps<{
  featuredBigPost: BlogPost
  featuredSmallPosts: BlogPost[]
}>()
</script>

<template>
  <section class="mb-8">
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <!-- Big Featured Post -->
      <div
        class="lg:col-span-7 relative group overflow-hidden rounded-xl bg-zinc-950 text-white aspect-[16/9] shadow-md"
      >
        <img
          :src="featuredBigPost.imageUrl"
          :alt="featuredBigPost.title"
          class="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-750"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8"
        >
          <span
            class="self-start bg-[#3498db] text-white text-[11px] font-extrabold uppercase px-2 py-0.5 rounded mb-3"
          >
            {{ featuredBigPost.category }}
          </span>
          <h2 class="text-xl md:text-3xl font-bold mb-3 hover:underline leading-tight">
            <NuxtLink :to="`/blog/${featuredBigPost.slug}`">
              {{ featuredBigPost.title }}
            </NuxtLink>
          </h2>
          <p class="text-zinc-300 text-xs md:text-sm line-clamp-2 mb-4 hidden md:block">
            {{ featuredBigPost.summary }}
          </p>
          <div class="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>Bởi {{ featuredBigPost.author }}</span>
            <span>•</span>
            <span>{{ featuredBigPost.publishDate }}</span>
          </div>
        </div>
      </div>

      <!-- Small Featured Posts Column -->
      <div class="lg:col-span-3 flex flex-col gap-4">
        <div
          v-for="fPost in featuredSmallPosts"
          :key="fPost.id"
          class="flex-1 relative group overflow-hidden rounded-xl bg-zinc-950 text-white min-h-[160px] shadow-sm"
        >
          <img
            :src="fPost.imageUrl"
            :alt="fPost.title"
            class="w-full h-full object-cover opacity-75 group-hover:scale-103 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4"
          >
            <span
              class="self-start bg-[#f39c12] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mb-2"
            >
              {{ fPost.category }}
            </span>
            <h3 class="text-sm font-bold line-clamp-2 hover:underline">
              <NuxtLink :to="`/blog/${fPost.slug}`">
                {{ fPost.title }}
              </NuxtLink>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
