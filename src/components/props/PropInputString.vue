<template lang="pug">

.prop-input-string
  el-input(
    v-model="stringValue"
    :size="size"
  )

</template>

<script>
import PropInputBase from '@/components/props/PropInputBase';
import { TYPES_DEFAULTS } from '@/models/ArticleProp';

export default {
  name: 'PropInputString',
  mixins: [PropInputBase],
  computed: {
    stringValue: {
      get() {
        return this.result.stringValue;
      },
      set(value) {
        this.result.stringValue = value || TYPES_DEFAULTS.string;
      },
    },
  },
};
</script>

<style scoped lang="scss">

.el-input {
  max-width: 200px;
}

</style>
