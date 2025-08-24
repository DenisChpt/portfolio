<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useProjectsStore } from '@/stores/projectsStore'
import Card from '@/components/Card.vue'
import Button from '@/components/Button.vue'

const { t } = useI18n()
const projectsStore = useProjectsStore()
const route = useRoute()
const router = useRouter()

// Références pour l'animation
const headerRef = ref(null)
const filtersRef = ref(null)
const projectsGridRef = ref(null)
const cardRef = ref(null)

// Variable pour contrôler la visibilité initiale
const contentReady = ref(false)

// Search and filters - initialize from store to maintain state
const searchQuery = ref(projectsStore.searchQuery)
const selectedTechs = ref<Set<string>>(new Set(projectsStore.filterTechs))
const isFiltering = ref(false)

// Color mapping for technologies - vibrant and distinct colors
const techColors: Record<string, string> = {
	'Python': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
	'JavaScript': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
	'TypeScript': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
	'React': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
	'Vue.js': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
	'Node.js': 'bg-green-500/20 text-green-300 border-green-500/40',
	'Docker': 'bg-sky-500/20 text-sky-300 border-sky-500/40',
	'Kubernetes': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
	'Jenkins': 'bg-red-500/20 text-red-300 border-red-500/40',
	'GitLab CI': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
	'CMake': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
	'C++': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
	'Rust': 'bg-amber-600/20 text-amber-400 border-amber-600/40',
	'Linux': 'bg-slate-500/20 text-slate-300 border-slate-500/40',
	'Git': 'bg-red-600/20 text-red-400 border-red-600/40',
	'AWS': 'bg-orange-600/20 text-orange-400 border-orange-600/40',
	'SQL': 'bg-violet-500/20 text-violet-300 border-violet-500/40',
	'OpenGL': 'bg-teal-500/20 text-teal-300 border-teal-500/40',
	'default': 'bg-gray-500/20 text-gray-300 border-gray-500/40'
}

const getTechColor = (tech: string): string => {
	return techColors[tech] || techColors['default']
}

// Color mapping for project status
const statusColors: Record<string, { dot: string; text: string }> = {
	'active': { dot: 'bg-green-400', text: 'text-green-400' },
	'completed': { dot: 'bg-blue-400', text: 'text-blue-400' },
	'in-progress': { dot: 'bg-yellow-400', text: 'text-yellow-400' },
	'archived': { dot: 'bg-gray-400', text: 'text-gray-400' },
	'maintenance': { dot: 'bg-orange-400', text: 'text-orange-400' }
}

const getStatusColor = (status?: string) => {
	return statusColors[status || 'active'] || statusColors['active']
}

// Référence pour le modal
const projectDetailsRef = ref(null)
const projectImageRef = ref<HTMLElement | null>(null)
const modalBackdropRef = ref<HTMLElement | null>(null)

// Mouse tracking for image tilt effect
const handleMouseMove = (event: MouseEvent) => {
	if (!projectImageRef.value) return
	
	const rect = projectImageRef.value.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	
	const centerX = rect.width / 2
	const centerY = rect.height / 2
	
	const rotateX = ((y - centerY) / centerY) * -10 // Max 10 degrees
	const rotateY = ((x - centerX) / centerX) * 10 // Max 10 degrees
	
	projectImageRef.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
}

const handleMouseLeave = () => {
	if (!projectImageRef.value) return
	projectImageRef.value.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
}

// Handle filtering
const handleSearch = () => {
	isFiltering.value = true
	projectsStore.setSearchQuery(searchQuery.value)
}

const handleTechFilter = async (tech: string) => {
	isFiltering.value = true

	// Toggle la sélection de la techno
	if (selectedTechs.value.has(tech)) {
		selectedTechs.value.delete(tech)
	} else {
		selectedTechs.value.add(tech)
	}

	// Mettre à jour le filtre dans le store avec toutes les technos sélectionnées
	projectsStore.setMultipleTechFilters(Array.from(selectedTechs.value))

	// Permettre au DOM de se mettre à jour avant d'animer
	await nextTick()

	// Animation des éléments filtrés
	animateFilteredProjects()
}

