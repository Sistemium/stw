<template lang="pug">

.prop-input-options
  el-select(
    allow-create
    filterable
    default-first-option
    v-model="value"
    :size="size"
    value-key="id"
  )
  )
    el-option(label="Test" value="test")

</template>

<script>
import PropInput from '@/components/props/PropInputBase';

export default {
  name: 'PropInputOptions',
  mixins: [PropInput],
};
</script>

<style scoped lang="scss">

</style>
