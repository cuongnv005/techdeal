<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, UserCheck, ShieldAlert, Calendar, Mail, User } from 'lucide-vue-next'
import type { UserItem } from '../types/dashboard.type'

interface Props {
  usersList: UserItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change-role', id: string, role: 'admin' | 'mod' | 'user'): void
  (e: 'toggle-status', id: string): void
}>()

const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return props.usersList
  const query = searchQuery.value.toLowerCase()
  return props.usersList.filter(
    (u) => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
  )
})

const onRoleChange = (id: string, event: Event) => {
  const select = event.target as HTMLSelectElement
  emit('change-role', id, select.value as 'admin' | 'mod' | 'user')
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn">
    <!-- Filter bar -->
    <div
      class="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs"
    >
      <div class="relative w-full sm:max-w-xs">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm thành viên, email..."
          class="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
      </div>
    </div>

    <!-- Users Table -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4">Thành viên</th>
              <th class="px-6 py-4">Vai trò</th>
              <th class="px-6 py-4">Trạng thái</th>
              <th class="px-6 py-4">Ngày tham gia</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-550 border border-gray-200 dark:border-zinc-700"
                  >
                    <User class="w-4.5 h-4.5" />
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-bold text-zinc-900 dark:text-white">
                      {{ user.username }}
                    </h4>
                    <div class="flex items-center gap-1 text-[10px] text-zinc-400">
                      <Mail class="w-3.5 h-3.5" />
                      <span>{{ user.email }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <select
                  :value="user.role"
                  @change="onRoleChange(user.id, $event)"
                  class="text-xs px-2.5 py-1.5 border border-gray-250 dark:border-zinc-850 rounded-lg bg-gray-50 dark:bg-zinc-950 text-zinc-750 dark:text-zinc-350 focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="user">User</option>
                  <option value="mod">Mod</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  :class="
                    user.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-600 border border-red-500/20'
                  "
                >
                  {{ user.status === 'active' ? 'Hoạt động' : 'Bị chặn' }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-xs font-semibold text-zinc-550 flex items-center gap-1 pt-6"
              >
                <Calendar class="w-3.5 h-3.5" />
                {{ user.joinDate }}
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="emit('toggle-status', user.id)"
                  class="p-2 rounded-xl transition-all cursor-pointer"
                  :class="
                    user.status === 'active'
                      ? 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10'
                      : 'text-emerald-500 hover:bg-emerald-500/10'
                  "
                  :title="user.status === 'active' ? 'Chặn tài khoản' : 'Kích hoạt tài khoản'"
                >
                  <ShieldAlert v-if="user.status === 'active'" class="w-4 h-4" />
                  <UserCheck v-else class="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Không tìm thấy thành viên nào...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