const clearFilters = async () => {
	isFiltering.value = true
	searchQuery.value = ''
	selectedTechs.value.clear()
	projectsStore.clearFilters()

	// Permettre au DOM de se mettre à jour avant d'animer
	await nextTick()

	// Animation des éléments filtrés
	animateFilteredProjects()
}

// Animation spécifique pour les projets filtrés
const animateFilteredProjects = () => {
	// Sélectionner tous les projets (qui sont maintenant dans le DOM)
	const projectCards = document.querySelectorAll('.project-card')

	if (projectCards.length === 0) return

	// Réinitialiser l'opacité et d'autres styles d'animation
	gsap.set(projectCards, {
		opacity: 0,
		y: 20,
		scale: 0.95,
	})

	// Animer les cartes avec un effet de cascade
	gsap.to(projectCards, {
		opacity: 1,
		y: 0,
		scale: 1,
		duration: 0.5,
		stagger: 0.05,
		clearProps: 'all',
		onComplete: () => {
			isFiltering.value = false
		},
	})
}

// Open and close project details
const openProject = (id: number) => {
	projectsStore.selectProject(id)

	// Animer l'apparition du modal et du backdrop
	nextTick(() => {
		// Animation du backdrop (fond sombre)
		if (modalBackdropRef.value) {
			gsap.fromTo(
				modalBackdropRef.value,
				{
					opacity: 0,
				},
				{
					opacity: 1,
					duration: 0.4,
					ease: 'power2.out',
				}
			)
		}

		// Animation du modal depuis le bas
		if (projectDetailsRef.value) {
			gsap.fromTo(
				projectDetailsRef.value,
				{
					y: '100%',
					opacity: 0.8,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.4,
					ease: 'power3.out',
				}
			)
		}
	})
}

const closeProject = () => {
	// Animer la disparition du modal et du backdrop
	if (modalBackdropRef.value) {
		gsap.to(modalBackdropRef.value, {
			opacity: 0,
			duration: 0.3,
			ease: 'power2.in',
		})
	}
	
	if (projectDetailsRef.value) {
		gsap.to(projectDetailsRef.value, {
			y: '50%',
			opacity: 0,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => {
				projectsStore.selectProject(null)
				// Nettoyer le paramètre query si présent
				if (route.query.project) {
					router.replace({ name: 'projects', query: {} })
				}
			},
		})
	} else {
		projectsStore.selectProject(null)
		// Nettoyer le paramètre query si présent
		if (route.query.project) {
			router.replace({ name: 'projects', query: {} })
		}
	}
}

// Animation de la page
const animateProjects = () => {
	const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

	// Titre et description
	tl.fromTo(headerRef.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)

	// Filtres
	tl.fromTo(filtersRef.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5)

	// Grille de projets - avec callback pour marquer la fin d'animation
	tl.fromTo(
		'.project-card',
		{ y: 30, opacity: 0, scale: 0.95 },
		{
			y: 0,
			opacity: 1,
			scale: 1,
			duration: 0.7,
			stagger: 0.1,
			clearProps: 'all', // Nettoyer toutes les propriétés d'animation
		},
		0.7
	)
}

onMounted(() => {
	// On cache le contenu initialement
	contentReady.value = false

	// On utilise un timeout pour s'assurer que le DOM est prêt et que tout est masqué
	setTimeout(() => {
		// Maintenant on peut rendre le contenu visible
		contentReady.value = true

		// Et lancer l'animation après que le contenu soit rendu
		setTimeout(() => {
			animateProjects()
			
			// Vérifier si on doit ouvrir un projet spécifique
			if (route.query.project) {
				const projectId = Number(route.query.project)
				if (!isNaN(projectId)) {
					// Attendre que l'animation initiale soit terminée avant d'ouvrir le projet
					setTimeout(() => {
						openProject(projectId)
					}, 1500) // Délai pour laisser l'animation de la page se terminer
				}
			}
		}, 50) // Un petit délai pour être sûr que la transition d'opacité est terminée
	}, 50)
})

