<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import { STORAGE_KEYS } from './constants/app.constants'
import { flushPendingScroll } from './router'

// The intro screen is only shown once per browser session: reloads and returning visits go straight in
const hasSeenIntro = (() => {
	try {
		return sessionStorage.getItem(STORAGE_KEYS.INTRO_SEEN) === '1'
	} catch {
		return false
	}
})()

// Loaded on demand so returning visitors don't download it
const Loader = defineAsyncComponent(() => import('./components/Loader.vue'))

const isLoading = ref(!hasSeenIntro)

const handleLoadingComplete = () => {
	isLoading.value = false
	try {
		sessionStorage.setItem(STORAGE_KEYS.INTRO_SEEN, '1')
	} catch { /* sessionStorage unavailable */ }
}
</script>

<template>
	<AnimatedBackground />

	<Loader v-if="isLoading" @loading-complete="handleLoadingComplete" />

	<div v-if="!isLoading" class="min-h-screen flex flex-col">
		<Navigation />

		<main class="flex-grow">
			<router-view v-slot="{ Component }">
				<transition name="page" mode="out-in" @after-leave="flushPendingScroll">
					<component :is="Component" />
				</transition>
			</router-view>
		</main>

		<Footer />
	</div>
</template>
