import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/HomePage.vue';
// import stockTakingsRoute from '@/router/stockTakingsRoute';
// import stockWithdrawalsRoute from '@/router/stockWithdrawalsRoute';

import routeMap from '@/router/routeMap';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  // stockTakingsRoute,
  // stockWithdrawalsRoute,
  ...routeMap.routes(),
];

const router = new VueRouter({
  routes,
});

export default router;
