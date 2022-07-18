import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/HomePage.vue';
import articlePropsRoute from '@/router/articlePropsRoute';
import articlesRoute from '@/router/articlesRoute';
import stockTakingsRoute from '@/router/stockTakingsRoute';
import storagesRoute from '@/router/storagesRoute';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  // {
  //   path: '/inventory',
  //   name: 'inventory',
  //   component: () => import(/* webpackChunkName: "inventory" */ '../views/InventoryPage.vue'),
  //   meta: {
  //     useScanner: true,
  //   },
  // },
  storagesRoute,
  stockTakingsRoute,
  articlesRoute,
  articlePropsRoute,
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutPage.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
