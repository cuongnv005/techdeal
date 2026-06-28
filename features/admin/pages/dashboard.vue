<script setup lang="ts">
import { ref } from 'vue'

import {
  BarChart3,
  BookOpen,
  MessageSquare,
  Users,
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  Gift,
  Link2
} from 'lucide-vue-next'

import Footer from '../../blog/components/Footer.vue'
import Header from '../../blog/components/Header.vue'
import CommentManagement from '../components/CommentManagement.vue'
import PostManagement from '../components/PostManagement.vue'
import StatsDashboard from '../components/StatsDashboard.vue'
import UserManagement from '../components/UserManagement.vue'
import { useAdminStats } from '../composables/use-admin'

import GiveawayManagement from '@features/giveaway/components/GiveawayManagement.vue'
import ShortlinkManagement from '@features/shortlink/components/ShortlinkManagement.vue'
import { useUserStore } from '@stores/user'

const userStore = useUserStore()

// Access control check
const hasAccess = computed(() => {
  return userStore.isAuthenticated && (userStore.role === 'admin' || userStore.role === 'mod')
})

const activeTab = ref<'stats' | 'posts' | 'comments' | 'users' | 'giveaway' | 'shortlink'>('stats')

// Call composables
const { stats, isLoadingStats } = await useAdminStats()
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <!-- Access Denied Screen -->
    <div v-if="!hasAccess" class="container mx-auto px-4 py-24 max-w-md text-center space-y-6">
      <div
        class="w-16 h-16 mx-auto bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/20"
      >
        <ShieldAlert class="w-8 h-8" />
      </div>
      <div class="space-y-2">
        <h1 class="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
          Quyền truy cập bị từ chối
        </h1>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Trang này chỉ dành cho Quản trị viên (Admin) hoặc Điều hành viên (Mod). Vui lòng đăng nhập
          bằng tài khoản được cấp quyền để truy cập trang này.
        </p>
      </div>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
      >
        <ArrowLeft class="w-4 h-4" /> Quay lại Trang chủ
      </NuxtLink>
    </div>

    <!-- Admin Workspace -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:w-64 shrink-0 space-y-6">
          <div
            class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs space-y-4"
          >
            <div
              class="flex items-center gap-2 border-b border-gray-150 dark:border-zinc-800 pb-3 mb-2"
            >
              <span class="p-1.5 bg-[#3498db]/10 text-[#3498db] rounded-lg">🛡️</span>
              <div>
                <h2
                  class="text-xs font-black uppercase text-zinc-900 dark:text-white tracking-tight"
                >
                  Admin Console
                </h2>
                <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest"
                  >{{ userStore.role }} mode</span
                >
              </div>
            </div>

            <nav class="space-y-1">
              <button
                @click="activeTab = 'stats'"
                class="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                :class="
                  activeTab === 'stats'
                    ? 'bg-[#3498db]/15 text-[#3498db] dark:bg-[#e74c3c]/15 dark:text-[#e74c3c]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-950'
                "
              >
                <LayoutDashboard class="w-4 h-4" />
                Tổng quan & Thống kê
              </button>

              <button
                @click="activeTab = 'posts'"
                class="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                :class="
                  activeTab === 'posts'
                    ? 'bg-[#3498db]/15 text-[#3498db] dark:bg-[#e74c3c]/15 dark:text-[#e74c3c]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-950'
                "
              >
                <BookOpen class="w-4 h-4" />
                Quản lý Bài viết
              </button>

              <button
                @click="activeTab = 'comments'"
                class="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                :class="
                  activeTab === 'comments'
                    ? 'bg-[#3498db]/15 text-[#3498db] dark:bg-[#e74c3c]/15 dark:text-[#e74c3c]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-950'
                "
              >
                <MessageSquare class="w-4 h-4" />
                Quản lý Bình luận
              </button>

              <button
                @click="activeTab = 'users'"
                class="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                :class="
                  activeTab === 'users'
                    ? 'bg-[#3498db]/15 text-[#3498db] dark:bg-[#e74c3c]/15 dark:text-[#e74c3c]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-950'
                "
              >
                <Users class="w-4 h-4" />
                Quản lý Thành viên
              </button>

              <button
                @click="activeTab = 'giveaway'"
                class="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                :class="
                  activeTab === 'giveaway'
                    ? 'bg-[#3498db]/15 text-[#3498db] dark:bg-[#e74c3c]/15 dark:text-[#e74c3c]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-950'
                "
              >
                <Gift class="w-4 h-4" />
                Quản lý Giveaway
              </button>

              <button
                @click="activeTab = 'shortlink'"
                class="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                :class="
                  activeTab === 'shortlink'
                    ? 'bg-[#3498db]/15 text-[#3498db] dark:bg-[#e74c3c]/15 dark:text-[#e74c3c]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-950'
                "
              >
                <Link2 class="w-4 h-4" />
                Quản lý Shortlink
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main Panel Content -->
        <main class="flex-grow">
          <!-- Stats Tab -->
          <div v-if="activeTab === 'stats'">
            <div v-if="isLoadingStats" class="text-center py-12 text-zinc-500">
              Đang tải số liệu...
            </div>
            <StatsDashboard v-else :stats-data="stats" />
          </div>

          <!-- Posts Tab -->
          <div v-else-if="activeTab === 'posts'">
            <PostManagement />
          </div>

          <!-- Comments Tab -->
          <div v-else-if="activeTab === 'comments'">
            <CommentManagement />
          </div>

          <!-- Users Tab -->
          <div v-else-if="activeTab === 'users'">
            <UserManagement />
          </div>

          <!-- Giveaway Tab -->
          <div v-else-if="activeTab === 'giveaway'">
            <GiveawayManagement />
          </div>

          <!-- Shortlink Tab -->
          <div v-else-if="activeTab === 'shortlink'">
            <ShortlinkManagement />
          </div>
        </main>
      </div>
    </div>

    <Footer />
  </div>
</template>
