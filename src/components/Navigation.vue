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

const handleScroll = () => {
	isScrolled.value = window.scrollY > 50
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
		class="fixed w-full z-50 transition-all duration-300 bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-indigo-500/20"
		:class="[isScrolled ? 'py-1' : 'py-2']"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-14">
				<div class="flex items-center">
					<div class="flex-shrink-0 flex items-center">
						<router-link
							to="/"
							class="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
						>
							Portfolio
							<span class="blink">_</span>
						</router-link>
					</div>
					<div class="hidden sm:ml-10 sm:flex sm:space-x-12">
						<router-link
							v-for="r in ['home', 'about', 'projects', 'contact']"
							:key="r"
							:to="{ name: r }"
							class="nav-link inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium transition-all duration-300"
							:class="{
								'text-indigo-400 border-indigo-500': currentSection === r,
								'text-gray-100 border-transparent hover:text-indigo-400 hover:border-indigo-400/50':
									currentSection !== r,
							}"
						>
							{{ t(`nav.${r}`) }}
						</router-link>
					</div>
				</div>

				<!-- LanguageSelector seul, plus de bouton de thème -->
				<div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
					<LanguageSelector />
				</div>

				<div class="flex items-center sm:hidden">
					<button
						@click="toggleMenu"
						class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
						:aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
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
			class="sm:hidden absolute w-full transform transition-transform duration-300"
			:class="
				isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
			"
		>
			<div
				class="pt-2 pb-3 space-y-1 border-t border-indigo-500/20 bg-gray-900/90 backdrop-blur-lg"
			>
				<router-link
					v-for="r in ['home', 'about', 'projects', 'contact']"
					:key="r"
					:to="{ name: r }"
					class="mobile-nav-link block pl-3 pr-4 py-2 text-base font-medium transition-all duration-300"
					:class="{
						'text-indigo-400 bg-indigo-900/20 border-l-2 border-indigo-500': currentSection === r,
						'text-gray-300 hover:bg-indigo-900/10 hover:text-indigo-400 border-l-2 border-transparent':
							currentSection !== r,
					}"
					@click="closeMenu"
				>
					{{ t(`nav.${r}`) }}
				</router-link>

				<div class="flex justify-end items-center px-4 py-2">
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

.blink {
	animation: blink 1s step-end infinite;
}

@keyframes blink {
	from,
	to {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
}
</style>
