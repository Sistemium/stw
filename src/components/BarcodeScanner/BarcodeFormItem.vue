<template lang="pug">

el-form-item.barcode-form-item(:label="label" :prop="prop")
  el-input(v-model="barcode")
    template(#prepend)
      slot(name="prepend")
    template(#append)
      el-button(icon="el-icon-close" @click="barcode = ''")

</template>
<script>

export default {
  name: 'BarcodeFormItem',
  props: {
    prop: {
      type: String,
      default: 'barcode',
    },
    value: String,
  },
  computed: {
    label() {
      return this.$t('fields.barcode');
    },
    barcode: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
