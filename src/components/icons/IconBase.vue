<script setup lang="ts">
defineProps<{
	name?: string
	size?: string | number
	viewBox?: string
	color?: string
	title?: string
}>()
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:width="size || 24"
		:height="size || 24"
		:viewBox="viewBox || '0 0 24 24'"
		:aria-labelledby="name ? `icon-${name}` : undefined"
		role="img"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		:style="color ? { color } : undefined"
	>
		<title v-if="name || title" :id="name ? `icon-${name}` : undefined">{{ title || name }}</title>
		<slot />
	</svg>
</template>

<style scoped>
svg {
	display: inline-block;
	vertical-align: middle;
}
</style>
