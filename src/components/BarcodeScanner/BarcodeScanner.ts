import { computed, watch } from 'vue';
import { useInvStore } from '@/store/invStore';
import type { BarcodeScan } from '@/store/invStore';


export interface BarcodeScannerEvents {
  (e: 'update:modelValue', scanData: BarcodeScan): void;
  (e: 'scan', scanData: BarcodeScan): void;
  (e: 'clear'): void;
}

export function useBarcodeScanner(emit: BarcodeScannerEvents) {

  const store = useInvStore();
  const scannedBarCode = computed(() => store.scannedBarcode);


  watch(scannedBarCode, (barCode: BarcodeScan) => {
    emit('update:modelValue', barCode);
    if (barCode) {
      emit('scan', barCode);
    } else {
      emit('clear');
    }
  });

  if (scannedBarCode.value) {
    emit('update:modelValue', scannedBarCode.value);
  }

  return {
    scannedBarCode,
    clearBarcode: store.clearBarcode,
  };

}
