<template lang="pug">

el-input.barcode-input(
  v-model="input"
  :placeholder="t('scanBarcode')"
  ref="wrapperRef"
  @blur="onBlur"
)
  //template(#default:prepend)
    el-button(@click="toggleScanner")
     svg
      use(xlink:href="/img/icons8-barcode.svg#iconRoot")
  //template(#default:append)

</template>
<script setup lang="ts">

import { nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import debounce from 'lodash/debounce';
import { useInvStore } from '@/store/invStore.js';

const wrapperRef = ref(null);

const props = withDefaults(defineProps<{
  lock: boolean;
}>(), { lock: true });

const input = ref('');

const { t } = useI18n({
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
});

const emit = defineEmits<{
  (e: 'scan', code: string): void
}>();

const store = useInvStore();

watch(input, debounce(input => onScan(input), 500));

onMounted(() => {
  focus();
})

function onBlur() {
  if (props.lock) {
    focus();
  }
}

function focus() {
  nextTick(() => {
    if (!wrapperRef.value) {
      return;
    }
    const { input } = wrapperRef.value.$refs;
    if (input) {
      input.focus();
    }
  });
}

function onScan(code) {
  if (!code) {
    return;
  }
  emit('scan', code);
  store.scannedBarcode = { code, symbology: null };
  input.value = '';
}

</script>
<style scoped lang="scss">

@import "@bit/sistemium.vue.style.variables";

svg {
  //display: inline-block;
  width: 25px;
  height: 25px;
  filter: brightness(0.5);
}

</style>
