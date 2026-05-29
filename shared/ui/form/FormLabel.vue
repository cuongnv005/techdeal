<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { useFormField } from './useFormField'

import type { LabelProps } from 'reka-ui'

import { cn } from '@shared/lib/utils'
import { Label } from '@shared/ui/label'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const { error, formItemId } = useFormField()
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn('data-[error=true]:text-destructive', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
