<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import Loader from './components/Loader.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { locale } = useI18n()
const isLoading = ref(true)

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'fr' : 'en'
}

const handleLoadingComplete = () => {
  isLoading.value = false
}
</script>

<template>
  <Loader v-if="isLoading" @loading-complete="handleLoadingComplete" />
  
  <div v-else :class="{ 'dark': isDark }" class="min-h-screen flex flex-col">
    <Navigation 
      @toggle-theme="toggleDark()"
      @toggle-locale="toggleLocale()"
      :is-dark="isDark"
      :current-locale="locale"
    />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: theme('colors.gray.200');
}

.dark ::-webkit-scrollbar-track {
  background: theme('colors.gray.800');
}

::-webkit-scrollbar-thumb {
  background: theme('colors.primary.500');
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: theme('colors.primary.600');
}

/* Global hover effects */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Global animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>