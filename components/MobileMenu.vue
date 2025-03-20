<template>
	<div id="mobile-menu" class="w-full z-10 lg:hidden">
		<div id="mobile-header" class="w-full h-16 flex justify-between items-center">
			<NuxtLink
				class="text-menu-text font-fira_retina flex h-full items-center mx-5"
				to="/"
				@click="goHome()"
			>
				{{ t('logo_name') }}
			</NuxtLink>
			<img
				src="/icons/burger.svg"
				alt="Open menu"
				v-if="!menuOpen"
				@click="toggleMobileMenu()"
				class="w-5 h-5 mx-5 my-auto"
			/>
			<img
				src="/icons/burger-close.svg"
				alt="Closed menu"
				v-else
				@click="toggleMobileMenu()"
				class="w-5 h-5 mx-5 my-auto"
			/>
		</div>

		<div id="menu" class="bg-mobile-menu-blue z-10 hidden">
			<NuxtLink
				id="nav-link-mobile"
				to="/"
				:class="{ active: isActive('/') }"
				@click="toggleMobileMenu()"
			>
				{{ t('hello') }}
			</NuxtLink>

			<NuxtLink
				id="nav-link-mobile"
				to="/about-me"
				:class="{ active: isActive('/about-me') }"
				@click="toggleMobileMenu()"
			>
				{{ t('about_me') }}
			</NuxtLink>

			<NuxtLink
				id="nav-link-mobile"
				to="/projects"
				:class="{ active: isActive('/projects') }"
				@click="toggleMobileMenu()"
			>
				{{ t('projects') }}
			</NuxtLink>

			<NuxtLink
				id="nav-link-mobile"
				to="/contact-me"
				:class="{ active: isActive('/contact-me') }"
				@click="toggleMobileMenu()"
			>
				{{ t('contact_me') }}
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuOpen = ref(false)

const toggleMobileMenu = () => {
	menuOpen.value = !menuOpen.value
	const menu = document.getElementById('menu')
	menu.classList.toggle('hidden')
	const page = document.getElementsByTagName('main')[0]
	page.style.display = page.style.display === 'none' ? 'flex' : 'none'
}

const goHome = () => {
	const menu = document.getElementById('menu')
	if (!menu.classList.contains('hidden')) {
		menu.classList.toggle('hidden')
		document.getElementsByTagName('main')[0].style.display = 'flex'
		menuOpen.value = !menuOpen.value
	}
}

const isActive = (route) => {
	return route === route.path
}
</script>

<style>
#mobile-header {
	border-bottom: 1px solid #1e2d3d;
}

#nav-link-mobile {
	border-bottom: 1px solid #1e2d3d;
	@apply text-menu-text font-fira_retina px-6 py-4 flex items-center;
}

#nav-link-mobile.active {
	color: white;
}
</style>
