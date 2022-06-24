<template lang="pug">

.prop-input-number
  el-input-number(
    v-model="value"
    size="small"
  )

</template>

<script>
import PropInput from '@/components/props/PropInputBase';

export default {
  name: 'PropInputNumber',
  mixins: [PropInput],
};
</script>

<style scoped lang="scss">

</style>
