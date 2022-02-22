import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { layout: "public" },
      component: () => import('../views/Login.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue')
    },
    {
      path: '/play',
      name: 'play',
      meta: { layout: "game" },
      component: () => import('../views/Play.vue'),
      props: route => ({ hash: route.query.hash }),
    }
  ]
})