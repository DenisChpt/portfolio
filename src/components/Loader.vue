<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'

// Register necessary plugins
gsap.registerPlugin(CSSPlugin)

// Global GSAP configuration to improve performance
gsap.defaults({
	overwrite: 'auto', // Prevent animation conflicts
	lazy: false, // Avoid delays in animation startup
})

const router = useRouter()
const progressContainer = ref<HTMLDivElement>()
const progressCircles = ref<SVGElement>()
const progressCircle = ref<SVGCircleElement>()
const progressOutline = ref<SVGCircleElement>()
const progressTextInner = ref<HTMLDivElement>()
const footerTextInner = ref<HTMLDivElement>()
const loaderContainer = ref<HTMLDivElement>()

const loading = ref(true)
const progress = ref(0)
const ctaActive = ref(false)
const isHovered = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)

const baseRadius = 150 // Increased base radius for the circle
// These coefficients determine the gap size relative to the circumference.
const dashFactor = 0.04 // for static state (adjusted)
const offsetFactor = 1e-5 // for hover state (reduced for more fluidity)

const dashArray = ref('') // Empty at start, will be defined dynamically
const dashOffset = ref('') // Empty at start, will be defined dynamically

const emit = defineEmits<{
	'loading-complete': []
}>()

const circleRotation = ref<gsap.core.Tween | null>(null)

// Calculate initial values for the progress circle
function initProgressCircle() {
	if (!progressCircle.value) return

	const circumference = 2 * Math.PI * baseRadius
	const staticDash = circumference * (0.5 - dashFactor)
	const staticGap = circumference * dashFactor

	// Define the initial pattern
	const staticValue = `${staticDash.toFixed(4)} ${staticGap.toFixed(4)} ${staticDash.toFixed(
		4
	)} ${staticGap.toFixed(4)}`
	const staticOffset = staticDash.toFixed(4)

	// Save values for initial rendering
	dashArray.value = staticValue
	dashOffset.value = staticOffset

	// Setting initial properties via GSAP rather than CSS for more fluidity
	gsap.set(progressCircle.value, {
		strokeDasharray: staticValue,
		strokeDashoffset: staticOffset,
	})

	// Also store these values as CSS properties for future reference
	setProgressCircleProperties(0) // Initialize at 0% rather than 100%
}

// Update dash offset based on progress
function setProgressCircle(value: number) {
	if (!progressCircle.value) return

	const circumference = 2 * Math.PI * baseRadius
	const offset = circumference - (value / 100) * circumference
	dashOffset.value = offset.toFixed(4)

	// Update CSS properties at the same time to maintain consistency
	setProgressCircleProperties(value)
}

/**
 * Dynamically calculate dash array values for final state and store them
 * as CSS properties on circle elements.
 */
function setProgressCircleProperties(e: number = 100) {
	if (!progressCircle.value || !progressOutline.value) return

	// Current radius (now 150)
	const currentR = progressCircle.value.r.baseVal.value
	// For hover effect, reduce the radius (less radical)
	const hoverR = currentR * 0.96

	// Total circumference for static and hover states
	const fullCircumference = Math.PI * (currentR * 2)
	const hoverCircumference = Math.PI * (hoverR * 2)

	// More precise calculations to avoid visual jumps
	const staticDash = fullCircumference * (0.5 - dashFactor * (e / 100))
	const staticGap = fullCircumference * dashFactor * (e / 100)
	const hoverDash = hoverCircumference * (0.5 - offsetFactor * (e / 100))
	const hoverGap = hoverCircumference * offsetFactor * (e / 100)

	// Create a 4-value pattern: dash gap dash gap (with more precision)
	const staticValue = `${staticDash.toFixed(4)} ${staticGap.toFixed(4)} ${staticDash.toFixed(
		4
	)} ${staticGap.toFixed(4)}`
	const hoverValue = `${hoverDash.toFixed(4)} ${hoverGap.toFixed(4)} ${hoverDash.toFixed(
		4
	)} ${hoverGap.toFixed(4)}`

	// Save these values in CSS variables on the progressCircle element
	progressCircle.value.style.setProperty('--circle-dash-array-static', staticValue)
	progressCircle.value.style.setProperty('--circle-dash-offset-static', `${staticDash.toFixed(4)}`)
	progressCircle.value.style.setProperty('--circle-dash-array-hover', hoverValue)
	progressCircle.value.style.setProperty('--circle-dash-offset-hover', `${hoverDash.toFixed(4)}`)
	progressCircle.value.style.setProperty('--circle-r1-hover', `${hoverR}px`)
	progressOutline.value.style.setProperty('--circle-r2-hover', `${hoverR * 1.065}px`)

	// After loading is complete, update initial values
	// so they match the stored static values
	if (e === 100 && ctaActive.value) {
		// Ensure template values match CSS values
		dashArray.value = staticValue
		dashOffset.value = staticDash.toFixed(4)

		// Apply values directly to progress circle to avoid jumping
		if (progressCircle.value) {
			gsap.set(progressCircle.value, {
				strokeDasharray: staticValue,
				strokeDashoffset: staticDash.toFixed(4),
			})
		}
	}
}

