import { createWebHashHistory, createRouter } from 'vue-router'
import Home from '../layout/home.vue'
import About from '../layout/about.vue'

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
