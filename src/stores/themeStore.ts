import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

/**
 * Store for theme management
 */
export const useThemeStore = defineStore('theme', () => {
	// State
	const isDark = useStorage('portfolio-theme', true)
	const themeLoaded = ref(false)

	// Actions
	const toggleDark = () => {
		isDark.value = !isDark.value
	}

	const setDark = (value: boolean) => {
		isDark.value = value
	}

	// Apply theme classes when the theme changes
	watch(
		isDark,
		(newValue) => {
			if (newValue) {
				document.documentElement.classList.add('dark-theme')
				document.documentElement.classList.remove('light-theme')
			} else {
				document.documentElement.classList.add('light-theme')
				document.documentElement.classList.remove('dark-theme')
			}

			// Set the loaded flag to true after the first theme application
			themeLoaded.value = true
		},
		{ immediate: true }
	)

	return {
		isDark,
		themeLoaded,
		toggleDark,
		setDark,
	}
})
