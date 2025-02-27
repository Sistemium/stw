import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { v4 } from 'uuid'

const { VITE_LS_PREFIX = 'stv' } = import.meta.env;

export interface BarcodeScan {
  code: string;
  symbology: string;
}

export const useInvStore = defineStore('inv', {
  state: () => ({
    currentStorageId: useStorage<string>(`${VITE_LS_PREFIX}.CURRENT_STORAGE`, ''),
    currentSiteId: useStorage<string | undefined>(`${VITE_LS_PREFIX}.CURRENT_SITE`, ''),
    scannedBarcode: undefined,
    uuid: v4(),
  }),
  actions: {
    clearBarcode() {
      this.scannedBarcode = undefined;
    },
    resetUUID() {
      this.uuid = v4()
    },
  },
});
