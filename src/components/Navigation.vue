<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

defineProps<{
  isDark: boolean
  currentLocale: string
}>()

defineEmits<{
  'toggle-theme': []
  'toggle-locale': []
}>()

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)

const currentSection = computed(() => route.name as string)
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600 dark:text-primary-400">
              Portfolio
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="route in ['home', 'about', 'projects', 'contact']"
              :key="route"
              :to="{ name: route }"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="{
                'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500': currentSection === route,
                'text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400': currentSection !== route
              }"
            >
              {{ t(`nav.${route}`) }}
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <button
            @click="$emit('toggle-theme')"
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <span v-if="isDark">🌞</span>
            <span v-else>🌙</span>
          </button>
          <button
            @click="$emit('toggle-locale')"
            class="ml-3 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {{ currentLocale.toUpperCase() }}
          </button>
        </div>
        <div class="flex items-center sm:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-show="isMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="route in ['home', 'about', 'projects', 'contact']"
          :key="route"
          :to="{ name: route }"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
          :class="{
            'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': currentSection === route,
            'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700': currentSection !== route
          }"
          @click="isMenuOpen = false"
        >
          {{ t(`nav.${route}`) }}
        </router-link>
      </div>
    </div>
  </nav>
</template>