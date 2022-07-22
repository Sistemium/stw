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

import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';

export default {
  name: 'BarcodeView',
  mixins: [BarcodeScanner],
};

</script>
<style scoped lang="scss">
.barcode-view {
  text-align: left;
}
</style>
