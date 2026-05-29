<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  Eye,
  BookOpen,
  MessageSquare,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-vue-next'

import type { StatItem, ChartDataPoint } from '../types/dashboard.type'

interface Props {
  statsData: {
    overview: StatItem[]
    weekly: ChartDataPoint[]
    monthly: ChartDataPoint[]
  }
}

const props = defineProps<Props>()

const timeRange = ref<'week' | 'month'>('week')

const activeChartData = computed(() => {
  return timeRange.value === 'week' ? props.statsData.weekly : props.statsData.monthly
})

// Custom SVG Chart parameters
const svgWidth = 600
const svgHeight = 240
const padding = 40

// Compute coordinates for views line chart
const viewPoints = computed(() => {
  const data = activeChartData.value
  if (!data || data.length === 0) return ''
  const maxViews = Math.max(...data.map((d) => d.views), 1)

  return data
    .map((d, index) => {
      const x =
        data.length === 1
          ? padding + (svgWidth - padding * 2) / 2
          : padding + (index / (data.length - 1)) * (svgWidth - padding * 2)
      const y = svgHeight - padding - (d.views / maxViews) * (svgHeight - padding * 2)
      return `${x},${y}`
    })
    .join(' ')
})

// Compute coordinates for posts bar chart
const barWidth = computed(() => {
  const data = activeChartData.value
  return ((svgWidth - padding * 2) / data.length) * 0.6
})

const postBars = computed(() => {
  const data = activeChartData.value
  if (!data || data.length === 0) return []
  const maxPosts = Math.max(...data.map((d) => d.posts), 1)
  const barSpacing = (svgWidth - padding * 2) / data.length

  return data.map((d, index) => {
    const x = padding + index * barSpacing + (barSpacing - barWidth.value) / 2
    const height = (d.posts / maxPosts) * (svgHeight - padding * 2)
    const y = svgHeight - padding - height
    return {
      x,
      y,
      width: barWidth.value,
      height: Math.max(height, 5), // min height 5px
      label: d.label,
      value: d.posts
    }
  })
})

const getIcon = (label: string) => {
  if (label.includes('xem')) return Eye
  if (label.includes('bài viết')) return BookOpen
  if (label.includes('luận')) return MessageSquare
  return Users
}

const getColorClass = (label: string) => {
  if (label.includes('xem')) return 'from-blue-500 to-indigo-600'
  if (label.includes('bài viết')) return 'from-emerald-500 to-teal-600'
  if (label.includes('luận')) return 'from-amber-500 to-orange-600'
  return 'from-purple-500 to-pink-600'
}
</script>