function animateIn() {
	if (!progressContainer.value || !progressCircles.value) return

	gsap.fromTo(
		progressContainer.value,
		{ scale: 0.9, opacity: 0 },
		{ scale: 1, opacity: 1, duration: 3, ease: 'power4.out' }
	)

	circleRotation.value = gsap.to(progressCircles.value, {
		rotate: 360,
		duration: 6,
		ease: 'none',
		repeat: -1,
		paused: false,
	})
}

function simulateProgress() {
	gsap.to(progress, {
		value: 100,
		duration: 5,
		ease: 'power4.out',
		onUpdate() {
			setProgressCircle(progress.value)
		},
		onComplete() {
			if (circleRotation.value) {
				circleRotation.value.kill()
			}

			if (progressTextInner.value) {
				gsap.to(progressTextInner.value, {
					opacity: 0,
					y: 20,
					duration: 0.5,
					ease: 'power2.in',
					onComplete: () => {
						// Smooth transition to finalize circle before activating CTA
						if (!progressCircle.value) return
						const finalValue =
							progressCircle.value.style.getPropertyValue('--circle-dash-array-static') ||
							dashArray.value
						const finalOffset =
							progressCircle.value.style.getPropertyValue('--circle-dash-offset-static') ||
							dashOffset.value

						gsap.to(progressCircle.value, {
							strokeDasharray: finalValue,
							strokeDashoffset: finalOffset,
							duration: 0.3,
							ease: 'power2.out',
							onComplete: () => {
								// Ensure reactive values are synchronized
								dashArray.value = finalValue
								dashOffset.value = finalOffset

								// Activate CTA only after circle transition
								ctaActive.value = true

								// Use querySelector to ensure element exists
								const ctaTextInner = document.querySelector('.preloader-cta-text-inner')
								if (ctaTextInner) {
									gsap.fromTo(
										ctaTextInner,
										{
											opacity: 0,
											y: 20,
										},
										{
											opacity: 1,
											y: 0,
											duration: 0.8,
											ease: 'power2.out',
											onComplete: () => {
												checkMousePosition()
											}
										}
									)
								}
							},
						})
					},
				})
			}
		},
	})
}

function handleEnter() {
	if (!progressContainer.value || !loaderContainer.value) return

	// Circle animation
	gsap.to(progressContainer.value, {
		scale: 1.3,
		opacity: 0,
		duration: 0.8,
		ease: 'expo.out',
	})

	// Instant fade out of loader content without changing background
	gsap.to(loaderContainer.value, {
		opacity: 0,
		duration: 0.8,
		ease: 'expo.out',
		onComplete: () => {
			loading.value = false
			emit('loading-complete')
			router.push('/') // Navigate to home page
		},
	})
}

// Function to check if mouse is in clickable area
function checkMousePosition() {
	const clickableArea = document.querySelector('.preloader-clickable-area')
	if (!clickableArea || !ctaActive.value) return

	const rect = clickableArea.getBoundingClientRect()
	const centerX = rect.left + rect.width / 2
	const centerY = rect.top + rect.height / 2
	const radius = rect.width / 2

	const distance = Math.sqrt(
		Math.pow(mouseX.value - centerX, 2) + Math.pow(mouseY.value - centerY, 2)
	)

	if (distance <= radius && !isHovered.value) {
		handleCircleHover(true)
	}
}

// Track mouse position
function trackMousePosition(event: MouseEvent) {
	mouseX.value = event.clientX
	mouseY.value = event.clientY
}

