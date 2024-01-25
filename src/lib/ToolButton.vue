<template lang="pug">

el-button.tool-button(
  :icon="icon"
  :size="size"
  :disabled="disabled || null"
  :circle="circle"
  @click="emit('click')"
)

</template>
<script setup>

import { computed } from 'vue';
import {
  Back,
  CirclePlus,
  Edit,
  Loading,
  Refresh,
  Check,
} from '@element-plus/icons-vue';

const ICONS = {
  add: CirclePlus,
  edit: Edit,
  refresh: Refresh,
  loading: Loading,
  back: Back,
  check: Check,
};

const props = defineProps({
  tool: {
    type: String,
    required: true,
    // validator(value) {
    //   return Object.keys(ICONS)
    //     .includes(value);
    // },
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
    default: 'small',
  },
  circle: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['click']);

const icon = computed(() => {
  const { tool, busy } = props;
  if (busy && tool === 'refresh') {
    return ICONS.loading;
  }
  return ICONS[tool] || `el-icon-${tool}`;
});

</script>
<style scoped lang="scss">

@import "../styles/variables";

.tool-button {
  &:not(.is-disabled) {
    color: $primary-color;
  }

  font-size: 19px;
  padding: 2px;
}

</style>
