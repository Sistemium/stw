<template lang="pug">

  el-input.barcode-input(
    v-model="input"
    :placeholder="$t('scanBarcode')"
    ref="wrapper"
    @blur="onBlur"
  )

</template>
<script>

import debounce from 'lodash/debounce';

export default {
  name: 'BarcodeInput',
  props: {
    lock: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { input: '' };
  },
  i18n: {
    messages: {
      en: {
        scanBarcode: 'Scan barcode',
      },
      ru: {
        scanBarcode: 'Сканируйте штрих-код',
      },
      lt: {
        scanBarcode: 'Nuskaitykite brūkšninį kodą',
      },
    },
  },
  methods: {
    onBlur() {
      if (this.lock) {
        this.focus();
      }
    },
    focus() {
      this.$nextTick(() => {
        if (!this.$refs.wrapper) {
          return;
        }
        const { input } = this.$refs.wrapper.$refs;
        if (input) {
          input.focus();
        }
      });
    },
    onScan(code) {
      if (!code) {
        return;
      }
      this.$emit('scan', code);
      this.input = '';
    },
  },
  mounted() {
    this.focus();
  },
  created() {
    this.$watch('input', debounce(input => this.onScan(input), 500));
  },
};

</script>
<style scoped lang="scss">

@import "~@bit/sistemium.vue.style.variables";

</style>
