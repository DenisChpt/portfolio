<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import Loader from './components/Loader.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { locale } = useI18n()
const isLoading = ref(true)

const handleLoadingComplete = () => {
	isLoading.value = false
}
</script>

<template>
	<Loader v-if="isLoading" @loading-complete="handleLoadingComplete" />

	<div v-else :class="{ dark: isDark }" class="min-h-screen flex flex-col">
		<!-- Fond animé identique au loader -->
		<AnimatedBackground />

		<Navigation @toggle-theme="toggleDark()" :is-dark="isDark" />

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
/* Supprimer tous les styles de fond qui pourraient interférer */
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
	background: #1e293b;
}

::-webkit-scrollbar-thumb {
	background: rgba(99, 102, 241, 0.5);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(99, 102, 241, 0.7);
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
	/* IMPORTANT: Supprimer tous les styles de fond ici */
	background: transparent !important;
	color: white;
}

/* Assurer que tous les conteneurs principaux sont transparents */
#app,
.min-h-screen,
main,
.flex-grow {
	background: transparent !important;
}

/* Boutons futuristes globaux */
.btn-futuristic {
	background: rgba(99, 102, 241, 0.2);
	color: rgba(165, 180, 252, 1);
	padding: 0.75rem 1.5rem;
	border-radius: 0.375rem;
	font-weight: 500;
	border: 1px solid rgba(99, 102, 241, 0.4);
	position: relative;
	overflow: hidden;
	transition: all 0.3s;
	box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.btn-futuristic::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
	transition: 0.5s;
}

.btn-futuristic:hover {
	background: rgba(99, 102, 241, 0.3);
	box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
	transform: translateY(-2px);
}

.btn-futuristic:hover::before {
	left: 100%;
}

.btn-outline-futuristic {
	background: transparent;
	color: rgba(165, 180, 252, 1);
	padding: 0.75rem 1.5rem;
	border-radius: 0.375rem;
	font-weight: 500;
	border: 1px solid rgba(99, 102, 241, 0.4);
	transition: all 0.3s;
}

.btn-outline-futuristic:hover {
	border-color: rgba(99, 102, 241, 0.8);
	box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
	transform: translateY(-2px);
}
</style>
