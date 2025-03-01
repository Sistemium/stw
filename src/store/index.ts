// @ts-ignore
import { createStore } from 'vuex'
// @ts-ignore
import auth from 'sistemium-vue/store/auth';
import inv from './inv';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    inv,
  },
});
