import Vue from 'vue';
import './init/element-ui';
import './init/sistemium';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n, { saveLocale } from './i18n';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  watch: {
    '$i18n.locale': saveLocale,
  },
  render: h => h(App),
}).$mount('#app');