function handleCircleHover(isEntering: boolean) {
	if (!ctaActive.value || !progressCircle.value || !progressOutline.value) return

	// Store references in local variables
	const circle = progressCircle.value
	const outline = progressOutline.value

	isHovered.value = isEntering

	// Improvement 1: Longer animation duration for smoother transition
	const duration = 1.2

	// Improvement 2: Use more sophisticated ease for smoother animation
	const ease = 'elastic.out(0.5, 0.3)'

	if (isEntering) {
		// Retrieve calculated dynamic values for hover
		const hoverDashArray =
			circle.style.getPropertyValue('--circle-dash-array-hover') || '325.27 36.09 325.27 36.09'
		const hoverDashOffset = circle.style.getPropertyValue('--circle-dash-offset-hover') || '325.27'
		const hoverR = circle.style.getPropertyValue('--circle-r1-hover') || '145px'
		const outlineR = circle.style.getPropertyValue('--circle-r2-hover') || '160px'

		// Improvement 3: Use GSAP timeline to coordinate animations
		const tl = gsap.timeline({
			defaults: { duration, ease },
		})

		// Animation of outline (outer circle)
		tl.to(
			outline,
			{
				r: outlineR.replace('px', ''),
				opacity: 0.6,
				overwrite: 'auto',
			},
			0
		)

		// Animation of main circle
		tl.to(
			circle,
			{
				r: hoverR.replace('px', ''),
				opacity: 0.5,
				overwrite: 'auto',
			},
			0
		)

		// Animation of stroke properties
		tl.to(
			circle,
			{
				strokeDasharray: hoverDashArray,
				strokeDashoffset: hoverDashOffset,
				overwrite: 'auto',
				onUpdate: () => {
					dashArray.value = circle.style.strokeDasharray || hoverDashArray
					dashOffset.value = circle.style.strokeDashoffset || hoverDashOffset
				},
			},
			0
		)

		// Text animation
		tl.to(
			'.preloader-cta-text-static',
			{
				y: '-100%',
				opacity: 0,
				duration: 0.5,
				ease: 'power2.out',
				overwrite: 'auto',
			},
			0
		)

		tl.to(
			'.preloader-cta-text-hover',
			{
				y: 0,
				opacity: 1,
				duration: 0.5,
				ease: 'power2.out',
				overwrite: 'auto',
			},
			0.1
		)
	} else {
		const staticDashArray =
			circle.style.getPropertyValue('--circle-dash-array-static') || '339.29 37.69 339.29 37.69'
		const staticDashOffset =
			circle.style.getPropertyValue('--circle-dash-offset-static') || '339.29'

		// Use timeline for exit as well
		const tl = gsap.timeline({
			defaults: { duration, ease },
		})

		tl.to(
			outline,
			{
				r: 150,
				opacity: 0.4,
				overwrite: 'auto',
			},
			0
		)

		tl.to(
			circle,
			{
				r: 160,
				opacity: 0.5,
				overwrite: 'auto',
			},
			0
		)

		tl.to(
			circle,
			{
				strokeDasharray: staticDashArray,
				strokeDashoffset: staticDashOffset,
				overwrite: 'auto',
				onUpdate: () => {
					dashArray.value = circle.style.strokeDasharray || staticDashArray
					dashOffset.value = circle.style.strokeDashoffset || staticDashOffset
				},
			},
			0
		)

		tl.to(
			'.preloader-cta-text-static',
			{
				y: 0,
				opacity: 1,
				duration: 0.5,
				ease: 'power2.out',
				overwrite: 'auto',
			},
			0
		)

		tl.to(
			'.preloader-cta-text-hover',
			{
				y: '100%',
				opacity: 0,
				duration: 0.5,
				ease: 'power2.out',
				overwrite: 'auto',
			},
			0
		)
	}
}

onMounted(() => {
	// Add listener to track mouse position
	window.addEventListener('mousemove', trackMousePosition)

	// Ensure refs are properly defined before initializing
	setTimeout(() => {
		if (progressCircle.value && progressOutline.value) {
			initProgressCircle() // Initialize circle values
		}

		if (progressContainer.value && progressCircles.value) {
			animateIn()
		}

		simulateProgress()
	}, 100)
})

onBeforeUnmount(() => {
	// Clean up running animations
	if (circleRotation.value) {
		circleRotation.value.kill()
	}

	window.removeEventListener('mousemove', trackMousePosition)
})
</script>

<template>
	<div
		v-if="loading"
		ref="loaderContainer"
		class="loader-container fixed inset-0 flex items-center justify-center z-50"
	>
		<div class="preloader c-color">
			<div class="preloader-progress-wrapper">
				<div class="preloader-progress" ref="progressContainer">
					<div
						class="preloader-clickable-area"
						@mouseenter="handleCircleHover(true)"
						@mouseleave="handleCircleHover(false)"
						@click="ctaActive ? handleEnter() : null"
					></div>

					<div class="preloader-cta" :class="{ 'is-active': ctaActive }">
						<div class="preloader-cta-text">
							<div class="preloader-cta-text-inner">
								<div class="preloader-cta-text-static">Enter</div>
								<div class="preloader-cta-text-hover">Enter</div>
							</div>
						</div>
					</div>

					<svg
						class="preloader-progress-circles"
						width="462"
						height="462"
						viewBox="0 0 462 462"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						ref="progressCircles"
					>
						<circle
							class="preloader-progress-outline"
							opacity="0.4"
							cx="231"
							cy="231"
							r="150"
							stroke="currentColor"
							stroke-dasharray="2 2"
							ref="progressOutline"
						/>
						<circle
							class="preloader-progress-circle"
							opacity="0.5"
							cx="231"
							cy="231"
							r="160"
							stroke="currentColor"
							:style="{
								strokeDasharray: dashArray,
								strokeDashoffset: dashOffset,
							}"
							ref="progressCircle"
						/>
					</svg>

					<div class="preloader-progress-text">
						<div class="preloader-progress-text-inner" ref="progressTextInner">
							<div class="preloader-progress-text-percent">{{ Math.round(progress) }}</div>
							%
						</div>
					</div>
				</div>
			</div>

			<div class="preloader-footer">
				<div class="wrap">
					<div class="flex justify-end">
						<div class="preloader-footer-text">
							<div class="preloader-footer-text-inner" ref="footerTextInner">
								Loading<span class="preloader-footer-text-dots">...</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
