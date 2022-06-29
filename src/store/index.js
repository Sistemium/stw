import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@bit/sistemium.vue.vuex.auth';
import inv from './inv';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    inv,
  },
});
