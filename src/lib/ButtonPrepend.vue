<template lang="pug">

.prepend-select
  .prepend
    el-button(:icon="buttonIcon" @click="$emit('buttonClick')")
  slot

</template>
<script>

export default {
  name: 'ButtonPrepend',
  props: {
    buttonIcon: {
      type: String,
      default: 'el-icon-plus',
    },
  },
};

</script>
<style scoped lang="scss">

.prepend-select {

  display: flex;
  width: 100%;
  align-items: flex-start;

  ::v-deep input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .prepend {
    border: 1px solid #DCDFE6;
    border-right: none;
    border-radius: 4px 0 0 4px;
    line-height: 1;
    & + *{
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
