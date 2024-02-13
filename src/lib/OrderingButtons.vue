<template lang="pug">

.ordering-buttons
  el-link(
    :disabled="index === 0 || null"
    @click.prevent.stop="reorder(-1)"
  )
    el-icon
      ArrowUp

  el-link(
    :disabled="index === length - 1 || null"
    @click.prevent.stop="reorder(1)"
  )
    el-icon
      ArrowDown

  el-link(
    v-if="showClear"
    @click.prevent.stop="remove()"
  )
    el-icon
      Close

</template>
<script setup lang="ts">

import { computed } from 'vue';
import { ArrowDown, ArrowUp, Close } from '@element-plus/icons-vue';

const emit = defineEmits<{
  (e: 'reorder'): void
}>();

const props = defineProps<{
  items: object[];
  item: object;
  showClear: boolean;
}>();

const length = computed(() => props.items.length);
const index = computed(() => props.items.indexOf(props.item));

/* eslint-disable vue/no-mutating-props */

function reorder(change: number) {
  const { value: ord1 } = index;
  const ord2 = ord1 + change;
  props.items.splice(ord1, 1);
  props.items.splice(ord2, 0, props.item);
  emit('reorder');
}

function remove() {
  props.items.splice(index.value, 1);
  emit('reorder');
}

</script>
