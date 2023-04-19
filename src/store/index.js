import { createStore } from 'vuex'
import auth from 'sistemium-vue/store/auth';
import inv from './inv';

export default new createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    inv,
  },
});
