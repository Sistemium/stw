<template lang="pug">

.prop-input-string
  el-input(
    v-model="value"
    :size="size"
  )

</template>

<script>
import PropInput from '@/components/props/PropInputBase';

export default {
  name: 'PropInputString',
  mixins: [PropInput],
};
</script>

<style scoped lang="scss">

.el-input {
  max-width: 200px;
}

</style>
