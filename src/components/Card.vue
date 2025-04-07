<script setup lang="ts">
defineProps<{
	title?: string
	variant?: 'default' | 'panel' | 'window'
	hover?: boolean
	fullHeight?: boolean
}>()
</script>

<template>
	<div
		class="card"
		:class="[
			`card-${variant || 'default'}`,
			{ 'card-hover': hover, 'h-[calc(100vh-10rem)]': fullHeight },
		]"
	>
		<!-- Window style header with decorative elements -->
		<div
			v-if="variant === 'window'"
			class="window-header flex items-center p-4 border-b border-white/10"
		>
			<div class="flex space-x-2">
				<div class="w-3 h-3 rounded-full bg-red-500"></div>
				<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
				<div class="w-3 h-3 rounded-full bg-green-500"></div>
			</div>
			<div class="flex-1 text-center text-sm text-gray-400 font-mono">
				{{ title || 'window' }}
			</div>
			<div class="w-6"></div>
		</div>

		<!-- Panel style header -->
		<div v-else-if="variant === 'panel' && title" class="panel-header">
			<h2 class="text-lg font-medium text-center text-white">{{ title }}</h2>
		</div>

		<!-- Default header -->
		<div v-else-if="title" class="p-4 border-b border-white/10">
			<h2 class="text-xl font-semibold text-white">{{ title }}</h2>
		</div>

		<!-- Content area -->
		<div
			:class="[
				variant === 'window' ? 'window-content p-6' : variant === 'panel' ? 'panel-content' : 'p-6',
			]"
		>
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>
/* Base card styles */
.card {
	width: 100%;
	background: rgba(16, 24, 39, 0.3);
	border: 1px solid rgba(99, 102, 241, 0.15);
	border-radius: 0.75rem;
	backdrop-filter: blur(8px);
	box-shadow: 0 0 20px rgba(79, 70, 229, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1) inset;
	overflow: hidden;
	transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	transform: translateZ(0);
}

/* Hover effects */
.card-hover:hover {
	transform: translateY(-5px);
	box-shadow: 0 15px 30px rgba(79, 70, 229, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.2) inset;
	border-color: rgba(99, 102, 241, 0.3);
}

/* Window variant */
.card-window {
	background: rgba(255, 255, 255, 0.02);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.window-content {
	min-height: 100px;
}

/* Panel variant */
.card-panel {
	position: relative;
}

.card-panel::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 1px;
	background: linear-gradient(
		90deg,
		rgba(99, 102, 241, 0) 0%,
		rgba(99, 102, 241, 0.5) 50%,
		rgba(99, 102, 241, 0) 100%
	);
	z-index: 1;
}

.card-panel::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 1px;
	background: linear-gradient(
		90deg,
		rgba(99, 102, 241, 0) 0%,
		rgba(99, 102, 241, 0.3) 50%,
		rgba(99, 102, 241, 0) 100%
	);
	z-index: 1;
}

.panel-header {
	padding: 1rem;
	border-bottom: 1px solid rgba(99, 102, 241, 0.15);
	position: relative;
	z-index: 1;
}

.panel-header::after {
	content: '';
	position: absolute;
	bottom: -1px;
	left: 10%;
	right: 10%;
	height: 1px;
	background: linear-gradient(
		90deg,
		rgba(99, 102, 241, 0) 0%,
		rgba(99, 102, 241, 0.5) 50%,
		rgba(99, 102, 241, 0) 100%
	);
}

.panel-content {
	padding: 1.5rem 2rem; /* Increased padding for better spacing */
}

/* Responsive adjustments */
@media (min-width: 768px) {
	.card {
		max-width: 90%;
		margin: 0 auto;
	}
}

@media (min-width: 1024px) {
	.card {
		max-width: 1100px; /* Increased max-width for better desktop experience */
	}
}

@media (max-width: 640px) {
	.panel-content {
		padding: 1.25rem 1rem; /* Reduced padding on mobile */
	}
}
</style>
