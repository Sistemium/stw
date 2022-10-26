<template lang="pug">

el-dropdown.workflow-button(@command="onCommand" :trigger="trigger" v-if="step")
  el-button(:type="step.style" :size="size" :disabled="disabled") {{ $t(step.label) }}
  template(v-slot:dropdown)
    el-dropdown-menu
      el-dropdown-item(
        v-for="option in options" :key="option.to"
        :command="option.to"
      ) {{ $t(option.label) }}

</template>
<script>

import workflowMixin from '@/lib/workflowMixin';

export default {
  name: 'WorkflowButton',
  props: {
    trigger: {
      type: String,
      default: 'click',
    },
  },
  mixins: [workflowMixin],
};

</script>