:root {
	--font-mono: 'JB Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
	--expo-out: cubic-bezier(0.19, 1, 0.22, 1);
	--circ-out: cubic-bezier(0.075, 0.82, 0.165, 1);
}

.loader-container {
	color: #bcbcbc;
	background: transparent !important; /* Transparent background to see AnimatedBackground */

	/* Add background with animated gradient similar to other pages */
	&::before {
		content: '';
		position: fixed;
		inset: 0;
		background: linear-gradient(to bottom right,
			rgb(17, 24, 39),
			rgba(99, 102, 241, 0.1),
			rgb(17, 24, 39));
		z-index: -1;
	}

	/* Animated gradient bubbles */
	&::after {
		content: '';
		position: fixed;
		top: 20%;
		left: 10%;
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent);
		border-radius: 50%;
		filter: blur(60px);
		animation: float 20s ease-in-out infinite;
		z-index: -1;
	}
}

@keyframes float {
	0%, 100% {
		transform: translate(0, 0) scale(1);
	}
	33% {
		transform: translate(30px, -50px) scale(1.1);
	}
	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}
}

.preloader {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-family: var(--font-mono);
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;
}

.preloader-progress-wrapper {
	position: relative;
	width: 30rem;
	height: 30rem;
	z-index: 1;
}

@media (max-width: 999px) {
	.preloader-progress-wrapper {
		width: 22rem;
		height: 22rem;
	}
}

.preloader-progress {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	will-change: opacity, transform;
	width: 100%;
	height: 100%;
}

.preloader-clickable-area {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 310px;
	height: 310px;
	border-radius: 50%;
	cursor: pointer;
	z-index: 2;
	transform-style: preserve-3d;
}

.preloader-progress-circles {
	width: 100%;
	height: 100%;
	transform: rotate(135deg);
	pointer-events: none;
	will-change: transform;
	backface-visibility: hidden;
	transform-style: preserve-3d;
}

.preloader-progress-outline {
	will-change: r, opacity;
	transform: translateZ(0);
	stroke-width: 1px;
}

.preloader-progress-circle {
	will-change: r, opacity, stroke-dasharray, stroke-dashoffset;
	transform: translateZ(0);
	stroke-width: 2px;
}

.preloader-progress-text {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 6rem;
	transform: translate(-50%, -55%);
	text-align: center;
	pointer-events: none;
}

.preloader-progress-text-percent {
	font-size: 1.75rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95);
	margin-bottom: -5px;
}

.preloader-cta {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;
	z-index: 1;
}

.preloader-cta-text {
	position: relative;
	overflow: hidden;
}

.preloader-cta-text-inner {
	position: relative;
	opacity: 0;
	transform: translateY(20px);
}

.preloader-cta.is-active .preloader-cta-text-inner {
	opacity: 1;
	transform: translateY(0);
}

.preloader-cta-text-static,
.preloader-cta-text-hover {
	padding: 0.5rem 1rem;
	font-size: 1.5rem;
	letter-spacing: 0.4em;
	text-transform: uppercase;
	will-change: transform, opacity;
	backface-visibility: hidden;
}

.preloader-cta-text-hover {
	position: absolute;
	top: 0;
	left: 0;
	transform: translateY(100%);
	opacity: 0;
	color: rgba(165, 180, 252, 1);
}

.preloader-footer {
	position: fixed;
	bottom: var(--py, 1.5rem);
	left: 0;
	right: 0;
	padding: 0 var(--px, 1.5rem);
	z-index: 1;
}

.preloader-footer-text-inner {
	display: flex;
	overflow: hidden;
	opacity: 0;
	letter-spacing: 0.2em;
}

.preloader-footer-text-dots {
	animation: dots 2s infinite;
}

@keyframes dots {
	0%,
	20% {
		content: '.';
	}
	40% {
		content: '..';
	}
	60%,
	100% {
		content: '...';
	}
}

@media (min-width: 1000px) {
	.loader-container {
		font-size: clamp(14px, 0.92593vw, 18px);
	}
}
</style>
