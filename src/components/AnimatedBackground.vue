<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let backgroundAnimation: number | null = null

// Animation de fond optimisée
function initBackgroundAnimation() {
	if (!canvasRef.value) return

	const canvas = canvasRef.value
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	// Ajuster la taille du canvas pour éviter la pixelisation
	function resizeCanvas() {
		const dpr = window.devicePixelRatio || 1
		canvas.width = window.innerWidth * dpr
		canvas.height = window.innerHeight * dpr
		canvas.style.width = `${window.innerWidth}px`
		canvas.style.height = `${window.innerHeight}px`
		ctx.scale(dpr, dpr)
	}

	// Écouter le redimensionnement de la fenêtre
	window.addEventListener('resize', resizeCanvas)
	resizeCanvas()

	// Paramètres de l'animation
	const gridSize = 40
	const gridLineWidth = 0.3
	const dotsCount = 30
	const dotMinRadius = 1
	const dotMaxRadius = 3
	const maxSpeed = 0.4

	// Création des points lumineux
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
			// Mise à jour de la position
			this.x += this.vx
			this.y += this.vy

			// Rebond sur les bords
			if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx
			if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy

			// Effet de pulsation légère
			this.alpha = this.initialAlpha * (0.8 + Math.sin(Date.now() * 0.002) * 0.2)
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.beginPath()
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
			ctx.fillStyle = `rgba(180, 180, 210, ${this.alpha})`
			ctx.fill()
		}
	}

	// Création des connexions entre les points
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

	// Dessin de la grille
	function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
		ctx.strokeStyle = 'rgba(50, 50, 70, 0.15)'
		ctx.lineWidth = gridLineWidth

		// Lignes horizontales
		for (let y = 0; y < height; y += gridSize) {
			ctx.beginPath()
			ctx.moveTo(0, y)
			ctx.lineTo(width, y)
			ctx.stroke()
		}

		// Lignes verticales
		for (let x = 0; x < width; x += gridSize) {
			ctx.beginPath()
			ctx.moveTo(x, 0)
			ctx.lineTo(x, height)
			ctx.stroke()
		}
	}

	// Création des points
	const dots: Dot[] = []
	for (let i = 0; i < dotsCount; i++) {
		dots.push(new Dot())
	}

	// Animation
	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Dessiner le fond avec un dégradé linéaire sombre (comme dans le loader original)
		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, '#0A0B12');
		gradient.addColorStop(1, '#090A0F');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		// Dessiner la grille
		drawGrid(ctx, canvas.width, canvas.height)

		// Mettre à jour et dessiner les points
		dots.forEach((dot) => {
			dot.update()
			dot.draw(ctx)
		})

		// Dessiner les connexions
		drawConnections(dots, ctx)

		// Continuer l'animation
		backgroundAnimation = requestAnimationFrame(animate)
	}

	animate()
}

onMounted(() => {
	// Léère temporisation pour s'assurer que le DOM est prêt
	setTimeout(() => {
		if (canvasRef.value) {
			initBackgroundAnimation()
		}
	}, 100)
})

onBeforeUnmount(() => {
	// Nettoyer les animations en cours
	if (backgroundAnimation !== null) {
		cancelAnimationFrame(backgroundAnimation)
	}

	// Nettoyer les écouteurs d'événements
	window.removeEventListener('resize', () => {});
})
</script>

<template>
	<!-- Utiliser un conteneur spécial pour l'arrière-plan -->
	<div class="animated-background-container">
		<canvas ref="canvasRef" class="animated-background-canvas"></canvas>
	</div>
</template>

<style>
/* Styles globaux pour s'assurer que le fond est visible partout */
html, body {
	margin: 0;
	padding: 0;
	/* Supprimer explicitement tout fond qui pourrait interférer */
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
}

.animated-background-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
