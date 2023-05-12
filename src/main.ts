import log from 'sistemium-debug';
import { createApp } from 'vue';
import { ElLoading } from 'element-plus';
import { createPinia } from 'pinia';
import * as Sentry from '@sentry/vue';
import { authorizeAxios } from '@/init/HybridDataModel';
import { authGuard, initData } from '@/services/dataSync';
import init from './init';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.scss';
import i18n from './i18n';

const { debug, error } = log('main');

router.beforeEach(authGuard);

const { PROD: prodEnv, VITE_SENTRY_DSN: dsn } = import.meta.env;
const environment = prodEnv ? 'production' : 'development';

const app = createApp(App);

Sentry.init({
  app,
  dsn,
  environment,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ['localhost', 'stw.sistemium.com', /^\//],
    }),
  ],
  tracesSampleRate: prodEnv ? 0.1 : 1,
});

app.use(router)
  .use(i18n)
  .use(store)
  .use(createPinia());

init(app);

app.mount('#app');

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
    const { token, account: { name: username = 'unknown' } = {} } = payload;
    authorizeAxios(token);
    debug('environment:', environment, 'user:', username);
    Sentry.setUser({ username });
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
