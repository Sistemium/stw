<template lang="pug">

.prop-input-boolean
  el-switch(
    v-model="result.boolValue"
    :active-text="$t('fields.bool.yes')"
    :inactive-text="$t('fields.bool.no')"
    :size="size"
  )

</template>
<script>

import PropInputBase from '@/components/props/PropInputBase';

export default {
  name: 'PropInputBoolean',
  mixins: [PropInputBase],
};

</script>
<style scoped lang="scss">

</style>
