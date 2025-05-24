<template lang="pug">

v-layout#app
  app-menu
    template(#left)
      barcode-scanner-status(v-if="showBarcodeStatus")
  v-main.my-5
    barcode-input(
      v-if="showBarcodeInput"
      :lock="false"
    )
    router-view

</template>
<script setup lang="ts">

import find from 'lodash/find';
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AppMenu from '@/components/AppMenu.vue';
import BarcodeScannerStatus, {
  isNative,
} from '@/components/BarcodeScanner/BarcodeScannerStatus.vue';
import BarcodeInput from '@/components/BarcodeScanner/BarcodeInput.vue';
import * as g from '@/store/inv/getters.js';
import i18n, { saveLocale } from '@/services/i18n';
import { useInvStore } from '@/store/invStore'
import { bindEvents } from '@/services/socket'

const store = useStore()
const route = useRoute()
const invStore = useInvStore()
const isConnected = computed(() => store.getters[`inv/${g.SCANNER_IS_CONNECTED}`]);
const showBarcodeStatus = computed(() => {
  return route.meta.useScanner
    || !!find(route.matched, ({ meta }) => meta && meta.useScanner);
});
const showBarcodeInput = computed(() => {
  return showBarcodeStatus.value && !isNative() && isConnected.value;
});

bindEvents()

watch(i18n.global.locale, saveLocale);
watch(showBarcodeInput, () => {
  invStore.resetUUID()
})

</script>
<style lang="scss">

@import "styles/variables";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $black;
  max-width: 1200px;
  margin: auto;
}

.barcode-input {
  margin-bottom: $margin-top;
}

.v-main {
  overflow-y: auto;
  max-height: var(--viewport-height);
}

@media (min-width: 1050px) {
  .v-container {
    max-width: 1050px;
  }
}

@media (min-width: 1200px) {
  .v-container {
    max-width: 1200px;
  }
}

@media (min-width: 1400px) {
  .v-container {
    max-width: 1350px;
  }
}
@media (min-width: 1600px) {
  .v-container {
    max-width: 1550px;
  }
}

</style>
