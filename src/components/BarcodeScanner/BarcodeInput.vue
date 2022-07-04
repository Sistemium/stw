<template lang="pug">

el-input.barcode-input(
  v-model="input"
  :placeholder="$t('scanBarcode')"
  ref="wrapper"
  @blur="onBlur"
)
  //template(v-slot:prepend)
    el-button(@click="toggleScanner")
     svg
      use(xlink:href="/img/icons8-barcode.svg#iconRoot")
  //template(v-slot:append)

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import debounce from 'lodash/debounce';
import * as m from '@/store/inv/mutations';

const { mapMutations } = createNamespacedHelpers('inv');

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
    ...mapMutations({
      setScannedBarcode: m.SET_SCANNED_BARCODE,
    }),
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
      this.setScannedBarcode({ code, symbology: null });
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

svg {
  //display: inline-block;
  width: 25px;
  height: 25px;
  filter: brightness(0.5);
}

</style>
