<template lang="pug">

.prop-input-options
  el-select(
    allow-create
    filterable
    default-first-option
    v-model="value"
    size="small"
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
