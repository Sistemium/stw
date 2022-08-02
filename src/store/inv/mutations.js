import { setLocalStorageItem } from 'sistemium-vue/services/localStorage';
import * as g from './getters';

export const SET_ARTICLE_FILTERS = 'SET_ARTICLE_FILTERS';
export const SET_SCANNED_BARCODE = 'SET_SCANNED_BARCODE';
export const SET_SCANNER_STATUS = 'SET_SCANNER_STATUS';
export const SET_CURRENT_STORAGE = 'SET_CURRENT_STORAGE';

export default {
  [SET_CURRENT_STORAGE](state, storageId) {
    setLocalStorageItem(g.CURRENT_STORAGE, storageId);
    state[g.CURRENT_STORAGE] = storageId || null;
  },
  [SET_ARTICLE_FILTERS](state, filters) {
    state[g.ARTICLE_FILTERS] = filters || [];
  },
  [SET_SCANNER_STATUS](state, status) {
    state[g.SCANNER_STATUS] = status;
  },
  [SET_SCANNED_BARCODE](state, code) {
    state[g.SCANNED_BARCODE] = code || null;
  },
};
