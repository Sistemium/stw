import * as g from './getters';

export const SET_ARTICLE_FILTERS = 'SET_ARTICLE_FILTERS';
export const SET_SCANNED_BARCODE = 'SET_SCANNED_BARCODE';
export const SET_SCANNER_STATUS = 'SET_SCANNER_STATUS';

export default {
  [SET_ARTICLE_FILTERS](state, filters) {
    state[g.ARTICLE_FILTERS] = filters;
  },
  [SET_SCANNER_STATUS](state, status) {
    state[g.SCANNER_STATUS] = status;
  },
};
