<script setup lang="ts">
import { ref } from 'vue'
import { Camera, Loader2 } from 'lucide-vue-next'

interface Props {
  avatarUrl?: string
  isEditable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: '',
  isEditable: false
})

const emit = defineEmits<{
  (e: 'update:avatar', url: string): void
}>()

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  if (props.isEditable && !isUploading.value) {
    fileInput.value?.click()
  }
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isUploading.value = true
  const formData = new FormData()
  formData.append('image', file)

  try {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '6ce9e48f04f516098561190131d8011e'
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    if (result.success && result.data?.url) {
      emit('update:avatar', result.data.url)
    } else {
      alert('Tải ảnh lên thất bại. Vui lòng thử lại!')
    }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    alert('Có lỗi xảy ra khi tải ảnh lên!')
  } finally {
    isUploading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<template>
  <div
    class="relative group w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg"
  >
    <!-- Image -->
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      alt="User Avatar"
      class="w-full h-full object-cover transition-transform duration-300"
      :class="{ 'group-hover:scale-105': isEditable }"
    />
    <!-- Fallback if no avatar -->
    <div
      v-else
      class="w-full h-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold select-none"
    >
      ?
    </div>

    <!-- Upload Overlay -->
    <div
      v-if="isEditable"
      @click="triggerFileInput"
      class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-300"
      :class="{ 'opacity-100': !avatarUrl }"
    >
      <div v-if="isUploading" class="flex flex-col items-center">
        <Loader2 class="w-6 h-6 animate-spin text-white" />
        <span class="text-[10px] mt-1 font-semibold">Đang tải...</span>
      </div>
      <div v-else class="flex flex-col items-center">
        <Camera class="w-6 h-6 text-white mb-1" />
        <span class="text-[10px] font-bold uppercase tracking-wider text-center px-2">
          {{ avatarUrl ? 'Đổi ảnh' : 'Thêm ảnh' }}
        </span>
      </div>
    </div>

    <!-- Hidden Input -->
    <input
      v-if="isEditable"
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>
