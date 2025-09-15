import { createRouter, createWebHistory } from 'vue-router'

/**
 * Application router configuration
 * Implements lazy loading for all routes to optimize bundle size and performance
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // Lazy load Home component for consistency
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/Projects.vue')
    },
    {
      path: '/research',
      name: 'research',
      component: () => import('../views/Research.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    }
  ]
})

export default router