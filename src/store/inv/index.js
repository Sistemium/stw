import { getLocalStorageItem } from 'sistemium-vue/services/localStorage';
import mutations from './mutations';
import getters, * as states from './getters';
import actions from './actions';

export default {

  namespaced: true,

  state: {
    [states.CURRENT_STORAGE]: getLocalStorageItem(states.CURRENT_STORAGE),
    [states.ARTICLE_FILTERS]: [],
    [states.SCANNED_BARCODE]: null,
    [states.SCANNER_STATUS]: null,
  },
  mutations,
  getters,
  actions,

};
