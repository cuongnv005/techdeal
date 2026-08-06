<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import {
  User,
  Mail,
  Calendar,
  MapPin,
  Heart,
  FileText,
  Edit2,
  Save,
  X,
  Cake,
  Users
} from 'lucide-vue-next'

import type { UserProfile } from '../types/user.type'

interface Props {
  profile: UserProfile
  isOwner?: boolean
  isSaving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOwner: false,
  isSaving: false
})

const { t, locale } = useI18n()

const emit = defineEmits<{
  (e: 'update:profile', data: Partial<UserProfile>): void
}>()

const isEditing = ref(false)

// Form states
const fullName = ref('')
const dob = ref('')
const fromLocation = ref('')
const gender = ref('')
const bio = ref('')

// Initialize form states from props
const initForm = () => {
  fullName.value = props.profile.full_name || ''
  dob.value = props.profile.dob || ''
  fromLocation.value = props.profile.from_location || ''
  gender.value = props.profile.gender || ''
  bio.value = props.profile.bio || ''
}

// Watch profile changes
watch(() => props.profile, initForm, { immediate: true })

const startEditing = () => {
  initForm()
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const handleSave = () => {
  // Front-end validations
  if (fullName.value.length > 50) {
    alert(t('user_profile.validation_fullname'))
    return
  }
  if (fromLocation.value.length > 50) {
    alert(t('user_profile.validation_location'))
    return
  }
  if (gender.value.length > 50) {
    alert(t('user_profile.validation_gender'))
    return
  }
  if (dob.value.length > 50) {
    alert(t('user_profile.validation_dob'))
    return
  }
  if (bio.value.length > 1000) {
    alert(t('user_profile.validation_bio'))
    return
  }

  emit('update:profile', {
    full_name: fullName.value,
    dob: dob.value,
    from_location: fromLocation.value,
    gender: gender.value,
    bio: bio.value
  })
  isEditing.value = false
}

const dateLocale = computed(() => (locale.value === 'en' ? 'en-US' : 'vi-VN'))

// Format Join Date
const formattedJoinDate = computed(() => {
  if (!props.profile.created_at) return ''
  return new Date(props.profile.created_at).toLocaleDateString(dateLocale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
})

// Format Date of Birth
const formattedDob = computed(() => {
  if (!props.profile.dob) return ''
  return new Date(props.profile.dob).toLocaleDateString(dateLocale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
})

const genderDisplay = computed(() => {
  const g = props.profile.gender?.toLowerCase()
  if (g === 'male') return t('user_profile.gender_male')
  if (g === 'female') return t('user_profile.gender_female')
  if (g === 'other') return t('user_profile.gender_other')
  return props.profile.gender || t('user_profile.not_updated')
})

// Bio truncation logic
const isExpanded = ref(false)

const hasLongBio = computed(() => {
  return (props.profile.bio || '').length > 300
})

const displayedBio = computed(() => {
  const text = props.profile.bio || ''
  if (!hasLongBio.value || isExpanded.value) {
    return text
  }
  return text.substring(0, 300) + '...'
})
</script>

<template>
  <div
    class="bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-850 rounded-2xl p-6 shadow-sm relative transition-all duration-300"
  >
    <!-- VIEW MODE -->
    <div v-if="!isEditing" class="space-y-6 pt-2">
      <!-- Header section with Name, Username and Edit Button -->
      <div class="flex flex-col gap-3">
        <div v-if="isOwner && !isEditing" class="self-end shrink-0">
          <button
            @click="startEditing"
            class="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#3498db] dark:hover:text-[#e74c3c] bg-gray-50 dark:bg-zinc-950 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer select-none"
          >
            <Edit2 class="w-3.5 h-3.5" /> {{ $t('user_profile.edit_info') }}
          </button>
        </div>

        <div class="space-y-1">
          <h2 class="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
            {{ profile.full_name || $t('user_profile.no_full_name') }}
          </h2>
          <p class="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
            @{{ profile.username }}
          </p>
        </div>
      </div>

      <!-- Grid Information Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-2">
        <!-- Email (Only visible/hidden logic based on availability) -->
        <div v-if="profile.email" class="flex items-center gap-3 text-xs">
          <Mail class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email</p>
            <p class="text-zinc-700 dark:text-zinc-300 font-semibold">{{ profile.email }}</p>
          </div>
        </div>

        <!-- Join Date -->
        <div class="flex items-center gap-3 text-xs">
          <Calendar class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {{ $t('user_profile.join_date') }}
            </p>
            <p class="text-zinc-700 dark:text-zinc-300 font-semibold">{{ formattedJoinDate }}</p>
          </div>
        </div>

        <!-- Birthday -->
        <div class="flex items-center gap-3 text-xs">
          <Cake class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {{ $t('user_profile.dob_label') }}
            </p>
            <p class="text-zinc-700 dark:text-zinc-300 font-semibold">
              {{ formattedDob || $t('user_profile.not_updated') }}
            </p>
          </div>
        </div>

        <!-- Location -->
        <div class="flex items-center gap-3 text-xs">
          <MapPin class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {{ $t('user_profile.from_label') }}
            </p>
            <p class="text-zinc-700 dark:text-zinc-300 font-semibold">
              {{ profile.from_location || $t('user_profile.not_updated') }}
            </p>
          </div>
        </div>

        <!-- Gender -->
        <div class="flex items-center gap-3 text-xs">
          <Users class="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {{ $t('user_profile.gender_label') }}
            </p>
            <p class="text-zinc-700 dark:text-zinc-300 font-semibold">{{ genderDisplay }}</p>
          </div>
        </div>
      </div>

      <!-- Bio / Introduction -->
      <div
        class="bg-gray-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-gray-100 dark:border-zinc-850 space-y-2"
      >
        <h3
          class="text-[10px] font-extrabold uppercase text-zinc-400 dark:text-zinc-550 tracking-widest mb-1"
        >
          {{ $t('user_profile.bio_title') }}
        </h3>
        <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400 whitespace-pre-wrap">
          {{ displayedBio || $t('user_profile.no_bio') }}
        </p>
        <button
          v-if="hasLongBio"
          @click="isExpanded = !isExpanded"
          class="text-[10px] font-bold text-[#3498db] dark:text-[#e74c3c] hover:underline cursor-pointer select-none"
        >
          {{ isExpanded ? $t('user_profile.show_less') : $t('user_profile.show_more') }}
        </button>
      </div>

      <!-- Stats Counters -->
      <div class="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-850 pt-5">
        <div
          class="bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-150 dark:border-zinc-850 flex items-center gap-3"
        >
          <FileText class="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <p class="text-xs font-black text-zinc-900 dark:text-white">
              {{ profile.post_count || 0 }}
            </p>
            <p class="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">
              {{ $t('user_profile.posts_count_label') }}
            </p>
          </div>
        </div>
        <div
          class="bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-150 dark:border-zinc-850 flex items-center gap-3"
        >
          <Heart class="w-4 h-4 text-red-500 shrink-0" />
          <div>
            <p class="text-xs font-black text-zinc-900 dark:text-white">
              {{ profile.like_count || 0 }}
            </p>
            <p class="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">
              {{ $t('user_profile.likes_count_label') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODE -->
    <div v-else class="space-y-5">
      <h3
        class="text-sm font-extrabold uppercase text-zinc-800 dark:text-zinc-200 tracking-wider flex items-center gap-1.5"
      >
        <span>✏️</span> {{ $t('user_profile.update_profile_title') }}
      </h3>

      <div class="space-y-4">
        <!-- Nickname (Disabled) -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{{
            $t('user_profile.nickname_label')
          }}</label>
          <input
            :value="profile.username"
            disabled
            type="text"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-100 dark:bg-zinc-950 text-zinc-500 cursor-not-allowed"
          />
          <p class="text-[10px] text-zinc-400">{{ $t('user_profile.nickname_disabled_note') }}</p>
        </div>

        <!-- Email (Disabled) -->
        <div v-if="profile.email" class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Email</label>
          <input
            :value="profile.email"
            disabled
            type="text"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-100 dark:bg-zinc-950 text-zinc-500 cursor-not-allowed"
          />
          <p class="text-[10px] text-zinc-400">{{ $t('user_profile.email_disabled_note') }}</p>
        </div>

        <!-- Real Name -->
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{{
              $t('user_profile.full_name_label')
            }}</label>
            <span
              class="text-[10px] font-medium"
              :class="fullName.length > 50 ? 'text-red-500' : 'text-zinc-400'"
            >
              {{ fullName.length }}/50
            </span>
          </div>
          <input
            v-model="fullName"
            type="text"
            :placeholder="$t('user_profile.full_name_placeholder')"
            maxlength="50"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          />
        </div>

        <!-- Date of Birth -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{{
            $t('user_profile.dob_label')
          }}</label>
          <input
            v-model="dob"
            type="date"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          />
        </div>

        <!-- Location -->
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{{
              $t('user_profile.from_location_label')
            }}</label>
            <span
              class="text-[10px] font-medium"
              :class="fromLocation.length > 50 ? 'text-red-500' : 'text-zinc-400'"
            >
              {{ fromLocation.length }}/50
            </span>
          </div>
          <input
            v-model="fromLocation"
            type="text"
            :placeholder="$t('user_profile.from_location_placeholder')"
            maxlength="50"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          />
        </div>

        <!-- Gender -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{{
            $t('user_profile.gender_label')
          }}</label>
          <select
            v-model="gender"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          >
            <option value="">{{ $t('user_profile.gender_unset') }}</option>
            <option value="male">{{ $t('user_profile.gender_male') }}</option>
            <option value="female">{{ $t('user_profile.gender_female') }}</option>
            <option value="other">{{ $t('user_profile.gender_other') }}</option>
          </select>
        </div>

        <!-- Biography -->
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{{
              $t('user_profile.bio_title')
            }}</label>
            <span
              class="text-[10px] font-medium"
              :class="bio.length > 1000 ? 'text-red-500' : 'text-zinc-400'"
            >
              {{ bio.length }}/1000
            </span>
          </div>
          <textarea
            v-model="bio"
            rows="4"
            :placeholder="$t('user_profile.bio_placeholder')"
            maxlength="1000"
            class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db] resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 pt-2">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#3498db] hover:bg-sky-600 dark:bg-[#e74c3c] dark:hover:bg-[#c0392b] rounded-xl transition-colors cursor-pointer select-none disabled:opacity-50"
        >
          <Save class="w-4 h-4" />
          {{ isSaving ? $t('user_profile.saving') : $t('user_profile.save') }}
        </button>
        <button
          @click="cancelEditing"
          :disabled="isSaving"
          class="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-950 rounded-xl transition-colors cursor-pointer select-none disabled:opacity-50"
        >
          <X class="w-4 h-4" /> {{ $t('user_profile.cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>
