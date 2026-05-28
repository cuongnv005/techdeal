<script setup lang="ts">
interface CategoryItem {
  name: string
  count: string
  icon: string
}

defineProps<{
  categories: CategoryItem[]
}>()
</script>

<template>
  <section class="py-12 bg-white dark:bg-[#101216]">
    <div class="container mx-auto px-4">
      <div class="text-center mb-10">
        <h2
          class="text-2xl font-black uppercase text-zinc-900 dark:text-white tracking-wide inline-flex flex-col items-center"
        >
          Chuyên mục Game đặc sắc
          <span class="w-16 h-1 bg-[#e74c3c] mt-2 rounded"></span>
        </h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="bg-gray-50 dark:bg-[#171a21] border border-gray-200 dark:border-zinc-800 rounded-lg p-4 text-center hover:border-[#e74c3c] dark:hover:border-[#e74c3c] transition-colors group cursor-pointer"
        >
          <div
            class="w-16 h-16 mx-auto mb-3 bg-white dark:bg-[#0d0f12] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs dark:shadow-none border border-gray-100 dark:border-none"
          >
            {{ cat.icon }}
          </div>
          <h3
            class="text-sm font-bold text-zinc-800 dark:text-white group-hover:text-[#e74c3c] transition-colors"
          >
            {{ cat.name }}
          </h3>
          <p class="text-[11px] text-zinc-500 mt-1">{{ cat.count }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
