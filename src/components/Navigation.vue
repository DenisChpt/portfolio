<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import LanguageSelector from './LanguageSelector.vue'

defineProps<{
	isDark: boolean
}>()

defineEmits<{
	'toggle-theme': []
}>()

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)

const currentSection = computed(() => route.name as string)
</script>

<template>
	<nav
		class="bg-gray-900/40 backdrop-blur-md shadow-lg fixed w-full z-50 border-b border-indigo-500/20"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex">
					<div class="flex-shrink-0 flex items-center">
						<router-link to="/" class="text-xl font-bold text-indigo-400">
							Portfolio
							<span class="blink">_</span>
						</router-link>
					</div>
					<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
						<router-link
							v-for="route in ['home', 'about', 'projects', 'contact']"
							:key="route"
							:to="{ name: route }"
							class="nav-link inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
							:class="{
								'text-indigo-400 border-indigo-500': currentSection === route,
								'text-gray-100 border-transparent hover:text-indigo-400 hover:border-indigo-400/50':
									currentSection !== route,
							}"
						>
							{{ t(`nav.${route}`) }}
						</router-link>
					</div>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
					<button
						@click="$emit('toggle-theme')"
						class="p-2 rounded-md text-gray-400 hover:text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10"
					>
						<span v-if="isDark">🌞</span>
						<span v-else>🌙</span>
					</button>

					<LanguageSelector />
				</div>
				<div class="flex items-center sm:hidden">
					<button
						@click="isMenuOpen = !isMenuOpen"
						class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
					>
						<span class="sr-only">Open main menu</span>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
			<div class="pt-2 pb-3 space-y-1 border-t border-indigo-500/20">
				<router-link
					v-for="route in ['home', 'about', 'projects', 'contact']"
					:key="route"
					:to="{ name: route }"
					class="mobile-nav-link block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
					:class="{
						'text-indigo-400 bg-indigo-900/20 border-l-2 border-indigo-500':
							currentSection === route,
						'text-gray-300 hover:bg-indigo-900/10 hover:text-indigo-400 border-l-2 border-transparent':
							currentSection !== route,
					}"
					@click="isMenuOpen = false"
				>
					{{ t(`nav.${route}`) }}
				</router-link>

				<div class="flex justify-between items-center px-4 py-2">
					<button
						@click="$emit('toggle-theme')"
						class="p-2 rounded-md text-gray-400 hover:text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10"
					>
						<span v-if="isDark">🌞</span>
						<span v-else>🌙</span>
					</button>

					<LanguageSelector />
				</div>
			</div>
		</div>
	</nav>
</template>

<style scoped>
.nav-link {
	position: relative;
}

.nav-link::after {
	content: '';
	position: absolute;
	bottom: -2px;
	left: 0;
	width: 100%;
	height: 2px;
	background: linear-gradient(
		to right,
		rgba(99, 102, 241, 0),
		rgba(99, 102, 241, 1),
		rgba(99, 102, 241, 0)
	);
	transform: scaleX(0);
	transform-origin: center;
	transition: transform 0.3s ease;
}

.nav-link:hover::after {
	transform: scaleX(1);
}

.mobile-nav-link {
	position: relative;
	transition: all 0.3s ease;
}

.mobile-nav-link::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 2px;
	background: linear-gradient(
		to bottom,
		rgba(99, 102, 241, 0),
		rgba(99, 102, 241, 1),
		rgba(99, 102, 241, 0)
	);
	transform: scaleY(0);
	transition: transform 0.3s ease;
}

.mobile-nav-link:hover::before {
	transform: scaleY(1);
}

@keyframes blink {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
}

.blink {
	animation: blink 1s step-end infinite;
}
</style>
