<template lang="pug">

.prop-input
  .label
    el-tag(
      closable @close="$emit('close', prop)"
      size="small"
      type="info"
    )
      span(v-if="prop.prefix") {{ prop.prefix }}
      span {{ prop.name }}
      span(v-if="prop.suffix") {{ prop.suffix }}
  .value()
    component(
      v-if="componentName" :is="componentName" :prop="prop"
      :value="value"
      @input="onInput"
    )

</template>

<script>

import PropInputOptions from '@/components/props/PropInputOptions.vue';
import PropInputString from '@/components/props/PropInputString.vue';
import PropInputNumber from '@/components/props/PropInputNumber.vue';
import PropInputBoolean from '@/components/props/PropInputBoolean.vue';

export default {
  name: 'PropInput',
  props: {
    prop: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    componentName() {
      const { prop } = this;
      return `prop-input-${prop.type}`;
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
  components: {
    PropInputOptions,
    PropInputString,
    PropInputNumber,
    PropInputBoolean,
  },
};
</script>

<style scoped lang="scss">
@import "../../styles/variables";

.prop-input {
  display: flex;
  align-items: center;
  justify-content: center;

  > .label {
    margin-right: $margin-right;
    flex: 2;
    text-align: right;
  }

  .value {
    flex: 3;
    text-align: left;
  }
}

span + span {
  margin-left: 2px;
}

</style>
