import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

const { VITE_LS_PREFIX = 'stv' } = import.meta.env;

export const useInvStore = defineStore({
  id: 'inv',
  state: () => ({
    currentStorageId: useStorage(`${VITE_LS_PREFIX}.currentStorageId`, ''),
    scannedBarcode: '',
  }),
});
