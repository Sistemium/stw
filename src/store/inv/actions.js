// import { barCodeScannerOn } from '@/services/scanning';
import * as m from './mutations';

export const SCAN_BARCODE = 'SCAN_BARCODE';
// export const TURN_SCANNER_ON = 'TURN_SCANNER_ON';

export default {
  [SCAN_BARCODE]({ commit }) {
    commit(m.SET_SCANNED_BARCODE);
  },
  // [TURN_SCANNER_ON]() {
  //   barCodeScannerOn();
  // },
};
