<template lang="pug">

.workflow-transitions
  el-button(
    :disabled="disabled"
    v-for="option in options"
    :key="option.processing"
    @click="onCommand(option.to)"
    :size="size"
    :type="option.type"
  ) {{ $t(option.label) }}

</template>
<script>

import workflowMixin from '@/lib/workflowMixin';

export default {
  name: 'WorkflowTransitions',
  props: {
    workflow: Object,
    value: String,
  },
  mixins: [workflowMixin],
};

</script>
<style scoped lang="scss">

</style>
