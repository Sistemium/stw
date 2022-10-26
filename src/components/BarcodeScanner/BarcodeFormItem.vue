<template lang="pug">

el-form-item.barcode-form-item(:label="label" :prop="prop")
  el-input(v-model="barcode")
    template(v-slot:prepend)
      slot(name="prepend")
    template(v-slot:append)
      el-button(icon="el-icon-close" @click="barcode = ''")

</template>
<script>

export default {
  name: 'BarcodeFormItem',
  props: {
    label: {
      type: String,
      default() {
        return this.$t('fields.barcode');
      },
    },
    prop: {
      type: String,
      default: 'barcode',
    },
    value: String,
  },
  computed: {
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
