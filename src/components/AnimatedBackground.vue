<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let backgroundAnimation: number | null = null
let resizeHandler: (() => void) | null = null

/**
 * Optimized background animation with particle system
 */
function initBackgroundAnimation() {
	if (!canvasRef.value) return

	const canvas = canvasRef.value
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	let canvasW = 0
	let canvasH = 0

	/**
	 * Adjust canvas size with device pixel ratio to prevent pixelation
	 */
	function resizeCanvas() {
		const dpr = window.devicePixelRatio || 1
		canvasW = window.innerWidth
		canvasH = window.innerHeight
		canvas.width = canvasW * dpr
		canvas.height = canvasH * dpr
		canvas.style.width = `${canvasW}px`
		canvas.style.height = `${canvasH}px`
		// Reset transform before scaling to avoid accumulation on resize
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
	}

	// Throttled resize handler
	let resizeTimeout: ReturnType<typeof setTimeout> | null = null
	resizeHandler = () => {
		if (resizeTimeout) return
		resizeTimeout = setTimeout(() => {
			resizeTimeout = null
			resizeCanvas()
		}, 200)
	}

	window.addEventListener('resize', resizeHandler, { passive: true })
	resizeCanvas()

	/**
	 * Animation configuration parameters
	 */
	const gridSize = 40
	const gridLineWidth = 0.3
	const dotsCount = 50
	const dotMinRadius = 1
	const dotMaxRadius = 3
	const maxSpeed = 0.4
	const connectionDistSq = 150 * 150
	const connectionDist = 150

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
		phaseOffset: number

		constructor() {
			this.x = Math.random() * canvasW
			this.y = Math.random() * canvasH
			this.radius = Math.random() * (dotMaxRadius - dotMinRadius) + dotMinRadius
			this.vx = (Math.random() * 2 - 1) * maxSpeed
			this.vy = (Math.random() * 2 - 1) * maxSpeed
			this.initialAlpha = Math.random() * 0.5 + 0.2
			this.alpha = this.initialAlpha
			this.phaseOffset = Math.random() * Math.PI * 2
		}

		update(time: number) {
			this.x += this.vx
			this.y += this.vy

			if (this.x < 0 || this.x > canvasW) this.vx = -this.vx
			if (this.y < 0 || this.y > canvasH) this.vy = -this.vy

			this.alpha = this.initialAlpha * (0.8 + Math.sin(time * 0.002 + this.phaseOffset) * 0.2)
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.beginPath()
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
			ctx.fillStyle = `rgba(180, 180, 210, ${this.alpha})`
			ctx.fill()
		}
	}

	/**
	 * Draw connections using spatial grid to avoid O(n²)
	 */
	function drawConnections(dots: Dot[], ctx: CanvasRenderingContext2D) {
		const cellSize = connectionDist
		const cols = Math.ceil(canvasW / cellSize) + 1
		const grid: Map<number, number[]> = new Map()

		// Place dots into grid cells
		for (let i = 0; i < dots.length; i++) {
			const cx = (dots[i].x / cellSize) | 0
			const cy = (dots[i].y / cellSize) | 0
			const key = cy * cols + cx
			const cell = grid.get(key)
			if (cell) {
				cell.push(i)
			} else {
				grid.set(key, [i])
			}
		}

		ctx.lineWidth = 0.5

		// Check only neighboring cells
		grid.forEach((indices, key) => {
			const cy = (key / cols) | 0
			const cx = key - cy * cols
			// Check current cell and 3 forward neighbors to avoid duplicates
			const neighborKeys = [
				key,
				cy * cols + (cx + 1),
				(cy + 1) * cols + (cx - 1),
				(cy + 1) * cols + cx,
			]

			for (const nKey of neighborKeys) {
				const nIndices = nKey === key ? indices : grid.get(nKey)
				if (!nIndices) continue

				for (const i of indices) {
					const startJ = nKey === key ? indices.indexOf(i) + 1 : 0
					for (let jIdx = startJ; jIdx < nIndices.length; jIdx++) {
						const j = nIndices[jIdx]
						const dx = dots[i].x - dots[j].x
						const dy = dots[i].y - dots[j].y
						const distSq = dx * dx + dy * dy

						if (distSq < connectionDistSq) {
							const dist = Math.sqrt(distSq)
							const opacity = (1 - dist / connectionDist) * 0.15
							ctx.beginPath()
							ctx.moveTo(dots[i].x, dots[i].y)
							ctx.lineTo(dots[j].x, dots[j].y)
							ctx.strokeStyle = `rgba(140, 140, 180, ${opacity})`
							ctx.stroke()
						}
					}
				}
			}
		})
	}

	// Draw the grid using a single path for efficiency
	function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
		ctx.strokeStyle = 'rgba(50, 50, 70, 0.15)'
		ctx.lineWidth = gridLineWidth
		ctx.beginPath()

		for (let y = 0; y < height; y += gridSize) {
			ctx.moveTo(0, y)
			ctx.lineTo(width, y)
		}

		for (let x = 0; x < width; x += gridSize) {
			ctx.moveTo(x, 0)
			ctx.lineTo(x, height)
		}

		ctx.stroke()
	}

	/**
	 * Initialize particle system
	 */
	const dots: Dot[] = []
	for (let i = 0; i < dotsCount; i++) {
		dots.push(new Dot())
	}

	// Animation
	function animate(time: number) {
		ctx!.clearRect(0, 0, canvasW, canvasH)
		ctx!.fillStyle = '#090A0F';
		ctx!.fillRect(0, 0, canvasW, canvasH)

		drawGrid(ctx!, canvasW, canvasH)

		for (let i = 0; i < dots.length; i++) {
			dots[i].update(time)
			dots[i].draw(ctx!)
		}

		drawConnections(dots, ctx!)

		backgroundAnimation = requestAnimationFrame(animate)
	}

	backgroundAnimation = requestAnimationFrame(animate)
}

onMounted(() => {
	if (canvasRef.value) {
		initBackgroundAnimation()
	}
})

onBeforeUnmount(() => {
	if (backgroundAnimation !== null) {
		cancelAnimationFrame(backgroundAnimation)
	}

	if (resizeHandler) {
		window.removeEventListener('resize', resizeHandler)
	}
})
</script>

<template>
	<div class="animated-background-container">
		<canvas ref="canvasRef" class="animated-background-canvas"></canvas>
	</div>
</template>

<style>
html, body {
	margin: 0;
	padding: 0;
	background: transparent !important;
}

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
	overflow: hidden;
}

.animated-background-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
