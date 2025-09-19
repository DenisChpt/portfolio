<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

const router = useRouter()

// Refs for DOM elements
const loaderContainer = ref<HTMLDivElement>()
const progressContainer = ref<HTMLDivElement>()
const progressCircles = ref<SVGElement>()
const progressCircle = ref<SVGCircleElement>()
const progressOutline = ref<SVGCircleElement>()
const progressTextInner = ref<HTMLDivElement>()

// State
const loading = ref(true)
const progress = ref(0)
const ctaActive = ref(false)
const isHovered = ref(false)

// Animation timeline reference
let mainTimeline: gsap.core.Timeline | null = null
let hoverTimeline: gsap.core.Timeline | null = null
let rotationTween: gsap.core.Tween | null = null

// Circle configuration - simplified and consistent
const CIRCLE_CONFIG = {
	// Normal state
	normal: {
		outerRadius: 150,  // Dotted circle
		innerRadius: 160,  // Solid circle with gaps
		innerOpacity: 0.5,
		outerOpacity: 0.4
	},
	// Hover state - swap positions
	hover: {
		outerRadius: 160,  // Dotted circle expands
		innerRadius: 150,  // Solid circle contracts
		innerOpacity: 0.6,
		outerOpacity: 0.3
	}
}

// Calculate circumference and dash values
const calculateDashValues = (radius: number, progress: number = 100, isHover: boolean = false) => {
	const circumference = 2 * Math.PI * radius

	// For complete circle (after loading)
	if (progress === 100) {
		if (isHover) {
			// For hover: gradually close the gaps by increasing segment sizes
			// This creates a smooth closing animation without rotation
			const gapSize = circumference * 0.001 // Tiny gaps (almost closed)
			const segment1 = circumference * 0.499
			const segment2 = circumference * 0.499

			// Keep the same offset to prevent rotation
			const rotationOffset = circumference * 0.333

			return {
				array: `${segment1} ${gapSize} ${segment2} ${gapSize}`,
				offset: rotationOffset
			}
		} else {
			// Normal state: Create two gaps in the circle at 30° and 210°
			const gapSize = circumference * 0.05 // 5% gaps
			const segment1 = circumference * 0.45
			const segment2 = circumference * 0.45

			// Offset to position gaps at 30° and 210°
			const rotationOffset = circumference * 0.333 // 120° offset

			return {
				array: `${segment1} ${gapSize} ${segment2} ${gapSize}`,
				offset: rotationOffset
			}
		}
	}

	// For progress animation (loading)
	const offset = circumference - (progress / 100) * circumference
	return {
		array: `${circumference}`,
		offset: offset
	}
}

// Computed values for circle animations
const dashArray = computed(() => {
	if (progress.value === 100) {
		const radius = isHovered.value ? CIRCLE_CONFIG.hover.innerRadius : CIRCLE_CONFIG.normal.innerRadius
		return calculateDashValues(radius, 100, isHovered.value).array
	}
	return calculateDashValues(CIRCLE_CONFIG.normal.innerRadius, progress.value).array
})

const dashOffset = computed(() => {
	if (progress.value === 100) {
		const radius = isHovered.value ? CIRCLE_CONFIG.hover.innerRadius : CIRCLE_CONFIG.normal.innerRadius
		return calculateDashValues(radius, 100, isHovered.value).offset
	}
	return calculateDashValues(CIRCLE_CONFIG.normal.innerRadius, progress.value).offset
})

const emit = defineEmits<{
	'loading-complete': []
}>()

