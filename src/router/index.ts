import * as VueRouter from 'vue-router';
import Home from '@/views/HomePage.vue';
import AuthPage from '@/views/AuthPage.vue';

import routeMap from '@/router/routeMap';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      public: true,
    },
  },
  ...routeMap.routes(),
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage,
    meta: {
      public: true,
      menuHidden: true,
    },
  },
];

export default VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