// Observer les changements dans les projets filtrés
watch(
	() => projectsStore.filteredProjects,
	(_, oldProjects) => {
		// Ne pas animer si le contenu n'est pas encore prêt
		if (!contentReady.value) return

		// Ne pas animer à l'initialisation ou si l'animation est déjà gérée par handleTechFilter
		if (!oldProjects || isFiltering.value) return

		// Animer les modifications de filtres
		nextTick(() => {
			animateFilteredProjects()
		})
	},
	{ deep: true }
)
</script>

<template>
	<div class="min-h-screen pt-32 pb-16">
		<!-- Animated background -->
		<div class="fixed inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/10 to-gray-900"></div>
			<div class="absolute top-40 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
		</div>
		
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div v-if="!contentReady" class="w-full h-full"></div>

			<!-- Main content -->
			<div v-else>
				<div ref="headerRef" class="text-center mb-12" :style="{ opacity: 0 }">
					<h1 class="text-5xl md:text-7xl font-bold mb-6">
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
							{{ t('projects.title') }}
						</span>
					</h1>
					<p class="text-xl text-gray-300 max-w-3xl mx-auto">
						{{ t('projects.description') }}
					</p>
					<div class="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
				</div>

				<!-- Search and filter -->
				<div
					ref="filtersRef"
					class="mb-8 space-y-6"
					:style="{ opacity: 0 }"
				>
					<!-- Search bar on its own line -->
					<div class="w-full max-w-2xl mx-auto">
						<div class="relative">
							<input
								v-model="searchQuery"
								@input="handleSearch"
								type="text"
								placeholder="Search projects..."
								class="input w-full pr-10 text-base py-3"
							/>
							<button
								v-if="searchQuery"
								@click="clearFilters"
								class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Tech filters on their own line -->
					<div class="flex flex-wrap justify-center gap-3">
						<button
							v-for="tech in projectsStore.allTechnologies"
							:key="tech"
							@click="handleTechFilter(tech)"
							class="px-4 py-2 text-sm rounded-full border transition-all duration-300"
							:class="[
								getTechColor(tech),
								selectedTechs.has(tech) 
									? 'ring-2 ring-white/50 shadow-lg transform scale-105' 
									: 'hover:scale-105'
							]"
						>
							{{ tech }}
							<span v-if="selectedTechs.has(tech)" class="ml-1">✓</span>
						</button>
					</div>
				</div>

				<!-- No results message -->
				<div
					v-if="projectsStore.filteredProjects.length === 0"
					class="text-center py-16 bg-gray-900/20 rounded-xl border border-indigo-500/10"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-16 w-16 mx-auto text-indigo-500/50 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p class="text-gray-400 text-lg mb-5">No projects found matching your criteria.</p>
					<Button @click="clearFilters" variant="outline" size="md">Clear Filters</Button>
				</div>

				<!-- Projects grid with modern cards -->
				<div v-else ref="projectsGridRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div
						v-for="(project, index) in projectsStore.filteredProjects"
						:key="project.id"
						class="project-card group"
						ref="cardRef"
						@click="openProject(project.id)"
						:style="{ opacity: 0, animationDelay: `${index * 0.1}s` }"
					>
						<!-- Ultra modern card design -->
						<div class="card-container relative h-full">
							<!-- Glow effect that follows mouse -->
							<div class="card-glow absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500"></div>
							
							<!-- Main card -->
							<div class="card-content relative h-full bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden transition-all duration-500 group-hover:border-transparent group-hover:transform group-hover:-translate-y-1 flex flex-col">
								
								<!-- Gradient overlay that animates -->
								<div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
								
								<!-- Image section with parallax effect -->
								<div class="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
									<!-- Animated gradient background -->
									<div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift"></div>
									
									<!-- Project image with advanced effects -->
									<img
										:src="project.image"
										:alt="project.title"
										class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
									/>
									
									<!-- Dark gradient overlay -->
									<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
									
									
									<!-- Hover indicator - chevron centered at bottom -->
									<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
										<div class="p-2 bg-white/10 backdrop-blur-md rounded-full">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
											</svg>
										</div>
									</div>
								</div>
								
								<!-- Content section with glassmorphism -->
								<div class="relative p-6 flex-1 flex flex-col z-10">
									<!-- Title with gradient on hover -->
									<h3 class="text-xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400">
										{{ project.title }}
									</h3>
									
									<!-- Animated underline -->
									<div class="h-0.5 w-0 group-hover:w-16 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 mb-3"></div>
									
									<!-- Description -->
									<p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-1 group-hover:text-gray-300 transition-colors duration-300">
										{{ project.description }}
									</p>
									
									<!-- Tech stack with consistent colors -->
									<div class="flex flex-wrap gap-2 mb-4">
										<span
											v-for="tech in project.tech.slice(0, 3)"
											:key="tech"
											class="tech-badge px-3 py-1 text-xs rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105"
											:class="getTechColor(tech)"
										>
											{{ tech }}
										</span>
										<span v-if="project.tech.length > 3" class="px-3 py-1 text-xs text-gray-500">
											+{{ project.tech.length - 3 }}
										</span>
									</div>
									
									<!-- Interactive footer -->
									<div class="flex items-center justify-between pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
										<div class="flex items-center space-x-2">
											<div 
												class="w-2 h-2 rounded-full animate-pulse"
												:class="getStatusColor(project.status).dot"
											></div>
											<span 
												class="text-xs"
												:class="getStatusColor(project.status).text"
											>
												{{ t(`projects.status.${project.status || 'active'}`) }}
											</span>
										</div>
										<div class="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/30 transition-all duration-300">
											<span class="text-xs font-mono text-white/70 group-hover:text-indigo-300">#{{ String(index + 1).padStart(2, '0') }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Project Details Modal avec style glassmorphism moderne -->
		<div
			v-if="projectsStore.selectedProject"
			class="fixed inset-0 z-50 flex items-center justify-center p-4"
		>
			<div ref="modalBackdropRef" class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="closeProject"></div>

			<div
				ref="projectDetailsRef"
				class="project-details relative max-w-5xl w-full mx-auto max-h-[90vh] overflow-hidden rounded-3xl"
			>
				<!-- Glassmorphism background -->
				<div class="absolute inset-0 bg-gray-900/90 backdrop-blur-xl"></div>
				<div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
				
				<!-- Border glow effect -->
				<div class="absolute inset-0 rounded-3xl border border-indigo-500/20"></div>
				
				<!-- Content -->
				<div class="relative z-10 p-8 overflow-y-auto max-h-[90vh]">
					<!-- Header -->
					<div class="flex justify-between items-start mb-8">
						<div>
							<h2 class="text-4xl font-bold mb-2">
								<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
									{{ projectsStore.selectedProject.title }}
								</span>
							</h2>
							<div class="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
						</div>
						<button
							@click="closeProject"
							class="text-gray-400 hover:text-white transition-all duration-300 p-3 rounded-full hover:bg-indigo-500/20 hover:rotate-90 transform"
							aria-label="Close project details"
						>
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<!-- Main content -->
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						<!-- Left column - Image and tech -->
						<div class="space-y-6">
							<div 
								class="relative rounded-2xl overflow-hidden"
								@mousemove="handleMouseMove"
								@mouseleave="handleMouseLeave"
							>
								<img
									ref="projectImageRef"
									:src="projectsStore.selectedProject.image"
									:alt="projectsStore.selectedProject.title"
									class="w-full rounded-2xl aspect-video object-cover transition-transform duration-200 ease-out"
									style="transform-style: preserve-3d; will-change: transform;"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent pointer-events-none"></div>
							</div>
							
							<!-- Tech stack with consistent colors -->
							<div>
								<h3 class="text-sm font-semibold text-indigo-300 mb-3 uppercase tracking-wider">Technologies Used</h3>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="tech in projectsStore.selectedProject.tech"
										:key="tech"
										class="px-4 py-2 text-sm rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105 transform"
										:class="getTechColor(tech)"
									>
										{{ tech }}
									</span>
								</div>
							</div>
							
							<!-- Project Status -->
							<div>
								<h3 class="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">Project Status</h3>
								<div class="flex items-center space-x-3">
									<div 
										class="w-3 h-3 rounded-full animate-pulse"
										:class="getStatusColor(projectsStore.selectedProject.status).dot"
									></div>
									<span 
										class="text-base font-medium"
										:class="getStatusColor(projectsStore.selectedProject.status).text"
									>
										{{ t(`projects.status.${projectsStore.selectedProject.status || 'active'}`) }}
									</span>
								</div>
							</div>
						</div>

						<!-- Right column - Description -->
						<div class="space-y-6">
							<div>
								<h3 class="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">Project Overview</h3>
								<p class="text-gray-300 text-base leading-relaxed">
									{{ projectsStore.selectedProject.longDescription }}
								</p>
							</div>
						</div>
					</div>

					<!-- Actions with modern buttons -->
					<div class="flex flex-wrap gap-4 pt-6 border-t border-indigo-500/20">
						<a
							v-if="projectsStore.selectedProject.liveUrl"
							:href="projectsStore.selectedProject.liveUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="group relative inline-flex items-center px-6 py-3 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
						>
							<span class="relative z-10 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
									<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
								</svg>
								{{ t('projects.viewLiveDemo') }}
							</span>
							<div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full"></div>
						</a>
						
						<a
							v-if="projectsStore.selectedProject.sourceUrl"
							:href="projectsStore.selectedProject.sourceUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-600 text-gray-300 font-medium transition-all duration-300 hover:border-indigo-500 hover:text-indigo-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
							{{ t('projects.viewSource') }}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.project-card {
	animation: fadeInUp 0.6s ease-out forwards;
	cursor: pointer;
}

