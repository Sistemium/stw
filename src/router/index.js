import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/HomePage.vue';
import AuthPage from '@/views/AuthPage.vue';

import routeMap from '@/router/routeMap';

Vue.use(VueRouter);

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

const router = new VueRouter({
  routes,
});

export default router;
