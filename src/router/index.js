import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/HomePage.vue';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutPage.vue'),
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
    path: '/articleProps',
    name: 'articleProps',
    component: () => import(/* webpackChunkName: "catalogue" */ '../views/ArticlePropsPage.vue'),
    props: {
      editRoute: 'articlePropEdit',
      createRoute: 'articlePropCreate',
    },
    children: [
      {
        path: 'create',
        name: 'articlePropCreate',
        props: {
          from: { name: 'articleProps' },
        },
        component: () => import('../components/ArticlePropertyEdit.vue'),
      },
      {
        path: 'edit/:articlePropId',
        name: 'articlePropEdit',
        props: ({ params: { articlePropId } }) => ({
          articlePropId,
          from: { name: 'articleProps' },
        }),
        component: () => import('../components/ArticlePropertyEdit.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
