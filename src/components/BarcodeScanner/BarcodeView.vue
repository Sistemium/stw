<template lang="pug">

el-alert.barcode-view(
  v-if="scannedBarCode"
  :close-text="$t('clear')"
  :description="scannedBarCode.code"
  :title="$t('fields.barcode')"
  type="success"
  @close="clearBarcode()"
)

</template>
<script setup lang="ts">

import { useBarcodeScanner } from '@/components/BarcodeScanner/BarcodeScanner';
import type { BarcodeScannerEvents } from '@/components/BarcodeScanner/BarcodeScanner';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Events extends BarcodeScannerEvents {}

const emit = defineEmits<Events>();

const { scannedBarCode, clearBarcode } = useBarcodeScanner(emit);

</script>
<style scoped lang="scss">
.barcode-view {
  text-align: left;
}
</style>
