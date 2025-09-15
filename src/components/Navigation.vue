<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LanguageSelector from './LanguageSelector.vue'

const { t } = useI18n()
const route = useRoute()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const currentSection = computed(() => route.name as string)

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
	isMenuOpen.value = false
}

const reloadPage = (event: Event) => {
	event.preventDefault()
	window.location.reload()
}

const handleScroll = () => {
	// Use a smaller threshold for faster transition
	isScrolled.value = window.scrollY > 20
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll)
	handleScroll()
})

watch(
	() => route.path,
	() => {
		closeMenu()
	}
)
</script>

<template>
	<nav
		class="fixed w-full z-50 transition-all duration-700 ease-out border-b"
		:class="[
			isScrolled
				? 'py-2 bg-gray-900/80 backdrop-blur-xl shadow-2xl border-indigo-500/10'
				: 'py-4 bg-gradient-to-b from-gray-900/50 to-transparent backdrop-blur-sm border-transparent',
		]"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-14">
				<div class="flex items-center">
					<div class="flex-shrink-0 flex items-center">
						<a href="/" @click="reloadPage" class="group text-xl font-bold relative">
							<span
								class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500"
							>
								Portfolio
							</span>
						</a>
					</div>
					<div class="hidden sm:ml-10 sm:flex sm:space-x-8">
						<router-link
							v-for="r in ['home', 'about', 'projects', 'research', 'contact']"
							:key="r"
							:to="{ name: r }"
							class="nav-link group relative inline-flex items-center px-4 py-2 text-xl font-medium transition-all duration-300"
							:class="{
								'text-indigo-300': currentSection === r,
								'text-gray-300 hover:text-indigo-300': currentSection !== r,
							}"
						>
							<span class="relative z-10">{{ t(`nav.${r}`) }}</span>
							<div
								v-if="currentSection === r"
								class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur-sm"
							></div>
							<div
								v-if="currentSection === r"
								class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg"
							></div>
						</router-link>
					</div>
				</div>

				<!-- LanguageSelector only, no theme button -->
				<div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
					<LanguageSelector />
				</div>

				<div class="flex items-center sm:hidden">
					<button
						@click="toggleMenu"
						class="inline-flex items-center justify-center p-3 min-w-[48px] min-h-[48px] rounded-md text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 active:bg-indigo-500/20 transition-all duration-200"
						:aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
						:aria-expanded="isMenuOpen"
					>
						<span class="sr-only">{{ isMenuOpen ? 'Close menu' : 'Open menu' }}</span>
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

		<div
			v-show="isMenuOpen"
			class="sm:hidden absolute w-full transform transition-all duration-300 ease-out"
			:class="
				isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
			"
		>
			<div
				class="pt-4 pb-4 space-y-2 border-t border-indigo-500/20 bg-gray-900/95 backdrop-blur-xl shadow-2xl"
			>
				<router-link
					v-for="r in ['home', 'about', 'projects', 'research', 'contact']"
					:key="r"
					:to="{ name: r }"
					class="mobile-nav-link block pl-4 pr-4 py-4 min-h-[56px] text-lg font-medium transition-all duration-300 flex items-center"
					:class="{
						'text-indigo-400 bg-indigo-900/30 border-l-4 border-indigo-500': currentSection === r,
						'text-gray-300 hover:bg-indigo-900/20 hover:text-indigo-400 active:bg-indigo-900/30 border-l-4 border-transparent':
							currentSection !== r,
					}"
					@click="closeMenu"
				>
					{{ t(`nav.${r}`) }}
				</router-link>

				<div class="flex justify-end items-center px-4 py-4 border-t border-gray-800">
					<LanguageSelector />
				</div>
			</div>
		</div>
	</nav>
</template>

<style scoped>
/* Smooth transition for the nav bar */
nav {
	will-change: transform, background-color, backdrop-filter;
	transform: translateZ(0);
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
}

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
		rgba(var(--color-primary), 0),
		rgba(var(--color-primary), 1),
		rgba(var(--color-primary), 0)
	);
	transform: scaleX(0);
	transform-origin: center;
	transition: transform var(--transition-medium) var(--transition-ease);
}

.nav-link:hover::after {
	transform: scaleX(1);
}

.mobile-nav-link {
	position: relative;
	transition: all var(--transition-medium) var(--transition-ease);
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
		rgba(var(--color-primary), 0),
		rgba(var(--color-primary), 1),
		rgba(var(--color-primary), 0)
	);
	transform: scaleY(0);
	transition: transform var(--transition-medium) var(--transition-ease);
}

.mobile-nav-link:hover::before {
	transform: scaleY(1);
}

</style>
