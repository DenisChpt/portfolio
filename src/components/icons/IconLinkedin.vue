<script setup lang="ts">
import IconBase from './IconBase.vue'

defineProps<{
	size?: string | number
	color?: string
}>()
</script>

<template>
	<IconBase name="linkedin" :size="size" :color="color" viewBox="0 0 24 24">
		<path
			d="M19 0H5C2.24 0 0 2.24 0 5V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19V5C24 2.24 21.76 0 19 0ZM8 19H5V8H8V19ZM6.5 6.73C5.53 6.73 4.75 5.94 4.75 4.97C4.75 4 5.53 3.21 6.5 3.21C7.47 3.21 8.25 4 8.25 4.97C8.25 5.94 7.47 6.73 6.5 6.73ZM20 19H17V13.4C17 10.04 13 10.28 13 13.4V19H10V8H13V9.77C14.47 7.33 20 7.16 20 12.18V19Z"
		/>
	</IconBase>
</template>
