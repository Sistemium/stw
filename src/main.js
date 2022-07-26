import Vue from 'vue';
import { Loading } from 'element-ui';
import { authorizeAxios } from '@/init/HybridDataModel';
import { initData } from '@/services/dataSync';
import './init/element-ui';
import './init/sistemium';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n, { saveLocale } from './i18n';
import './index.scss';

Vue.config.productionTip = false;

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
      const { 'access-token': token } = route ? route.query : {};
      const loading = Loading.service({});
      store.dispatch('auth/AUTH_INIT', token)
        .then(async () => {
          if (!token) {
            return;
          }
          await this.updateRouteParams({}, { 'access-token': undefined });
        })
        .catch(e => {
          this.$error('auth', e);
          loading.close();
        });
    });
  },
}).$mount('#app');

const unsubscribe = store.subscribe(mutation => {
  // eslint-disable-next-line no-console
  console.log(mutation.type);
  if (mutation.type === 'auth/SET_AUTHORIZED') {
    unsubscribe();
    authorizeAxios(mutation.payload.token);
    const loading = Loading.service({});
    initData()
      .catch(e => this.$error(e))
      .finally(() => {
        loading.close();
      });
  }
}, { prepend: true });
