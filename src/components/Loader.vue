<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'
import AnimatedBackground from './AnimatedBackground.vue'

// Enregistrement des plugins nécessaires
gsap.registerPlugin(CSSPlugin)

// Configuration globale de GSAP pour améliorer les performances
gsap.defaults({
	overwrite: 'auto', // Prévenir les conflits d'animation
	lazy: false, // Éviter les retards dans le démarrage des animations
})

const router = useRouter()
const progressContainer = ref<HTMLDivElement>()
const progressCircles = ref<SVGElement>()
const progressCircle = ref<SVGCircleElement>()
const progressOutline = ref<SVGCircleElement>()
const progressTextInner = ref<HTMLDivElement>()
const footerTextInner = ref<HTMLDivElement>()

const loading = ref(true)
const progress = ref(0)
const ctaActive = ref(false)
const isHovered = ref(false)

const baseRadius = 150 // Rayon de base augmenté pour le cercle
// Ces coefficients déterminent la taille du gap par rapport à la circonférence.
const dashFactor = 0.04 // pour l'état statique (ajusté)
const offsetFactor = 1e-5 // pour l'état hover (réduit pour plus de fluidité)

const dashArray = ref('') // Vide au début, sera défini dynamiquement
const dashOffset = ref('') // Vide au début, sera défini dynamiquement

const emit = defineEmits<{
	'loading-complete': []
}>()

const circleRotation = ref<gsap.core.Tween | null>(null)

// Calcule les valeurs initiales pour le cercle de progression
function initProgressCircle() {
	if (!progressCircle.value) return

	const circumference = 2 * Math.PI * baseRadius
	const staticDash = circumference * (0.5 - dashFactor)
	const staticGap = circumference * dashFactor

	// Définit le motif initial
	const staticValue = `${staticDash.toFixed(4)} ${staticGap.toFixed(4)} ${staticDash.toFixed(
		4
	)} ${staticGap.toFixed(4)}`
	const staticOffset = staticDash.toFixed(4)

	// Enregistre les valeurs pour le rendu initial
	dashArray.value = staticValue
	dashOffset.value = staticOffset

	// Réglage des propriétés initiales par GSAP plutôt que par CSS pour plus de fluidité
	gsap.set(progressCircle.value, {
		strokeDasharray: staticValue,
		strokeDashoffset: staticOffset,
	})

	// Stocke également ces valeurs comme propriétés CSS pour référence future
	setProgressCircleProperties(0) // Initialiser à 0% plutôt qu'à 100%
}

// Met à jour le dash offset en fonction de la progression
function setProgressCircle(value: number) {
	if (!progressCircle.value) return

	const circumference = 2 * Math.PI * baseRadius
	const offset = circumference - (value / 100) * circumference
	dashOffset.value = offset.toFixed(4)

	// Mettre à jour les propriétés CSS en même temps pour garder la cohérence
	setProgressCircleProperties(value)
}

/**
 * Calcule dynamiquement les valeurs du dash array pour l'état final et les stocke
 * comme propriétés CSS sur les éléments du cercle.
 */
