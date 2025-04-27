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
	<!-- AnimatedBackground reste visible en permanence -->
	<AnimatedBackground />

	<!-- Loader par-dessus l'AnimatedBackground -->
	<Loader v-if="isLoading" @loading-complete="handleLoadingComplete" />

	<!-- Le contenu principal n'apparaît que lorsque le chargement est terminé -->
	<div v-if="!isLoading" class="min-h-screen flex flex-col">
		<!-- Navigation -->
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

<style>
/* Transitions de page */
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

/* Smooth scrolling */
html {
	scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: rgba(var(--color-background-light), 0.5);
}

::-webkit-scrollbar-thumb {
	background: rgba(var(--color-primary), 0.5);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(var(--color-primary), 0.7);
}

/* Global animations */
.animate-fade-in {
	animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* Mise à jour du style de fond */
body {
	@apply antialiased overflow-x-hidden;
	background: transparent !important;
	color: rgb(var(--color-text));
	font-family: var(--font-sans);
}

/* Assurer que tous les conteneurs principaux sont transparents */
#app,
.min-h-screen,
main,
.flex-grow {
	background: transparent !important;
}
</style>
