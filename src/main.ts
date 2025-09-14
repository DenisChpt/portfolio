/**
 * Portfolio Application Entry Point
 * 
 * Initializes Vue 3 application with:
 * - Pinia state management
 * - Vue Router for navigation
 * - i18n for internationalization
 * - Global styles and configurations
 * 
 * @author Denis Chaput
 * @license MIT
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')