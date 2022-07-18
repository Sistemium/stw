<template lang="pug">

el-dropdown.workflow-button(@command="onCommand" :trigger="trigger" v-if="step")
  el-button(:type="step.style" size="mini" :disabled="disabled") {{ $t(step.label) }}
  template(v-slot:dropdown)
    el-dropdown-menu
      el-dropdown-item(
        v-for="option in options" :key="option.to"
        :command="option.to"
      ) {{ $t(option.label) }}

</template>
<script>

export default {
  name: 'WorkflowButton',
  props: {
    workflow: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    value: String,
    trigger: {
      type: String,
      default: 'click',
    },
  },
  computed: {
    step() {
      return this.workflow.step(this.value);
    },
    options() {
      const { step } = this;
      return (step && step.options) || [];
    },
  },
  methods: {
    onCommand(to) {
      this.$emit('input', to);
    },
  },
};

</script>
