<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let backgroundAnimation: number | null = null

/**
 * Optimized background animation with particle system
 */
function initBackgroundAnimation() {
	if (!canvasRef.value) return

	const canvas = canvasRef.value
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	/**
	 * Adjust canvas size with device pixel ratio to prevent pixelation
	 */
	function resizeCanvas() {
		const dpr = window.devicePixelRatio || 1
		canvas.width = window.innerWidth * dpr
		canvas.height = window.innerHeight * dpr
		canvas.style.width = `${window.innerWidth}px`
		canvas.style.height = `${window.innerHeight}px`
		ctx!.scale(dpr, dpr)
	}

	/**
	 * Listen for window resize events
	 */
	window.addEventListener('resize', resizeCanvas)
	resizeCanvas()

	/**
	 * Animation configuration parameters
	 */
	const gridSize = 40
	const gridLineWidth = 0.3
	const dotsCount = 70
	const dotMinRadius = 1
	const dotMaxRadius = 3
	const maxSpeed = 0.4

	/**
	 * Light dot particle class
	 */
	class Dot {
		x: number
		y: number
		radius: number
		vx: number
		vy: number
		initialAlpha: number
		alpha: number

		constructor() {
			this.x = Math.random() * canvas.width
			this.y = Math.random() * canvas.height
			this.radius = Math.random() * (dotMaxRadius - dotMinRadius) + dotMinRadius
			this.vx = (Math.random() * 2 - 1) * maxSpeed
			this.vy = (Math.random() * 2 - 1) * maxSpeed
			this.initialAlpha = Math.random() * 0.5 + 0.2
			this.alpha = this.initialAlpha
		}

		update() {
			/**
			 * Update particle position with boundary checking
			 */
			this.x += this.vx
			this.y += this.vy

			// Bounce off edges
			if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx
			if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy

			/**
			 * Apply subtle pulsation effect to opacity
			 */
			this.alpha = this.initialAlpha * (0.8 + Math.sin(Date.now() * 0.002) * 0.2)
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.beginPath()
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
			ctx.fillStyle = `rgba(180, 180, 210, ${this.alpha})`
			ctx.fill()
		}
	}

	/**
	 * Create connections between nearby particles
	 */
	function drawConnections(dots: Dot[], ctx: CanvasRenderingContext2D) {
		const connectionDistance = 150

		for (let i = 0; i < dots.length; i++) {
			for (let j = i + 1; j < dots.length; j++) {
				const dx = dots[i].x - dots[j].x
				const dy = dots[i].y - dots[j].y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < connectionDistance) {
					const opacity = (1 - distance / connectionDistance) * 0.15
					ctx.beginPath()
					ctx.moveTo(dots[i].x, dots[i].y)
					ctx.lineTo(dots[j].x, dots[j].y)
					ctx.strokeStyle = `rgba(140, 140, 180, ${opacity})`
					ctx.lineWidth = 0.5
					ctx.stroke()
				}
			}
		}
	}

	// Draw the grid
	function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
		ctx.strokeStyle = 'rgba(50, 50, 70, 0.15)'
		ctx.lineWidth = gridLineWidth

		// Horizontal lines
		for (let y = 0; y < height; y += gridSize) {
			ctx.beginPath()
			ctx.moveTo(0, y)
			ctx.lineTo(width, y)
			ctx.stroke()
		}

		// Vertical lines
		for (let x = 0; x < width; x += gridSize) {
			ctx.beginPath()
			ctx.moveTo(x, 0)
			ctx.lineTo(x, height)
			ctx.stroke()
		}
	}

	/**
	 * Initialize particle system
	 */
	const dots: Dot[] = []
	for (let i = 0; i < dotsCount; i++) {
		dots.push(new Dot())
	}

	// Animation
	function animate() {
		ctx!.clearRect(0, 0, canvas.width, canvas.height)
		ctx!.fillStyle = '#090A0F';
		ctx!.fillRect(0, 0, canvas.width, canvas.height)

		// Draw the grid
		drawGrid(ctx!, canvas.width, canvas.height)

		/**
		 * Update and render all particles
		 */
		dots.forEach((dot) => {
			dot.update()
			dot.draw(ctx!)
		})

		// Draw connections
		drawConnections(dots, ctx!)

		// Continue animation
		backgroundAnimation = requestAnimationFrame(animate)
	}

	animate()
}

onMounted(() => {
	if (canvasRef.value) {
		initBackgroundAnimation()
	}
})

onBeforeUnmount(() => {
	// Clean up running animations
	if (backgroundAnimation !== null) {
		cancelAnimationFrame(backgroundAnimation)
	}

	/**
	 * Clean up event listeners on unmount
	 */
	window.removeEventListener('resize', () => {});
})
</script>

<template>
	<!-- Use special container for background -->
	<div class="animated-background-container">
		<canvas ref="canvasRef" class="animated-background-canvas"></canvas>
	</div>
</template>

<style>
/* Styles globaux pour s'assurer que le fond est visible partout */
html, body {
	margin: 0;
	padding: 0;
	/**
	 * Explicitly remove any background that could interfere
	 */
	background: transparent !important;
}

/* Assurer que la structure principale a un fond transparent */
#app {
	background-color: transparent !important;
}
</style>

<style scoped>
.animated-background-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: -9999;
	pointer-events: none;
	overflow: hidden; /* Prevent any overflow */
}

.animated-background-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