function setProgressCircleProperties(e: number = 100) {
	if (!progressCircle.value || !progressOutline.value) return

	// Rayon courant (maintenant 150)
	const currentR = progressCircle.value.r.baseVal.value
	// Pour l'effet hover, on réduit le rayon (moins radical)
	const hoverR = currentR * 0.96

	// Circonférence totale pour l'état statique et hover
	const fullCircumference = Math.PI * (currentR * 2)
	const hoverCircumference = Math.PI * (hoverR * 2)

	// Calculs plus précis pour éviter les sauts visuels
	const staticDash = fullCircumference * (0.5 - dashFactor * (e / 100))
	const staticGap = fullCircumference * dashFactor * (e / 100)
	const hoverDash = hoverCircumference * (0.5 - offsetFactor * (e / 100))
	const hoverGap = hoverCircumference * offsetFactor * (e / 100)

	// Créer un motif à 4 valeurs: dash gap dash gap (avec plus de précision)
	const staticValue = `${staticDash.toFixed(4)} ${staticGap.toFixed(4)} ${staticDash.toFixed(
		4
	)} ${staticGap.toFixed(4)}`
	const hoverValue = `${hoverDash.toFixed(4)} ${hoverGap.toFixed(4)} ${hoverDash.toFixed(
		4
	)} ${hoverGap.toFixed(4)}`

	// Enregistrer ces valeurs dans des variables CSS sur l'élément progressCircle
	progressCircle.value.style.setProperty('--circle-dash-array-static', staticValue)
	progressCircle.value.style.setProperty('--circle-dash-offset-static', `${staticDash.toFixed(4)}`)
	progressCircle.value.style.setProperty('--circle-dash-array-hover', hoverValue)
	progressCircle.value.style.setProperty('--circle-dash-offset-hover', `${hoverDash.toFixed(4)}`)
	progressCircle.value.style.setProperty('--circle-r1-hover', `${hoverR}px`)
	progressOutline.value.style.setProperty('--circle-r2-hover', `${hoverR * 1.065}px`)

	// Après que le chargement est terminé, on met à jour les valeurs initiales
	// pour qu'elles correspondent aux valeurs statiques stockées
	if (e === 100 && ctaActive.value) {
		// Assurons-nous que les valeurs dans le template correspondent aux valeurs CSS
		dashArray.value = staticValue
		dashOffset.value = staticDash.toFixed(4)

		// Appliquer directement les valeurs au cercle de progression pour éviter le saut
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
						// Transition en douceur pour finaliser le cercle avant d'activer le CTA
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
								// S'assurer que les valeurs réactives sont synchronisées
								dashArray.value = finalValue
								dashOffset.value = finalOffset

								// Activer le CTA seulement après la transition du cercle
								ctaActive.value = true

								// Utiliser querySelector pour s'assurer que l'élément existe
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
	if (!progressContainer.value) return

	gsap.to(progressContainer.value, {
		scale: 1.2,
		opacity: 0,
		duration: 1,
		ease: 'expo.out',
	})

	gsap.to('.loader-container', {
		opacity: 0,
		duration: 1.5,
		delay: 0.5,
		ease: 'expo.out',
		onComplete: () => {
			loading.value = false
			emit('loading-complete')
			router.push('/') // Navigation vers la page d'accueil
		},
	})
}

function handleCircleHover(isEntering: boolean) {
	if (!ctaActive.value || !progressCircle.value || !progressOutline.value) return

	// Stocker les références dans des variables locales
	const circle = progressCircle.value
	const outline = progressOutline.value

	isHovered.value = isEntering

	// Amélioration 1: Durée d'animation plus longue pour une transition plus douce
	const duration = 1.2

	// Amélioration 2: Utiliser un ease plus sophistiqué pour une animation plus fluide
	const ease = 'elastic.out(0.5, 0.3)'

	if (isEntering) {
		// Récupération des valeurs dynamiques calculées pour le hover
		const hoverDashArray =
			circle.style.getPropertyValue('--circle-dash-array-hover') || '325.27 36.09 325.27 36.09'
		const hoverDashOffset = circle.style.getPropertyValue('--circle-dash-offset-hover') || '325.27'
		const hoverR = circle.style.getPropertyValue('--circle-r1-hover') || '145px'
		const outlineR = circle.style.getPropertyValue('--circle-r2-hover') || '160px'

		// Amélioration 3: Utiliser une timeline GSAP pour coordonner les animations
		const tl = gsap.timeline({
			defaults: { duration, ease },
		})

		// Animation de l'outline (cercle extérieur)
		tl.to(
			outline,
			{
				r: outlineR.replace('px', ''),
				opacity: 0.6,
				overwrite: 'auto',
			},
			0
		)

		// Animation du cercle principal
		tl.to(
			circle,
			{
				r: hoverR.replace('px', ''),
				opacity: 0.5,
				overwrite: 'auto',
			},
			0
		)

		// Animation des propriétés de stroke
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

		// Animation du texte
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

		// Utiliser une timeline pour la sortie également
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
	// S'assurer que les refs sont bien définies avant d'initialiser
	setTimeout(() => {
		if (progressCircle.value && progressOutline.value) {
			initProgressCircle() // Initialise les valeurs du cercle
		}

		if (progressContainer.value && progressCircles.value) {
			animateIn()
		}

		simulateProgress()
	}, 100)
})

onBeforeUnmount(() => {
	// Nettoyer les animations en cours
	if (circleRotation.value) {
		circleRotation.value.kill()
	}
})
</script>

<template>
	<div
		v-if="loading"
		class="loader-container fixed inset-0 flex items-center justify-center bg-[#090A0F] z-50"
	>
		<!-- Utiliser le même fond animé que le reste de l'application -->
		<AnimatedBackground />

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
