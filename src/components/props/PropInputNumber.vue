<template lang="pug">

.prop-input-number
  el-input-number(
    v-model="result.numberValue"
    :size="size"
  )

</template>

<script>
import PropInputBase from '@/components/props/PropInputBase';

export default {
  name: 'PropInputNumber',
  mixins: [PropInputBase],
};
</script>

<style scoped lang="scss">

</style>
