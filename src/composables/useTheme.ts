import { watch } from 'vue'
import { useDark, useToggle, useStorage } from '@vueuse/core'

/**
 * Hook for managing theme with persistent storage
 */
export function useTheme() {
	const isDark = useDark()
	const toggleDark = useToggle(isDark)
	const prefersDark = useStorage('portfolio-theme-preference', isDark.value)

	// Sync prefersDark with isDark
	watch(isDark, (value) => {
		prefersDark.value = value
	})

	// Apply theme-specific classes to document
	watch(
		isDark,
		(dark) => {
			if (dark) {
				document.documentElement.classList.add('dark-theme')
				document.documentElement.classList.remove('light-theme')
			} else {
				document.documentElement.classList.add('light-theme')
				document.documentElement.classList.remove('dark-theme')
			}
		},
		{ immediate: true }
	)

	return {
		isDark,
		toggleDark,
	}
}
