<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const { t } = useI18n()

// Animation des sections
onMounted(() => {
  gsap.from('.home-content', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'expo.out',
    delay: 0.4
  })
})
</script>

<template>
  <div class="section flex items-center justify-center pt-24">
    <div class="home-content max-w-4xl mx-auto p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl shadow-primary-500/10">
      <div class="window-header flex items-center mb-6">
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div class="flex-1 text-center text-sm text-gray-400 font-mono">
          portfolio.home
        </div>
      </div>

      <div class="text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500 mb-6">
          {{ t('home.title') }}
        </h1>

        <p class="text-xl md:text-2xl text-gray-300 mb-10">
          {{ t('home.subtitle') }}
        </p>

        <div class="terminal bg-gray-900 p-4 rounded-lg font-mono text-sm mb-10">
          <div class="mb-2 text-gray-400">
            <span class="text-primary-400">~</span> $ <span class="typing-effect">whoami</span>
          </div>
          <div class="text-green-400 mb-2">
            Denis Chapot • Full Stack Developer
          </div>
          <div class="mb-2 text-gray-400">
            <span class="text-primary-400">~</span> $ <span class="typing-effect">skills --list</span>
          </div>
          <div class="text-green-400 flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-green-900/30 rounded-md">Vue.js</span>
            <span class="px-2 py-1 bg-green-900/30 rounded-md">TypeScript</span>
            <span class="px-2 py-1 bg-green-900/30 rounded-md">Node.js</span>
            <span class="px-2 py-1 bg-green-900/30 rounded-md">TailwindCSS</span>
            <span class="px-2 py-1 bg-green-900/30 rounded-md">GraphQL</span>
            <span class="px-2 py-1 bg-green-900/30 rounded-md">MongoDB</span>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <router-link
            to="/projects"
            class="btn btn-primary inline-flex items-center"
          >
            <span>View Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>

          <router-link
            to="/contact"
            class="btn bg-white/5 text-white border border-white/10 hover:bg-white/10 inline-flex items-center"
          >
            <span>Contact Me</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  min-height: 100vh;
  padding: 0 1rem;
}

.typing-effect {
  position: relative;
}

.typing-effect::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 15px;
  background-color: #48bb78;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>
