<template lang="pug">

el-alert.alert-empty(
  :title="title || $t('validation.noData')"
  :closable="false"
)
  el-button(
    v-if="buttonText && !disabled"
    @click="emit('click')"
    type="primary"
    :plain="true"
  ) {{ buttonText }}

</template>
<script setup>

defineProps({
  title: {
    type: String,
  },
  buttonText: String,
  disabled: Boolean,
});

const emit = defineEmits(['click']);

</script>
<style scoped lang="scss">
.el-alert :deep(.el-alert__content) {
  flex: 1;

  .el-alert__description {
    text-align: right;
  }
}

.alert-empty {
  max-width: 500px;
  margin-right: auto;
  margin-left: auto;
}
</style>
