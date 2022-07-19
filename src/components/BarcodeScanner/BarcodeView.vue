<template lang="pug">

el-alert.barcode-view(
  v-if="scannedBarCode"
  :title="$t('fields.barcode')"
  type="success"
  :description="scannedBarCode.code"
  @close="clearBarcode()"
  :close-text="$t('clear')"
)

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'BarcodeView',
  computed: {
    ...mapGetters({
      scannedBarCode: g.SCANNED_BARCODE,
    }),
  },
  methods: {
    ...mapMutations({
      clearBarcode: m.SET_SCANNED_BARCODE,
    }),
  },
  watch: {
    scannedBarCode(barCode) {
      this.$emit('input', barCode);
      if (barCode) {
        this.$emit('scan', barCode);
      } else {
        this.$emit('clear');
      }
    },
  },
};

</script>
<style scoped lang="scss">

</style>
