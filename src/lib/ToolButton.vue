<template lang="pug">

v-btn.tool-button(
  :icon="icon"
  :size="size"
  density="compact"
  color="primary"
  variant="plain"
  :disabled="disabled || false"
  :circle="circle"
  @click="e => emit('click', e)"
)

</template>
<script setup lang="ts">

import { computed } from 'vue';

const ICONS: Record<string, any> = {
  add: '$mdiPlusCircle',
  edit: '$mdiPencilCircle',
  refresh: '$mdiRefresh',
  loading: '$mdiLoading',
  back: '$mdiChevronLeft',
  check: '$mdiCheck',
};

const props = defineProps({
  tool: {
    type: String,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    // default: 'small',
  },
  circle: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: 'click', ev: any): void
}>();

const icon = computed(() => {
  const { tool, busy } = props;
  if (busy && tool === 'refresh') {
    return ICONS.loading;
  }
  return ICONS[tool] || `$mdi${tool}`;
});

</script>
