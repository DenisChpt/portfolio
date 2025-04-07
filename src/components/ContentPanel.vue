<script setup lang="ts">
defineProps<{
	title?: string
	fullHeight?: boolean
}>()
</script>

<template>
	<div
		class="content-panel backdrop-blur-md overflow-hidden transition-all duration-300"
		:class="{ 'h-[calc(100vh-10rem)]': fullHeight }"
	>
		<div class="panel-header" v-if="title">
			<h2 class="text-lg font-medium text-center text-white">{{ title }}</h2>
		</div>

		<div class="panel-content">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>
.content-panel {
	width: 100%;
	/* Fond plus transparent pour laisser voir l'arrière-plan animé */
	background: rgba(16, 24, 39, 0.3);
	border: 1px solid rgba(99, 102, 241, 0.15);
	border-radius: 0.75rem;
	box-shadow: 0 0 20px rgba(79, 70, 229, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1) inset;
	position: relative;
	overflow: hidden;
}

.content-panel::before {
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

.content-panel::after {
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
	padding: 1.5rem;
}

@media (min-width: 768px) {
	.content-panel {
		max-width: 90%;
	}
}

@media (min-width: 1024px) {
	.content-panel {
		max-width: 1024px;
	}
}
</style>
