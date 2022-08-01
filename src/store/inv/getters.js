export const ARTICLE_FILTERS = 'ARTICLE_FILTERS';
export const SCANNED_BARCODE = 'SCANNED_BARCODE';
export const SCANNER_STATUS = 'SCANNER_STATUS';
export const SCANNER_IS_CONNECTED = 'SCANNER_IS_CONNECTED';
export const CURRENT_STORAGE = 'CURRENT_STORAGE';

export default {
  [CURRENT_STORAGE](state) {
    return state[CURRENT_STORAGE];
  },
  [ARTICLE_FILTERS](state) {
    return state[ARTICLE_FILTERS];
  },
  [SCANNED_BARCODE](state) {
    return state[SCANNED_BARCODE];
  },
  [SCANNER_STATUS](state) {
    return state[SCANNER_STATUS];
  },
  [SCANNER_IS_CONNECTED](state, getters) {
    return getters[SCANNER_STATUS] === 'connected';
  },
};
