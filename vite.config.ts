import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	// Compile-time flags: drop the unused Options API / legacy vue-i18n API and devtools hooks from the bundle
	define: {
		__VUE_OPTIONS_API__: false,
		__VUE_PROD_DEVTOOLS__: false,
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
		__VUE_I18N_FULL_INSTALL__: false,
		__VUE_I18N_LEGACY_API__: false,
		__INTLIFY_PROD_DEVTOOLS__: false,
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		// Enable CSS code splitting for faster initial load
		cssCodeSplit: true,
		// Disable sourcemaps in production for performance
		sourcemap: false,
		// Use terser for minification
		minify: 'terser',
		terserOptions: {
			compress: {
				// Remove console logs in production
				drop_console: true,
				drop_debugger: true,
			},
		},
		chunkSizeWarningLimit: 1500,
		rollupOptions: {
			output: {
				assetFileNames: 'assets/[name]-[hash].[ext]',
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				manualChunks(id) {
					if (id.includes('node_modules/vue/') || id.includes('node_modules/vue-router/') || id.includes('node_modules/pinia/')) {
						return 'vue-vendor'
					}
					if (id.includes('node_modules/gsap/') || id.includes('node_modules/@vueuse/') || id.includes('node_modules/@headlessui/')) {
						return 'ui-vendor'
					}
					if (id.includes('node_modules/vue-i18n/')) {
						return 'i18n'
					}
				},
			},
		},
	},
	css: {
		postcss: './postcss.config.js',
		devSourcemap: true,
	},
	// Pre-bundle dependencies for faster dev startup
	optimizeDeps: {
		include: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
	},
	// Development server config
	server: {
		port: 5173,
		strictPort: false,
		host: 'localhost',
	},
	// Preview server config
	preview: {
		port: 4173,
		strictPort: false,
		host: 'localhost',
	},
})
