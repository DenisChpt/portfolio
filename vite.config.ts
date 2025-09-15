import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		// Bundle all CSS into a single file
		cssCodeSplit: false,
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
		// Increase chunk size warning limit
		chunkSizeWarningLimit: 1500,
		rollupOptions: {
			output: {
				// Consistent file naming
				assetFileNames: 'assets/[name]-[hash].[ext]',
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
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
