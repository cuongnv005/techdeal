<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Ban,
  Clock,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  Smartphone,
  Eye,
  Check,
  X
} from 'lucide-vue-next'
import {
  moderationRepository,
  type AdminReportItem,
  type TargetType
} from '@features/moderation/api/moderation'

const reports = ref<AdminReportItem[]>([])
const isLoading = ref(false)
const statusFilter = ref<string>('all')
const targetTypeFilter = ref<string>('all')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

const isProcessing = ref<Record<number, boolean>>({})
const selectedReport = ref<AdminReportItem | null>(null)
const adminNotesInput = ref('')

const fetchReports = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await moderationRepository.getAdminReports({
      status: statusFilter.value,
      target_type: targetTypeFilter.value,
      page,
      limit: 15
    })
    reports.value = res.items
    currentPage.value = res.pagination.page
    totalPages.value = res.pagination.total_pages
    totalItems.value = res.pagination.total_items
  } catch (err) {
    console.error('Error fetching admin reports:', err)
  } finally {
    isLoading.value = false
  }
}

watch([statusFilter, targetTypeFilter], () => {
  currentPage.value = 1
  fetchReports(1)
})

onMounted(() => {
  fetchReports(1)
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ xử lý',
        class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      }
    case 'reviewed':
      return {
        label: 'Đang xem xét',
        class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      }
    case 'action_taken':
      return {
        label: 'Đã xử lý (Gỡ/Cấm)',
        class: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      }
    case 'dismissed':
      return { label: 'Bỏ qua (Hợp lệ)', class: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' }
    default:
      return { label: status, class: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' }
  }
}

const getTargetTypeBadge = (type?: string) => {
  switch (type) {
    case 'post':
      return { label: 'Bài viết (News)', icon: FileText, class: 'text-indigo-500 bg-indigo-500/10' }
    case 'thread':
      return { label: 'Deal (Thread)', icon: Smartphone, class: 'text-sky-500 bg-sky-500/10' }
    case 'comment':
      return { label: 'Bình luận', icon: MessageSquare, class: 'text-amber-500 bg-amber-500/10' }
    case 'user':
      return { label: 'Thành viên', icon: User, class: 'text-purple-500 bg-purple-500/10' }
    default:
      return { label: type || 'Khác', icon: FileText, class: 'text-zinc-500 bg-zinc-500/10' }
  }
}

const handleStatusChange = async (
  report: AdminReportItem,
  newStatus: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
) => {
  isProcessing.value[report.id] = true
  try {
    const res = await moderationRepository.updateReportStatus(
      report.id,
      newStatus,
      report.admin_notes || undefined
    )
    if (res.success) {
      report.status = newStatus
    } else {
      alert(res.error || 'Lỗi khi cập nhật trạng thái')
    }
  } finally {
    isProcessing.value[report.id] = false
  }
}

const handleDeleteContent = async (report: AdminReportItem) => {
  if (!confirm(`Xác nhận gỡ bỏ nội dung của báo cáo #${report.id}?`)) return
  isProcessing.value[report.id] = true
  try {
    const res = await moderationRepository.deleteReportContent(report.id)
    if (res.success) {
      alert('Đã gỡ bỏ nội dung vi phạm thành công!')
      report.status = 'action_taken'
      report.admin_notes = 'Nội dung đã được gỡ bỏ bởi quản trị viên'
    } else {
      alert(res.error || 'Lỗi khi gỡ nội dung')
    }
  } finally {
    isProcessing.value[report.id] = false
  }
}

const handleBanUser = async (userId: string, reportId: number) => {
  const reason = prompt('Nhập lý do khóa tài khoản:', 'Vi phạm chính sách UGC nghiêm trọng')
  if (reason === null) return
  isProcessing.value[reportId] = true
  try {
    const res = await moderationRepository.banUser(userId, reason)
    if (res.success) {
      alert('Đã khóa tài khoản người dùng vi phạm thành công!')
      fetchReports(currentPage.value)
    } else {
      alert(res.error || 'Lỗi khi khóa tài khoản')
    }
  } finally {
    isProcessing.value[reportId] = false
  }
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn">
    <!-- Header & Statistics Banner -->
    <div
      class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-2">
          <ShieldAlert class="w-5 h-5 text-amber-500" />
          <h2 class="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Quản lý Báo cáo Vi phạm (UGC Moderation)
          </h2>
        </div>
        <p class="text-xs text-zinc-500 mt-1">
          Xem xét, gỡ bỏ nội dung xấu độc và xử lý tài khoản vi phạm theo chính sách
          <strong class="text-amber-600 dark:text-amber-400"
            >Zero-Tolerance & cam kết trong 24 giờ</strong
          >.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
        >
          Tổng cộng: {{ totalItems }} báo cáo
        </span>
      </div>
    </div>

    <!-- Filters Bar -->
    <div
      class="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs flex flex-wrap items-center justify-between gap-4"
    >
      <div class="flex flex-wrap items-center gap-3">
        <!-- Status Filter -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-zinc-500">Trạng thái:</span>
          <select
            v-model="statusFilter"
            class="text-xs py-2 px-3 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Chờ xử lý (Pending)</option>
            <option value="reviewed">👀 Đang xem xét (Reviewed)</option>
            <option value="action_taken">✅ Đã xử lý (Action Taken)</option>
            <option value="dismissed">🚫 Đã bỏ qua (Dismissed)</option>
          </select>
        </div>

        <!-- Target Type Filter -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-zinc-500">Đối tượng:</span>
          <select
            v-model="targetTypeFilter"
            class="text-xs py-2 px-3 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          >
            <option value="all">Tất cả đối tượng</option>
            <option value="post">Bài viết (Post / News)</option>
            <option value="thread">Deal (Thread)</option>
            <option value="comment">Bình luận (Comment)</option>
            <option value="user">Thành viên (User)</option>
          </select>
        </div>
      </div>

      <button
        @click="fetchReports(currentPage)"
        class="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        Làm mới danh sách
      </button>
    </div>

    <!-- Reports Table -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div v-if="isLoading" class="p-12 text-center text-xs text-zinc-400">
        Đang tải danh sách báo cáo vi phạm...
      </div>

      <div v-else-if="reports.length === 0" class="p-12 text-center text-xs text-zinc-400 italic">
        Không có báo cáo vi phạm nào phù hợp với bộ lọc hiện tại.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-5 py-3.5">Báo cáo #</th>
              <th class="px-5 py-3.5">Đối tượng</th>
              <th class="px-5 py-3.5">Lý do & Chi tiết</th>
              <th class="px-5 py-3.5">Người báo cáo</th>
              <th class="px-5 py-3.5">Trạng thái</th>
              <th class="px-5 py-3.5 text-right">Thao tác xử lý</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="item in reports"
              :key="item.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <!-- ID & Time -->
              <td class="px-5 py-4 align-top">
                <span class="text-xs font-bold text-zinc-900 dark:text-white">#{{ item.id }}</span>
                <div class="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                  <Clock class="w-3 h-3" />
                  <span>{{ new Date(item.created_at).toLocaleString('vi-VN') }}</span>
                </div>
              </td>

              <!-- Target Type & Content Info -->
              <td class="px-5 py-4 align-top max-w-xs">
                <div class="space-y-1.5">
                  <span
                    class="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md"
                    :class="getTargetTypeBadge(item.target_type).class"
                  >
                    <component :is="getTargetTypeBadge(item.target_type).icon" class="w-3 h-3" />
                    {{ getTargetTypeBadge(item.target_type).label }}
                  </span>

                  <!-- Target Details -->
                  <div
                    v-if="item.target_info"
                    class="text-xs text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    <p v-if="item.target_type === 'post'" class="line-clamp-2">
                      <strong>Tiêu đề:</strong> {{ item.target_info.title }}
                    </p>
                    <p v-else-if="item.target_type === 'thread'" class="line-clamp-2">
                      <strong>App:</strong>
                      {{ item.target_info.app_name || item.target_info.title }}
                    </p>
                    <p
                      v-else-if="item.target_type === 'comment'"
                      class="line-clamp-2 italic bg-gray-100 dark:bg-zinc-800/60 p-1.5 rounded-lg"
                    >
                      "{{ item.target_info.content }}"
                    </p>
                    <p v-else-if="item.target_type === 'user'">
                      <strong>User:</strong> {{ item.target_info.username }} ({{
                        item.target_info.email
                      }})
                    </p>
                  </div>
                  <div v-else class="text-[11px] text-zinc-400">ID: {{ item.target_id }}</div>
                </div>
              </td>

              <!-- Reason & Details -->
              <td class="px-5 py-4 align-top max-w-sm">
                <div class="space-y-1">
                  <span class="text-xs font-bold text-red-600 dark:text-red-400">
                    {{ item.reason }}
                  </span>
                  <p
                    v-if="item.details"
                    class="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed"
                  >
                    {{ item.details }}
                  </p>
                  <p
                    v-if="item.admin_notes"
                    class="text-[10px] text-zinc-500 dark:text-zinc-400 bg-amber-500/5 p-1.5 rounded border border-amber-500/10"
                  >
                    <strong>Ghi chú Admin:</strong> {{ item.admin_notes }}
                  </p>
                </div>
              </td>

              <!-- Reporter -->
              <td class="px-5 py-4 align-top">
                <div class="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                  {{ item.reporter_username || 'User #' + item.reporter_user_id }}
                </div>
                <div class="text-[10px] text-zinc-400">
                  {{ item.reporter_email || '' }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-5 py-4 align-top">
                <span
                  class="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg border select-none"
                  :class="getStatusBadge(item.status).class"
                >
                  {{ getStatusBadge(item.status).label }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-5 py-4 align-top text-right">
                <div class="flex items-center justify-end gap-1.5 flex-wrap">
                  <!-- Gỡ nội dung (cho post, thread, comment) -->
                  <button
                    v-if="
                      ['post', 'thread', 'comment'].includes(item.target_type) &&
                      item.status !== 'action_taken'
                    "
                    @click="handleDeleteContent(item)"
                    :disabled="isProcessing[item.id]"
                    class="px-2.5 py-1.5 text-[11px] font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Gỡ bỏ nội dung xấu"
                  >
                    <Trash2 class="w-3 h-3" />
                    Gỡ nội dung
                  </button>

                  <!-- Khóa tài khoản (cho user hoặc author của post/comment) -->
                  <button
                    v-if="item.target_type === 'user'"
                    @click="handleBanUser(item.target_id, item.id)"
                    :disabled="isProcessing[item.id]"
                    class="px-2.5 py-1.5 text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Khóa tài khoản vi phạm"
                  >
                    <Ban class="w-3 h-3" />
                    Khóa User
                  </button>

                  <!-- Nút Bỏ qua (Dismissed) -->
                  <button
                    v-if="item.status === 'pending' || item.status === 'reviewed'"
                    @click="handleStatusChange(item, 'dismissed')"
                    :disabled="isProcessing[item.id]"
                    class="px-2.5 py-1.5 text-[11px] font-bold border border-gray-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Bỏ qua báo cáo hợp lệ"
                  >
                    <X class="w-3 h-3" />
                    Bỏ qua
                  </button>

                  <!-- Đánh dấu hoàn thành -->
                  <button
                    v-if="item.status === 'pending' || item.status === 'reviewed'"
                    @click="handleStatusChange(item, 'action_taken')"
                    :disabled="isProcessing[item.id]"
                    class="px-2.5 py-1.5 text-[11px] font-bold border border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Đánh dấu đã xử lý"
                  >
                    <Check class="w-3 h-3" />
                    Đã duyệt
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-2">
      <button
        :disabled="currentPage <= 1"
        @click="fetchReports(currentPage - 1)"
        class="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50"
      >
        Trước
      </button>
      <span class="text-xs font-bold text-zinc-500">
        Trang {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        :disabled="currentPage >= totalPages"
        @click="fetchReports(currentPage + 1)"
        class="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  </div>
</template>
