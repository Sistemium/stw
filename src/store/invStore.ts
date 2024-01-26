import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

const { VITE_LS_PREFIX = 'stv' } = import.meta.env;

export interface BarcodeScan {
  code: string;
  symbology: string;
}

export const useInvStore = defineStore({
  id: 'inv',
  state: () => ({
    currentStorageId: useStorage<string>(`${VITE_LS_PREFIX}.CURRENT_STORAGE`, ''),
    currentSiteId: useStorage<string>(`${VITE_LS_PREFIX}.CURRENT_SITE`, ''),
    scannedBarcode: undefined,
  }),
  actions: {
    clearBarcode() {
      this.scannedBarcode = undefined;
    },
  },
});
