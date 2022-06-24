<template lang="pug">

.prop-input-boolean
  el-switch(
    v-model="value"
    :active-text="$t('fields.bool.yes')"
    :inactive-text="$t('fields.bool.no')"
  )

</template>
<script>

import PropInput from '@/components/props/PropInputBase';

export default {
  name: 'PropInputBoolean',
  mixins: [PropInput],
};

</script>
<style scoped lang="scss">

</style>