<template>
  <div class="space-y-8 animate-fadeIn">
    <!-- Overview Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in statsData.overview"
        :key="stat.label"
        class="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs group hover:shadow-md transition-all duration-300"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br opacity-5 group-hover:scale-110 transition-transform duration-500 rounded-bl-full"
          :class="getColorClass(stat.label)"
        ></div>

        <div class="flex items-center justify-between">
          <span
            class="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-550"
            >{{ stat.label }}</span
          >
          <component
            :is="getIcon(stat.label)"
            class="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
          />
        </div>

        <div class="mt-4 flex items-baseline gap-2">
          <span
            class="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight"
            >{{ stat.value }}</span
          >
          <span
            class="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
            :class="
              stat.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-600'
            "
          >
            <component :is="stat.isPositive ? TrendingUp : TrendingDown" class="w-3 h-3" />
            {{ stat.trend }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Views Line Chart Card -->
      <div
        class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-250 dark:border-zinc-850 shadow-xs space-y-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-tight">
              Thống kê Lượt xem
            </h3>
            <p class="text-[10px] text-zinc-450 dark:text-zinc-550">
              Biểu đồ đường biểu diễn sự thay đổi lượt xem
            </p>
          </div>
          <div
            class="flex bg-gray-100 dark:bg-zinc-950 p-1 rounded-xl border border-gray-200 dark:border-zinc-800"
          >
            <button
              @click="timeRange = 'week'"
              class="px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              :class="
                timeRange === 'week'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-500'
              "
            >
              Tuần
            </button>
            <button
              @click="timeRange = 'month'"
              class="px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              :class="
                timeRange === 'month'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-500'
              "
            >
              Tháng
            </button>
          </div>
        </div>

        <div class="relative w-full overflow-hidden">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="w-full h-auto text-blue-500">
            <!-- Grid Lines -->
            <line
              :x1="padding"
              :y1="padding"
              :x2="svgWidth - padding"
              :y2="padding"
              stroke="currentColor"
              stroke-dasharray="4"
              class="opacity-10"
            />
            <line
              :x1="padding"
              :y1="(svgHeight - padding * 2) / 2 + padding"
              :x2="svgWidth - padding"
              :y2="(svgHeight - padding * 2) / 2 + padding"
              stroke="currentColor"
              stroke-dasharray="4"
              class="opacity-10"
            />
            <line
              :x1="padding"
              :y1="svgHeight - padding"
              :x2="svgWidth - padding"
              :y2="svgHeight - padding"
              stroke="currentColor"
              class="opacity-20"
            />

            <!-- Line Path -->
            <polyline
              fill="none"
              stroke="#3498db"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              :points="viewPoints"
              class="drop-shadow-lg"
            />

            <!-- Circles / Markers -->
            <circle
              v-for="(point, idx) in viewPoints.split(' ')"
              :key="idx"
              :cx="point.split(',')[0]"
              :cy="point.split(',')[1]"
              r="4.5"
              fill="#3498db"
              stroke="#fff"
              stroke-width="1.5"
            />

            <!-- Labels -->
            <text
              v-for="(d, idx) in activeChartData"
              :key="idx"
              :x="activeChartData.length === 1 ? padding + (svgWidth - padding * 2) / 2 : padding + (idx / (activeChartData.length - 1)) * (svgWidth - padding * 2)"
              :y="svgHeight - 15"
              text-anchor="middle"
              class="text-[10px] font-semibold fill-zinc-500"
            >
              {{ d.label }}
            </text>
          </svg>
        </div>
      </div>

      <!-- Posts Bar Chart Card -->
      <div
        class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-250 dark:border-zinc-850 shadow-xs space-y-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-tight">
              Thống kê Bài viết mới
            </h3>
            <p class="text-[10px] text-zinc-450 dark:text-zinc-550">
              Biểu đồ cột biểu diễn số lượng bài viết xuất bản
            </p>
          </div>
          <span
            class="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg"
          >
            <BarChart3 class="w-3.5 h-3.5" /> Auto-sync
          </span>
        </div>

        <div class="relative w-full overflow-hidden">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="w-full h-auto text-teal-500">
            <!-- Grid Lines -->
            <line
              :x1="padding"
              :y1="padding"
              :x2="svgWidth - padding"
              :y2="padding"
              stroke="currentColor"
              stroke-dasharray="4"
              class="opacity-10"
            />
            <line
              :x1="padding"
              :y1="svgHeight - padding"
              :x2="svgWidth - padding"
              :y2="svgHeight - padding"
              stroke="currentColor"
              class="opacity-20"
            />

            <!-- Bars -->
            <g v-for="(bar, idx) in postBars" :key="idx">
              <!-- Rounded rect fallback or stylized bar -->
              <rect
                :x="bar.x"
                :y="bar.y"
                :width="bar.width"
                :height="bar.height"
                rx="4"
                fill="#2ecc71"
                class="hover:fill-emerald-500 transition-colors cursor-pointer"
              />
              <!-- Value on top of bar -->
              <text
                :x="bar.x + bar.width / 2"
                :y="bar.y - 6"
                text-anchor="middle"
                class="text-[9px] font-bold fill-zinc-650 dark:fill-zinc-400"
              >
                {{ bar.value }}
              </text>
            </g>

            <!-- Labels -->
            <text
              v-for="(bar, idx) in postBars"
              :key="`lbl-${idx}`"
              :x="bar.x + bar.width / 2"
              :y="svgHeight - 15"
              text-anchor="middle"
              class="text-[10px] font-semibold fill-zinc-500"
            >
              {{ bar.label }}
            </text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
