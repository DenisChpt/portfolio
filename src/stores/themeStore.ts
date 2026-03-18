import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
	const isDark = useStorage('portfolio-theme', true)
	const themeLoaded = ref(false)

	const toggleDark = () => {
		isDark.value = !isDark.value
	}

	const setDark = (value: boolean) => {
		isDark.value = value
	}

	watch(
		isDark,
		(newValue) => {
			document.documentElement.classList.toggle('dark-theme', newValue)
			document.documentElement.classList.toggle('light-theme', !newValue)
			themeLoaded.value = true
		},
		{ immediate: true }
	)

	return { isDark, themeLoaded, toggleDark, setDark }
})
