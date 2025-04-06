<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { gsap } from 'gsap'

const { t } = useI18n()

onMounted(() => {
  gsap.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.4,
    ease: 'power3.out'
  })
})
</script>

<template>
  <div class="section bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <div class="container">
      <div class="text-center">
        <h1 class="hero-title text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('home.title') }}
        </h1>
        <p class="hero-subtitle text-2xl md:text-3xl text-gray-600 dark:text-gray-300">
          {{ t('home.subtitle') }}
        </p>
        <div class="mt-12 space-x-4">
          <router-link 
            to="/projects" 
            class="btn btn-primary inline-flex items-center"
          >
            View Projects
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>