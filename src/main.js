import log from 'sistemium-debug';
import Vue from 'vue';
import { Loading } from 'element-ui';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { authorizeAxios } from '@/init/HybridDataModel';
import { authGuard, initData } from '@/services/dataSync';
import './init';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.scss';
import i18n, { saveLocale } from './i18n';

const { debug, error } = log('main');
Vue.config.productionTip = false;
router.beforeEach(authGuard);

const { NODE_ENV: environment, VUE_APP_SENTRY_DSN: dsn } = process.env;

Sentry.init({
  Vue,
  dsn,
  environment,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ['localhost', 'stw.sistemium.com', /^\//],
    }),
  ],
  tracesSampleRate: environment === 'production' ? 0.1 : 1,
});

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
        .then(authorized => {
          if (authorized) {
            return store.dispatch('inv/SUBSCRIBE_SOCKET_STATUS');
          }
          return loading.close();
        })
        .catch(e => {
          this.$error('auth', e);
          loading.close();
        });
    });
  },
}).$mount('#app');

const unsubscribe = store.subscribe(mutation => {
  const { type, payload } = mutation;
  debug(type, payload);
  if (type === 'auth/SET_AUTHORIZED') {
    const { token, account: { name: username } = {} } = payload;
    authorizeAxios(token);
    Sentry.setUser({ username });
    store.dispatch('inv/SUBSCRIBE_SOCKET_STATUS')
      .catch(error);
  } else if (type === 'inv/SET_SOCKET_IS_READY' && payload) {
    unsubscribe();
    const loading = Loading.service({});
    initData()
      .catch(e => error(e))
      .finally(() => {
        loading.close();
      });
  }
}, { prepend: true });
