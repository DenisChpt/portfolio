<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  // Handle form submission
}

onMounted(() => {
  gsap.from('.contact-form', {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top center+=100',
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<template>
  <div class="section bg-gray-50 dark:bg-gray-900">
    <div class="container">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-12">
          {{ t('contact.title') }}
        </h1>
        <form @submit="handleSubmit" class="contact-form card">
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="name">
              {{ t('contact.name') }}
            </label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              class="input"
              required
            >
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="email">
              {{ t('contact.email') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="input"
              required
            >
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="message">
              {{ t('contact.message') }}
            </label>
            <textarea
              v-model="form.message"
              id="message"
              class="input"
              rows="4"
              required
            ></textarea>
          </div>
          <div class="flex justify-center">
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ t('contact.send') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>