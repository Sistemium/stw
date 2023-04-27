import log from 'sistemium-debug';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { createApp } from 'vue';
import { ElLoading } from 'element-plus';
import { authorizeAxios } from '@/init/HybridDataModel';
import { authGuard, initData } from '@/services/dataSync';
import init from './init';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.scss';
import i18n from './i18n';
import { createPinia } from 'pinia';
// import i18n, { saveLocale } from './i18n';

const { debug, error } = log('main');

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

const app = createApp(App)
  .use(router)
  .use(i18n)
  .use(store)
  .use(createPinia());

init(app);
app.mount('#app');

// TODO: watch '$i18n.locale': saveLocale

router.isReady().then(() => {
  debug('router:ready');
  const loading = ElLoading.service({});
  store.dispatch('auth/AUTH_INIT')
    .then(authorized => {
      if (authorized) {
        return store.dispatch('inv/SUBSCRIBE_SOCKET_STATUS');
      }
      return loading.close();
    })
    .catch(e => {
      error('auth', e);
      loading.close();
    });
});

const unsubscribe = store.subscribe(mutation => {
  const { type, payload } = mutation;
  debug(type, payload);
  if (type === 'auth/SET_AUTHORIZED') {
    const { token, account: { name: username } = {} } = payload;
    authorizeAxios(token);
    Sentry.setUser({ username });
    debug(username);
    store.dispatch('inv/SUBSCRIBE_SOCKET_STATUS')
      .catch(error);
  } else if (type === 'inv/SET_SOCKET_IS_READY' && payload) {
    unsubscribe();
    const loading = ElLoading.service({});
    initData()
      .catch(e => error(e))
      .finally(() => {
        loading.close();
      });
  }
}, { prepend: true });
