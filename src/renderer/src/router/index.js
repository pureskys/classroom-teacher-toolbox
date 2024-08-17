import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@renderer/pages/home/home.vue'
import About from '@renderer/pages/about/about.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
