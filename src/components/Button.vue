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
		<span v-if="loading" class="loading-spinner mr-2" aria-hidden="true"></span>
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
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	cursor: pointer;
}

/* Sizes */
.button-sm {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
}

.button-md {
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
}

.button-lg {
	padding: 1rem 2rem;
	font-size: 1.125rem;
}

/* Variants */
.button-primary {
	background: rgba(99, 102, 241, 0.2);
	color: rgba(165, 180, 252, 1);
	border: 1px solid rgba(99, 102, 241, 0.4);
	box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.button-primary:hover:not(:disabled) {
	background: rgba(99, 102, 241, 0.3);
	box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
	transform: translateY(-2px);
}

.button-primary::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
	transition: 0.5s;
}

.button-primary:hover::before:not(:disabled) {
	left: 100%;
}

.button-outline {
	background: transparent;
	color: rgba(165, 180, 252, 1);
	border: 1px solid rgba(99, 102, 241, 0.4);
}

.button-outline:hover:not(:disabled) {
	border-color: rgba(99, 102, 241, 0.8);
	box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
	transform: translateY(-2px);
}

.button-text {
	background: transparent;
	color: rgba(165, 180, 252, 1);
	border: none;
	box-shadow: none;
	padding-left: 0;
	padding-right: 0;
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

/* States */
.button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.loading-spinner {
	display: inline-block;
	width: 1rem;
	height: 1rem;
	border: 2px solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
	animation: spin 0.75s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
