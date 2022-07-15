import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/HomePage.vue';
import articlePropsRoute from '@/router/articlePropsRoute';
import articlesRoute from '@/router/articlesRoute';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import(/* webpackChunkName: "inventory" */ '../views/InventoryPage.vue'),
    meta: {
      useScanner: true,
    },
  },
  {
    path: '/stockTaking',
    name: 'stockTaking',
    component: () => import(/* webpackChunkName: "inventory" */ '../views/StockTakingPage.vue'),
    meta: {
      useScanner: true,
    },
  },
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
