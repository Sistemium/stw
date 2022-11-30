// import { barCodeScannerOn } from '@/services/scanning';
import { isNative, setSyncerInfoCallback } from 'sistemium-data/src/util/native';
import * as m from './mutations';
import * as g from './getters';

export const SUBSCRIBE_SOCKET_STATUS = 'SUBSCRIBE_SOCKET_STATUS';
export const SCAN_BARCODE = 'SCAN_BARCODE';
// export const TURN_SCANNER_ON = 'TURN_SCANNER_ON';

export default {
  [SCAN_BARCODE]({ commit }) {
    commit(m.SET_SCANNED_BARCODE);
  },
  [SUBSCRIBE_SOCKET_STATUS]({ commit, getters }) {
    if (getters[g.SOCKET_IS_READY]) {
      return;
    }
    if (isNative()) {
      setSyncerInfoCallback(info => {
        // console.info('syncerInfo', info);
        const [{ isReady }] = info || [{}];
        commit(m.SET_SOCKET_IS_READY, isReady);
      });
    } else {
      commit(m.SET_SOCKET_IS_READY, true);
    }
  },
  // [TURN_SCANNER_ON]() {
  //   barCodeScannerOn();
  // },
};
