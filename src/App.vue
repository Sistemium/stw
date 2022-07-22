<template lang="pug">

#app
  app-menu
    template(v-slot:left)
      barcode-scanner-status(v-if="showBarcodeStatus")
  barcode-input(v-if="showBarcodeInput" :lock="false")
  router-view

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import find from 'lodash/find';
import AppMenu from '@/components/AppMenu.vue';
import BarcodeScannerStatus, {
  isNative,
} from '@/components/BarcodeScanner/BarcodeScannerStatus.vue';
import BarcodeInput from '@/components/BarcodeScanner/BarcodeInput.vue';
import * as g from '@/store/inv/getters';

const { mapGetters } = createNamespacedHelpers('inv');

export default {
  components: {
    BarcodeInput,
    BarcodeScannerStatus,
    AppMenu,
  },
  computed: {
    ...mapGetters({
      isConnected: g.SCANNER_IS_CONNECTED,
    }),
    showBarcodeStatus() {
      const { matched } = this.$router.currentRoute;
      return this.$route.meta.useScanner
        || !!find(matched, ({ meta }) => meta && meta.useScanner);
    },
    showBarcodeInput() {
      return this.showBarcodeStatus && !isNative() && this.isConnected;
    },
  },
};

</script>
<style lang="scss">

@import "styles/variables";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $black;
  max-width: 1024px;
  margin: auto;
}

.barcode-input {
  margin-bottom: $margin-top;
}

</style>
