<template lang="pug">
.workflow-processing
  el-tag.processing(
    :type
    effect="plain"
  ) {{ $t(`workflow.${ processing || 'progress' }`) }}
  slot
</template>
<script setup lang="ts">

import type Workflow from '@/lib/Workflow'
import { computed } from 'vue'

const props = defineProps<{
  workflow?: Workflow
  processing?: string;
}>();

const type = computed(() => props.workflow?.step(props.processing)?.type || 'info')

</script>
<style scoped lang="scss">

</style>
