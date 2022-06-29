import * as g from './getters';

export const SET_ARTICLE_FILTERS = 'SET_ARTICLE_FILTERS';

export default {
  [SET_ARTICLE_FILTERS](state, filters) {
    state[g.ARTICLE_FILTERS] = filters;
  },
};
