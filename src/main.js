import log from 'sistemium-debug';
import Vue from 'vue';
import { Loading } from 'element-ui';
import { authorizeAxios } from '@/init/HybridDataModel';
import { authGuard, initData } from '@/services/dataSync';
import './init';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n, { saveLocale } from './i18n';
import './index.scss';

const { debug } = log('main');
Vue.config.productionTip = false;
router.beforeEach(authGuard);

new Vue({
  router,
  store,
  i18n,
  watch: {
    '$i18n.locale': saveLocale,
  },
  render: h => h(App),
  created() {
    router.onReady(route => {
      this.$debug('router:ready', route);
      const loading = Loading.service({});
      store.dispatch('auth/AUTH_INIT')
        .then(() => store.dispatch('inv/SUBSCRIBE_SOCKET_STATUS'))
        .catch(e => {
          this.$error('auth', e);
        })
        .finally(() => {
          loading.close();
        });
    });
  },
}).$mount('#app');

const unsubscribe = store.subscribe(mutation => {
  debug(mutation.type, mutation.payload);
  if (mutation.type === 'auth/SET_AUTHORIZED') {
    authorizeAxios(mutation.payload.token);
  } else if (mutation.type === 'inv/SET_SOCKET_IS_READY' && mutation.payload) {
    unsubscribe();
    const loading = Loading.service({});
    initData()
      .catch(e => this.$error(e))
      .finally(() => {
        loading.close();
      });
  }
}, { prepend: true });
