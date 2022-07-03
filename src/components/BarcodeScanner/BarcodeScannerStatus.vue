<template lang="pug">

.barcode-scanner-status
  el-button(type="text" @click="toggleScanner" :class="scannerStatus")
    svg
      use(:xlink:href="statusSrc")

</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import * as nativeScanner from '@/lib/nativeScanner';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export const { isNative } = nativeScanner;

export default {
  name: 'BarcodeScannerStatus',
  computed: {
    ...mapGetters({
      scannerStatus: g.SCANNER_STATUS,
      scannedBarcode: g.SCANNED_BARCODE,
      isConnected: g.SCANNER_IS_CONNECTED,
    }),
    statusSrc() {
      const icon = this.isConnected ? 'barcode' : 'no-barcode';
      return `/img/icons8-${icon}.svg#iconRoot`;
    },
  },
  methods: {
    ...mapMutations({
      setScannerStatus: m.SET_SCANNER_STATUS,
      setScannedBarcode: m.SET_SCANNED_BARCODE,
    }),
    toggleScanner() {
      if (nativeScanner.isNative()) {
        this.toggleScannerNative();
      } else {
        this.setScannerStatus(this.isConnected ? 'disconnected' : 'connected');
      }
    },
    toggleScannerNative() {
      if (this.scannerStatus === 'connected') {
        nativeScanner.barCodeScannerOff();
        return;
      }
      nativeScanner.barCodeScannerOn(code => {
        this.setScannedBarcode(code);
      }, status => {
        this.setScannerStatus(status);
      });
    },
  },
};

</script>
<style scoped lang="scss">
@import "~sistemium-vue/styles/variables";

svg {
  width: 25px;
  height: 25px;
  filter: $filter-primary;
}

.el-button.connected {
  svg {
    filter: $filter-green;
  }
}

</style>
