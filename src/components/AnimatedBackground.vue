<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { isBackgroundPaused } from '@/composables/useBackgroundAnimation'

const canvasRef = ref<HTMLCanvasElement>()

/**
 * Animation configuration parameters
 */
const DOTS_COUNT = 50
const DOT_MIN_RADIUS = 1
const DOT_MAX_RADIUS = 3
const MAX_SPEED = 0.4
const CONNECTION_DIST = 150
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST
// Connection opacities are quantized so that all lines sharing an opacity are stroked in one call
const OPACITY_BUCKETS = 8
const MAX_LINE_OPACITY = 0.15
// A large backing store is the main cost of clearing the canvas every frame
const MAX_DPR = 1.5
// Frame time the original per-frame speeds were tuned for (60 fps)
const FRAME_MS = 1000 / 60

interface Dot {
	x: number
	y: number
	radius: number
	vx: number
	vy: number
	initialAlpha: number
	phaseOffset: number
}

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let dots: Dot[] = []
let rafId: number | null = null
let lastTime = 0
let resizeTimeout: ReturnType<typeof setTimeout> | null = null
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function createDot(): Dot {
	return {
		x: Math.random() * width,
		y: Math.random() * height,
		radius: Math.random() * (DOT_MAX_RADIUS - DOT_MIN_RADIUS) + DOT_MIN_RADIUS,
		vx: (Math.random() * 2 - 1) * MAX_SPEED,
		vy: (Math.random() * 2 - 1) * MAX_SPEED,
		initialAlpha: Math.random() * 0.5 + 0.2,
		phaseOffset: Math.random() * Math.PI * 2,
	}
}

/**
 * Adjust canvas size with device pixel ratio to prevent pixelation
 */
function resizeCanvas() {
	const canvas = canvasRef.value
	if (!canvas || !ctx) return

	const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
	width = window.innerWidth
	height = window.innerHeight
	canvas.width = Math.round(width * dpr)
	canvas.height = Math.round(height * dpr)
	// Reset transform before scaling to avoid accumulation on resize
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

	// Keep dots inside the new bounds so they don't get stuck bouncing outside
	for (const dot of dots) {
		dot.x = Math.min(dot.x, width)
		dot.y = Math.min(dot.y, height)
	}
}

function update(step: number) {
	for (const dot of dots) {
		dot.x += dot.vx * step
		dot.y += dot.vy * step

		if (dot.x < 0 || dot.x > width) dot.vx = -dot.vx
		if (dot.y < 0 || dot.y > height) dot.vy = -dot.vy
	}
}

function draw(time: number) {
	if (!ctx) return
	ctx.clearRect(0, 0, width, height)

	// Connections: 50 dots means ~1.2k cheap distance checks, no allocations needed
	const buckets: Path2D[] = []
	for (let i = 0; i < dots.length; i++) {
		const a = dots[i]
		for (let j = i + 1; j < dots.length; j++) {
			const b = dots[j]
			const dx = a.x - b.x
			const dy = a.y - b.y
			const distSq = dx * dx + dy * dy
			if (distSq >= CONNECTION_DIST_SQ) continue

			const strength = 1 - Math.sqrt(distSq) / CONNECTION_DIST
			const bucket = Math.min(OPACITY_BUCKETS - 1, (strength * OPACITY_BUCKETS) | 0)
			const path = (buckets[bucket] ??= new Path2D())
			path.moveTo(a.x, a.y)
			path.lineTo(b.x, b.y)
		}
	}

	ctx.lineWidth = 0.5
	ctx.strokeStyle = 'rgb(140, 140, 180)'
	for (let k = 0; k < OPACITY_BUCKETS; k++) {
		const path = buckets[k]
		if (!path) continue
		ctx.globalAlpha = ((k + 0.5) / OPACITY_BUCKETS) * MAX_LINE_OPACITY
		ctx.stroke(path)
	}

	// Dots, with a gentle twinkle
	ctx.fillStyle = 'rgb(180, 180, 210)'
	for (const dot of dots) {
		ctx.globalAlpha = dot.initialAlpha * (0.8 + Math.sin(time * 0.002 + dot.phaseOffset) * 0.2)
		ctx.beginPath()
		ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
		ctx.fill()
	}
	ctx.globalAlpha = 1
}

function frame(time: number) {
	// Scale movement by elapsed time so speed is identical on 60/120/144 Hz screens,
	// and clamp it so dots don't jump after the tab was in the background
	const step = lastTime ? Math.min((time - lastTime) / FRAME_MS, 3) : 1
	lastTime = time

	update(step)
	draw(time)
	rafId = requestAnimationFrame(frame)
}

function start() {
	if (rafId !== null || isBackgroundPaused.value || reducedMotion.matches) return
	lastTime = 0
	rafId = requestAnimationFrame(frame)
}

function stop() {
	if (rafId !== null) {
		cancelAnimationFrame(rafId)
		rafId = null
	}
}

function handleResize() {
	if (resizeTimeout) return
	resizeTimeout = setTimeout(() => {
		resizeTimeout = null
		resizeCanvas()
		// A resize clears the canvas: repaint right away in case the loop is stopped
		draw(performance.now())
	}, 200)
}

function handleMotionPreference() {
	if (reducedMotion.matches) {
		stop()
		draw(performance.now())
	} else {
		start()
	}
}

watch(isBackgroundPaused, (paused) => (paused ? stop() : start()))

onMounted(() => {
	ctx = canvasRef.value?.getContext('2d') ?? null
	if (!ctx) return

	width = window.innerWidth
	height = window.innerHeight
	dots = Array.from({ length: DOTS_COUNT }, createDot)
	resizeCanvas()
	draw(performance.now())

	window.addEventListener('resize', handleResize, { passive: true })
	reducedMotion.addEventListener('change', handleMotionPreference)
	start()
})

onBeforeUnmount(() => {
	stop()
	if (resizeTimeout) clearTimeout(resizeTimeout)
	window.removeEventListener('resize', handleResize)
	reducedMotion.removeEventListener('change', handleMotionPreference)
})
</script>

<template>
	<div class="animated-background-container" aria-hidden="true">
		<canvas ref="canvasRef" class="animated-background-canvas"></canvas>
	</div>
</template>

<style>
html, body {
	margin: 0;
	padding: 0;
	background: transparent !important;
}

/* Same color as the canvas backdrop, so overscroll / full-page areas never flash white */
html {
	background-color: #090a0f !important;
}

#app {
	background-color: transparent !important;
}
</style>

<style scoped>
/*
 * The solid color and the grid never change, so they are painted once by CSS
 * instead of being redrawn on the canvas every frame. The canvas only holds the dots.
 */
.animated-background-container {
	position: fixed;
	inset: 0;
	z-index: -9999;
	pointer-events: none;
	overflow: hidden;
	background-color: #090a0f;
	background-image:
		linear-gradient(rgba(50, 50, 70, 0.045) 1px, transparent 1px),
		linear-gradient(90deg, rgba(50, 50, 70, 0.045) 1px, transparent 1px);
	background-size: 40px 40px;
}

.animated-background-canvas {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}
</style>
