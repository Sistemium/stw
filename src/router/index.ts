import * as VueRouter from 'vue-router'
import Home from '@/views/HomePage.vue'
import AuthPage from '@/views/AuthPage.vue'
import routeMap from '@/router/routeMap'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      public: true,
      menuHidden: false,
      menuGroup: undefined,
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
]

export default VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})
