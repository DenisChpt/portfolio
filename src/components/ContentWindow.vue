<script setup lang="ts">
defineProps<{
	title?: string
	fullHeight?: boolean
}>()
</script>

<template>
	<div
		class="content-window bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden transition-all duration-300"
		:class="{ 'h-[calc(100vh-10rem)]': fullHeight }"
	>
		<div class="window-header flex items-center p-4 border-b border-white/10">
			<div class="flex space-x-2">
				<div class="w-3 h-3 rounded-full bg-red-500"></div>
				<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
				<div class="w-3 h-3 rounded-full bg-green-500"></div>
			</div>
			<div class="flex-1 text-center text-sm text-gray-400 font-mono">
				{{ title || 'window' }}
			</div>
			<div class="w-6"></div>
			<!-- Espacement égal de l'autre côté -->
		</div>

		<div class="window-content p-6">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>
.content-window {
	width: 100%;
	/* Fond déjà très transparent (bg-white/5) */
	/* Si le fond est encore trop opaque, augmenter la transparence ainsi: */
	background: rgba(255, 255, 255, 0.02) !important;
}

@media (min-width: 768px) {
	.content-window {
		max-width: 90%;
	}
}

@media (min-width: 1024px) {
	.content-window {
		max-width: 1024px;
	}
}
</style>
