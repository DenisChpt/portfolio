<script setup lang="ts">
defineProps<{
	variant?: 'primary' | 'outline' | 'text' | 'icon'
	size?: 'sm' | 'md' | 'lg'
	to?: string | object
	href?: string
	disabled?: boolean
	loading?: boolean
	icon?: boolean
	external?: boolean
}>()

const emit = defineEmits<{
	click: [event: MouseEvent]
}>()
</script>

<template>
	<component
		:is="to ? 'router-link' : href ? 'a' : 'button'"
		:to="to"
		:href="href"
		:target="external ? '_blank' : undefined"
		:rel="external ? 'noopener noreferrer' : undefined"
		:disabled="disabled || loading"
		:class="[
			'button',
			`button-${variant || 'primary'}`,
			`button-${size || 'md'}`,
			{ 'pointer-events-none': disabled || loading, 'button-icon': icon },
		]"
		@click="emit('click', $event)"
	>
		<span v-if="loading" class="animate-spin inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full mr-2" aria-hidden="true"></span>
		<slot></slot>
	</component>
</template>

<style scoped>
.button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: 500;
	border-radius: 0.375rem;
	transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	position: relative;
	overflow: hidden;
	cursor: pointer;
	transform: translateZ(0);
	backface-visibility: hidden;
	letter-spacing: 0.02em;
}

/* Sizes */
.button-sm {
	padding: 0.5rem 1.25rem;
	font-size: 0.875rem;
}

.button-md {
	padding: 0.75rem 1.75rem;
	font-size: 1rem;
}

.button-lg {
	padding: 1rem 2.25rem;
	font-size: 1.125rem;
}

/* Variants */
.button-primary {
	background: rgba(99, 102, 241, 0.2);
	color: rgba(190, 200, 255, 1);
	border: 1px solid rgba(99, 102, 241, 0.4);
	box-shadow: 0 0 15px rgba(99, 102, 241, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.button-primary:hover:not(:disabled) {
	background: rgba(99, 102, 241, 0.3);
	box-shadow: 0 0 25px rgba(99, 102, 241, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.15);
	transform: translateY(-3px) scale(1.02);
}

.button-primary::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
	transition: 0.8s;
}

.button-primary:hover::before:not(:disabled) {
	left: 100%;
}

.button-primary:active:not(:disabled) {
	transform: translateY(-1px) scale(0.99);
	transition: all 0.1s ease;
}

.button-outline {
	background: transparent;
	color: rgba(165, 180, 252, 1);
	border: 1px solid rgba(99, 102, 241, 0.4);
	box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.1);
}

.button-outline:hover:not(:disabled) {
	border-color: rgba(99, 102, 241, 0.8);
	box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
	transform: translateY(-3px);
	background: rgba(99, 102, 241, 0.1);
}

.button-outline:active:not(:disabled) {
	transform: translateY(-1px);
	transition: all 0.1s ease;
}

.button-text {
	background: transparent;
	color: rgba(165, 180, 252, 1);
	border: none;
	box-shadow: none;
	padding-left: 0;
	padding-right: 0;
	position: relative;
}

.button-text::after {
	content: '';
	position: absolute;
	width: 0;
	height: 1px;
	bottom: -2px;
	left: 0;
	background-color: rgba(99, 102, 241, 0.8);
	transition: width 0.3s ease;
}

.button-text:hover::after:not(:disabled) {
	width: 100%;
}

.button-text:hover:not(:disabled) {
	color: rgba(99, 102, 241, 1);
	transform: translateY(-1px);
}

.button-icon {
	width: 2.5rem;
	height: 2.5rem;
	padding: 0;
	border-radius: 9999px;
}

.button-icon:hover:not(:disabled) {
	transform: scale(1.1);
}

/* States */
.button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

</style>