/* Glow effect animation */
.card-glow {
	background-size: 200% 200%;
	animation: gradient-animation 3s ease infinite;
}

@keyframes gradient-animation {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

/* Animated gradient shift for image overlay */
@keyframes gradient-shift {
	0%, 100% {
		opacity: 0.3;
		transform: translateX(0);
	}
	50% {
		opacity: 0.5;
		transform: translateX(10px);
	}
}

.animate-gradient-shift {
	animation: gradient-shift 8s ease-in-out infinite;
}

/* Tech badge hover animation */
.tech-badge {
	transform: translateY(0);
}

.group:hover .tech-badge {
	animation: float-badge 0.5s ease forwards;
}

@keyframes float-badge {
	to {
		transform: translateY(-2px);
	}
}

/* Card container hover effects */
.card-container {
	transform-style: preserve-3d;
	perspective: 1000px;
}

.card-content {
	transform: translateZ(0);
	will-change: transform;
}

/* Smooth hover lift */
.group:hover .card-content {
	transform: translateZ(20px);
}

.delay-1000 {
	animation-delay: 1s;
}

.project-details {
	transform-origin: center center;
}

/* Configuration de la grille de projets avec scrolling */
.projects-grid {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 2rem;
	padding: 0.25rem 0.25rem;
	height: auto;
	max-height: 60vh; /* Hauteur fixe pour forcer l'apparition du scroll */
	overflow-y: auto;
}

@media (min-width: 768px) {
	.projects-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.projects-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

/* Amélioration des styles de scrollbar pour la grille de projets */
.projects-grid {
	scrollbar-width: thin;
	scrollbar-color: rgba(99, 102, 241, 0.3) rgba(30, 41, 59, 0.5);
}

.projects-grid::-webkit-scrollbar {
	width: 10px; /* Scrollbar plus large pour être plus visible */
}

.projects-grid::-webkit-scrollbar-track {
	background: rgba(30, 41, 59, 0.5);
	border-radius: 4px;
}

.projects-grid::-webkit-scrollbar-thumb {
	background: rgba(99, 102, 241, 0.3);
	border-radius: 4px;
	border: 1px solid rgba(30, 41, 59, 0.5);
}

.projects-grid::-webkit-scrollbar-thumb:hover {
	background: rgba(99, 102, 241, 0.5);
}

.input {
	font-size: 1rem;
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(99, 102, 241, 0.2);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.input:focus {
	border-color: rgba(99, 102, 241, 0.5);
	box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}
</style>
