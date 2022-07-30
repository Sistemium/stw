<template lang="pug">

el-alert.alert-empty(
  :title="title || $t('validation.noData')"
  :closable="false"
)
  el-button(
    v-if="buttonText"
    @click="$emit('click')"
    type="primary"
    :plain="true"
  ) {{ buttonText }}

</template>
<script>

export default {
  name: 'AlertEmpty',
  props: {
    title: {
      type: String,
    },
    buttonText: String,
  },
};

</script>
<style scoped lang="scss">
.el-alert ::v-deep .el-alert__content {
  flex: 1;

  .el-alert__description {
    text-align: right;
  }
}
</style>
