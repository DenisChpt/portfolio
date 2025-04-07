<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const languages = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

const changeLanguage = (langCode: string) => {
	locale.value = langCode
	isOpen.value = false
}

const getCurrentLanguage = () => {
	return languages.find((lang) => lang.code === locale.value) || languages[0]
}

// Fermer le menu si on clique ailleurs
const closeMenu = (e: MouseEvent) => {
	if (isOpen.value) {
		isOpen.value = false
	}
}

// Ajouter un événement click global quand le menu est ouvert
watch(isOpen, (newVal) => {
	if (newVal) {
		setTimeout(() => {
			window.addEventListener('click', closeMenu)
		}, 0)
	} else {
		window.removeEventListener('click', closeMenu)
	}
})
</script>

<template>
	<div class="relative">
		<button
			@click.stop="isOpen = !isOpen"
			class="lang-selector flex items-center space-x-2 p-2 rounded-md text-gray-300 hover:text-indigo-400 transition-all duration-200 border border-transparent hover:border-indigo-500/20 hover:bg-indigo-500/10"
		>
			<span class="text-xl">{{ getCurrentLanguage().flag }}</span>
			<span class="hidden sm:inline-block">{{ getCurrentLanguage().name }}</span>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<div
			v-if="isOpen"
			class="lang-dropdown absolute right-0 mt-2 w-48 backdrop-blur-md rounded-md overflow-hidden z-20 border border-indigo-500/20"
		>
			<div class="py-1">
				<button
					v-for="lang in languages"
					:key="lang.code"
					@click.stop="changeLanguage(lang.code)"
					class="lang-option w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
					:class="{ 'bg-indigo-500/10 text-indigo-400': locale === lang.code }"
				>
					<span class="text-xl">{{ lang.flag }}</span>
					<span>{{ lang.name }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.lang-selector {
	position: relative;
	overflow: hidden;
}

.lang-selector::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%) scaleX(0);
	width: 80%;
	height: 1px;
	background: linear-gradient(
		90deg,
		rgba(99, 102, 241, 0) 0%,
		rgba(99, 102, 241, 0.6) 50%,
		rgba(99, 102, 241, 0) 100%
	);
	transition: transform 0.3s ease;
}

.lang-selector:hover::after {
	transform: translateX(-50%) scaleX(1);
}

.lang-dropdown {
	background: rgba(30, 41, 59, 0.8);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1);
	animation: fadeIn 0.2s ease-out;
}

.lang-option {
	position: relative;
}

.lang-option::after {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 2px;
	height: 100%;
	background: linear-gradient(
		180deg,
		rgba(99, 102, 241, 0) 0%,
		rgba(99, 102, 241, 0.6) 50%,
		rgba(99, 102, 241, 0) 100%
	);
	transform: scaleY(0);
	transition: transform 0.2s ease;
}

.lang-option:hover::after {
	transform: scaleY(1);
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