// Initialize loader animations
function initializeLoader() {
	if (!progressContainer.value || !progressCircles.value) return

	// Initial fade in
	gsap.fromTo(
		progressContainer.value,
		{ scale: 0.8, opacity: 0 },
		{ scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
	)

	// Rotation animation
	rotationTween = gsap.to(progressCircles.value, {
		rotation: 360,
		duration: 8,
		ease: 'none',
		repeat: -1,
		transformOrigin: 'center center'
	})

	// Progress animation
	simulateProgress()
}

// Simulate loading progress
function simulateProgress() {
	mainTimeline = gsap.timeline({
		onComplete: () => {
			onLoadingComplete()
		}
	})

	// Animate progress from 0 to 100
	mainTimeline.to(progress, {
		value: 100,
		duration: 3,
		ease: 'power2.out',
		onUpdate: () => {
			// Update circle during progress
			if (progressCircle.value && progress.value < 100) {
				const values = calculateDashValues(CIRCLE_CONFIG.normal.innerRadius, progress.value)
				gsap.set(progressCircle.value, {
					strokeDasharray: values.array,
					strokeDashoffset: values.offset
				})
			}
		}
	})
}

// Handle loading complete
function onLoadingComplete() {
	if (!progressCircle.value || !progressTextInner.value) return

	// Stop rotation
	if (rotationTween) {
		rotationTween.pause()
	}

	// Fade out progress text
	gsap.to(progressTextInner.value, {
		opacity: 0,
		y: -20,
		duration: 0.5,
		ease: 'power2.in',
		onComplete: () => {
			// Update circle to final state with gaps
			if (!progressCircle.value) return

			const values = calculateDashValues(CIRCLE_CONFIG.normal.innerRadius, 100)
			gsap.to(progressCircle.value, {
				strokeDasharray: values.array,
				strokeDashoffset: values.offset,
				duration: 0.8,
				ease: 'power2.inOut',
				onComplete: () => {
					// Show CTA
					ctaActive.value = true

					// Fade in CTA text
					const ctaText = document.querySelector('.preloader-cta-text-inner')
					if (ctaText) {
						gsap.fromTo(
							ctaText,
							{ opacity: 0, y: 20 },
							{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
						)
					}
				}
			})
		}
	})
}

// Improved hover animation with better state management
function handleCircleHover(entering: boolean) {
	if (!ctaActive.value || !progressCircle.value || !progressOutline.value) return

	// Cancel any existing hover animation
	if (hoverTimeline) {
		hoverTimeline.kill()
	}

	isHovered.value = entering

	// Create new timeline for this hover state
	hoverTimeline = gsap.timeline({
		defaults: {
			duration: 0.5,
			ease: 'power2.inOut'
		}
	})

	if (entering) {
		// Calculate values for hover state (almost closed gaps)
		const innerValues = calculateDashValues(CIRCLE_CONFIG.hover.innerRadius, 100, true)

		// Animate to hover state - circles swap positions, gaps close
		hoverTimeline
			.to(progressOutline.value, {
				attr: { r: CIRCLE_CONFIG.hover.outerRadius },
				opacity: CIRCLE_CONFIG.hover.outerOpacity
			}, 0)
			.to(progressCircle.value, {
				attr: { r: CIRCLE_CONFIG.hover.innerRadius },
				opacity: CIRCLE_CONFIG.hover.innerOpacity,
				strokeDasharray: innerValues.array,
				strokeDashoffset: innerValues.offset
			}, 0)
			.to('.preloader-cta-text-static', {
				y: '-100%',
				opacity: 0,
				duration: 0.3
			}, 0)
			.to('.preloader-cta-text-hover', {
				y: '0%',
				opacity: 1,
				duration: 0.3
			}, 0.1)
	} else {
		// Calculate values for normal state (with gaps)
		const innerValues = calculateDashValues(CIRCLE_CONFIG.normal.innerRadius, 100, false)

		// Animate back to normal state
		hoverTimeline
			.to(progressOutline.value, {
				attr: { r: CIRCLE_CONFIG.normal.outerRadius },
				opacity: CIRCLE_CONFIG.normal.outerOpacity
			}, 0)
			.to(progressCircle.value, {
				attr: { r: CIRCLE_CONFIG.normal.innerRadius },
				opacity: CIRCLE_CONFIG.normal.innerOpacity,
				strokeDasharray: innerValues.array,
				strokeDashoffset: innerValues.offset
			}, 0)
			.to('.preloader-cta-text-static', {
				y: '0%',
				opacity: 1,
				duration: 0.45  // Slightly slower return animation
			}, 0)
			.to('.preloader-cta-text-hover', {
				y: '100%',
				opacity: 0,
				duration: 0.45  // Slightly slower return animation
			}, 0.1)
	}
}

// Handle click to enter site
function handleEnter() {
	if (!ctaActive.value || !progressContainer.value || !loaderContainer.value) return

	// Disable further interactions and hide progress completely
	ctaActive.value = false
	progress.value = -1 // Set to -1 to completely hide progress text

	// Exit animation - faster
	gsap.timeline()
		.to(progressContainer.value, {
			scale: 1.3,
			opacity: 0,
			duration: 0.5,
			ease: 'power2.in'
		})
		.to(loaderContainer.value, {
			opacity: 0,
			duration: 0.5,
			ease: 'power2.in',
			onComplete: () => {
				loading.value = false
				emit('loading-complete')
				router.push('/')
			}
		}, '-=0.3')
}

// Lifecycle
onMounted(() => {
	setTimeout(() => {
		initializeLoader()
	}, 100)
})

onBeforeUnmount(() => {
	// Clean up all animations
	if (mainTimeline) mainTimeline.kill()
	if (hoverTimeline) hoverTimeline.kill()
	if (rotationTween) rotationTween.kill()
})
</script>

<template>
	<div
		v-if="loading"
		ref="loaderContainer"
		class="loader-container fixed inset-0 flex items-center justify-center z-50"
	>
		<div class="preloader">
			<div class="preloader-progress-wrapper">
				<div class="preloader-progress" ref="progressContainer">
					<!-- Clickable area -->
					<div
						class="preloader-clickable-area"
						@mouseenter="handleCircleHover(true)"
						@mouseleave="handleCircleHover(false)"
						@click="handleEnter"
						v-if="ctaActive"
					></div>

					<!-- CTA Text -->
					<div class="preloader-cta" :class="{ 'is-active': ctaActive }">
						<div class="preloader-cta-text">
							<div class="preloader-cta-text-inner">
								<div class="preloader-cta-text-static">Enter</div>
								<div class="preloader-cta-text-hover">Enter</div>
							</div>
						</div>
					</div>

					<!-- SVG Circles -->
					<svg
						class="preloader-progress-circles"
						width="400"
						height="400"
						viewBox="0 0 400 400"
						ref="progressCircles"
					>
						<!-- Dotted outline circle -->
						<circle
							class="preloader-progress-outline"
							:opacity="CIRCLE_CONFIG.normal.outerOpacity"
							cx="200"
							cy="200"
							:r="CIRCLE_CONFIG.normal.outerRadius"
							fill="none"
							stroke="currentColor"
							stroke-width="1"
							stroke-dasharray="2 4"
							ref="progressOutline"
						/>
						<!-- Main progress circle -->
						<circle
							class="preloader-progress-circle"
							:opacity="CIRCLE_CONFIG.normal.innerOpacity"
							cx="200"
							cy="200"
							:r="CIRCLE_CONFIG.normal.innerRadius"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							:stroke-dasharray="dashArray"
							:stroke-dashoffset="dashOffset"
							stroke-linecap="round"
							ref="progressCircle"
						/>
					</svg>

					<!-- Progress Text -->
					<div class="preloader-progress-text" v-if="!ctaActive && progress >= 0">
						<div class="preloader-progress-text-inner" ref="progressTextInner">
							<span class="preloader-progress-text-percent">{{ Math.round(progress) }}</span>
							<span class="preloader-progress-text-symbol">%</span>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<style scoped>
.loader-container {
	background: linear-gradient(135deg,
		rgb(17, 24, 39) 0%,
		rgba(99, 102, 241, 0.05) 50%,
		rgb(17, 24, 39) 100%);
	color: #bcbcbc;
}

.preloader {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-family: system-ui, -apple-system, sans-serif;
}

.preloader-progress-wrapper {
	position: relative;
	width: 400px;
	height: 400px;
}

.preloader-progress {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.preloader-clickable-area {
	position: absolute;
	inset: 50px;
	border-radius: 50%;
	cursor: pointer;
	z-index: 10;
}

.preloader-progress-circles {
	position: absolute;
	inset: 0;
	transform: rotate(-90deg);
}

.preloader-progress-outline {
	transition: none;
}

.preloader-progress-circle {
	transition: none;
}

.preloader-progress-text {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

.preloader-progress-text-inner {
	display: flex;
	align-items: baseline;
	gap: 2px;
	color: white;
}

.preloader-progress-text-percent {
	font-size: 1.5rem;
	font-weight: 400;
}

.preloader-progress-text-symbol {
	font-size: 1.5rem;
	font-weight: 400;
	opacity: 0.9;
}

.preloader-cta {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

.preloader-cta-text {
	position: relative;
	overflow: hidden;
	height: 40px;
}

.preloader-cta-text-inner {
	opacity: 0;
}

.preloader-cta.is-active .preloader-cta-text-inner {
	opacity: 1;
}

.preloader-cta-text-static,
.preloader-cta-text-hover {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	font-size: 1.25rem;
	font-weight: 500;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	transition: none;
}

.preloader-cta-text-hover {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	transform: translateY(100%);
	opacity: 0;
	color: rgb(165, 180, 252);
}


/* Responsive */
@media (max-width: 640px) {
	.preloader-progress-wrapper {
		width: 300px;
		height: 300px;
	}

	.preloader-progress-circles {
		width: 300px;
		height: 300px;
	}

	.preloader-progress-text-percent {
		font-size: 2rem;
	}
}
</style>