<template lang="pug">

.prepend-select
  .prepend
    el-button(
      :icon="buttonIcon"
      @click="emit('buttonClick')"
    )
  slot

</template>
<script setup lang="ts">
import type { Component } from 'vue';
import { Plus } from '@element-plus/icons-vue';

withDefaults(defineProps<{
  buttonIcon?: Component;
}>(), { buttonIcon: Plus });

const emit = defineEmits<{
  (e: 'buttonClick'): void;
}>();

</script>
<style scoped lang="scss">

.prepend-select {

  display: flex;
  width: 100%;
  align-items: flex-start;

  :deep(.el-select--small .el-input__wrapper) {
    //height: 24px;
  }

  :deep(.el-select--default .el-input__wrapper) {
    //height: 32px;
  }

  :deep(.el-select--default .el-select__input-wrapper) {
    //height: 30px;
  }

  :deep(.el-select--default .el-select__wrapper) {
    height: 34px;
  }

  :deep(.el-input__wrapper), :deep(.el-select__wrapper) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  :deep(.el-select), :deep(.el-select) {
    width: 100%;
  }

  .prepend {
    border: 1px solid #DCDFE6;
    border-right: none;
    border-radius: 4px 0 0 4px;
    line-height: 1;

    & + * {
      flex: 1;
    }
  }

  .el-button {
    line-height: 10px;
    border: transparent;
    background-color: #F5F7FA;
  }
}

</style>
