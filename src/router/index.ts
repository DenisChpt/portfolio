import { createRouter, createWebHistory } from 'vue-router'

// Scroll to top is deferred until the old page has faded out, otherwise it visibly jumps
let pendingScroll: (() => void) | null = null

/** Called by the page transition once the previous page has left */
export function flushPendingScroll() {
  pendingScroll?.()
  pendingScroll = null
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
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
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      // Unknown or removed pages (e.g. old /research links) fall back to home
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Only the query changed (e.g. opening a project modal): keep the scroll position
    if (to.path === from.path) return false
    // 'instant' bypasses the global `scroll-behavior: smooth` so the new page starts at the top
    return new Promise((resolve) => {
      const scrollTop = () => resolve({ top: 0, behavior: 'instant' })
      pendingScroll = scrollTop
      // Fallback in case no leave transition runs
      setTimeout(scrollTop, 400)
    })
  }
})

export default router
