<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { gsap } from 'gsap'

const { t } = useI18n()

onMounted(() => {
  gsap.from('.about-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top center+=100',
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<template>
  <div class="section bg-gray-50 dark:bg-gray-900">
    <div class="container">
      <div class="about-content max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
          {{ t('about.title') }}
        </h1>
        <div class="card">
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ t('about.description') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>