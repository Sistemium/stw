<template lang="pug">
.workflow-processing
  el-tag.processing(
    :type
    :effect
    :size
  ) {{ $t(`workflow.${ processing || 'progress' }`) }}
  slot
</template>
<script setup lang="ts">

import type Workflow from '@/lib/Workflow'
import { computed } from 'vue'
import type { ElementsSize } from '@/types/elements.ts'

const props = defineProps<{
  workflow?: Workflow
  processing?: string
  size?: ElementsSize
}>();

const step = computed(() => props.workflow?.step(props.processing))
const effect = computed(() => step.value?.effect || 'plain')
const type = computed(() => step.value?.type || 'info')

</script>
<style scoped lang="scss">

</style>
