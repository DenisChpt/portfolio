<script setup lang="ts">
import { ref } from 'vue'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import Loader from './components/Loader.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'

const isLoading = ref(true)

const handleLoadingComplete = () => {
	isLoading.value = false
}
</script>

<template>
	<AnimatedBackground />

	<Loader v-if="isLoading" @loading-complete="handleLoadingComplete" />

	<div v-if="!isLoading" class="min-h-screen flex flex-col">
		<Navigation />

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
