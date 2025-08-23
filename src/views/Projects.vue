<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { useProjectsStore } from '@/stores/projectsStore'
import Card from '@/components/Card.vue'
import Button from '@/components/Button.vue'

const { t } = useI18n()
const projectsStore = useProjectsStore()

// Références pour l'animation
const headerRef = ref(null)
const filtersRef = ref(null)
const projectsGridRef = ref(null)
const cardRef = ref(null)

// Variable pour contrôler la visibilité initiale
const contentReady = ref(false)

// Search and filters
const searchQuery = ref('')
const selectedTech = ref<string | null>(null)
const isFiltering = ref(false)

// Référence pour le modal
const projectDetailsRef = ref(null)

// Handle filtering
const handleSearch = () => {
	isFiltering.value = true
	projectsStore.setSearchQuery(searchQuery.value)
}

const handleTechFilter = async (tech: string | null) => {
	isFiltering.value = true

	// Si on clique sur la techno déjà sélectionnée, on la désélectionne
	const newTech = tech === selectedTech.value ? null : tech

	// Mettre à jour l'état de sélection
	selectedTech.value = newTech

	// Mettre à jour le filtre dans le store
	projectsStore.setTechFilter(newTech)

	// Permettre au DOM de se mettre à jour avant d'animer
	await nextTick()

	// Animation des éléments filtrés
	animateFilteredProjects()
}

const clearFilters = async () => {
	isFiltering.value = true
	searchQuery.value = ''
	selectedTech.value = null
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

	// Animer l'apparition du modal
	if (projectDetailsRef.value) {
		gsap.fromTo(
			projectDetailsRef.value,
			{
				opacity: 0,
				scale: 0.95,
				y: 20,
			},
			{
				opacity: 1,
				scale: 1,
				y: 0,
				duration: 0.5,
				ease: 'back.out(1.3)',
			}
		)
	}
}

const closeProject = () => {
	// Animer la disparition du modal
	if (projectDetailsRef.value) {
		gsap.to(projectDetailsRef.value, {
			opacity: 0,
			scale: 0.95,
			y: -20,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => projectsStore.selectProject(null),
		})
	} else {
		projectsStore.selectProject(null)
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
	<div class="min-h-screen pt-24 pb-16">
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
					class="mb-8 flex flex-wrap gap-6 items-center"
					:style="{ opacity: 0 }"
				>
					<div class="flex-1 min-w-[250px]">
						<div class="relative">
							<input
								v-model="searchQuery"
								@input="handleSearch"
								type="text"
								placeholder="Search projects..."
								class="input pr-10 text-base py-3"
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

					<div class="flex flex-wrap gap-3">
						<button
							v-for="tech in projectsStore.allTechnologies"
							:key="tech"
							@click="handleTechFilter(tech)"
							class="px-4 py-2 text-sm rounded-full border transition-all duration-300"
							:class="
								tech === selectedTech
									? 'bg-indigo-500/40 text-indigo-200 border-indigo-500 shadow-lg shadow-indigo-900/20'
									: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20'
							"
						>
							{{ tech }}
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
						class="project-card group relative"
						ref="cardRef"
						@click="openProject(project.id)"
						:style="{ opacity: 0, animationDelay: `${index * 0.1}s` }"
					>
						<div class="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 cursor-pointer">
							<!-- Project Image with advanced overlay -->
							<div class="relative h-56 overflow-hidden">
								<div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 z-10"></div>
								<img
									:src="project.image"
									:alt="project.title"
									class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 z-20"></div>
								
								<!-- Hover overlay with icon -->
								<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-30">
									<div class="transform scale-0 group-hover:scale-100 transition-transform duration-500">
										<div class="p-4 bg-indigo-500/20 backdrop-blur-sm rounded-full border-2 border-indigo-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-8 w-8 text-indigo-300"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</div>
									</div>
								</div>
								
							</div>
							
							<!-- Content -->
							<div class="p-6">
								<h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">
									{{ project.title }}
								</h3>
								<p class="text-gray-400 text-sm mb-4 line-clamp-3">
									{{ project.description }}
								</p>
								
								<!-- Tech badges -->
								<div class="flex flex-wrap gap-2 mb-4">
									<span
										v-for="tech in project.tech"
										:key="tech"
										class="px-3 py-1 text-xs bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20 backdrop-blur-sm"
									>
										{{ tech }}
									</span>
								</div>
								
								<!-- View project link -->
								<div class="flex items-center justify-between">
									<span class="text-indigo-400 font-medium text-sm group-hover:text-indigo-300 transition-colors duration-300">
										{{ t('projects.viewProject') }}
									</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-indigo-400 transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-indigo-300"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Project Details Modal avec transitions améliorées -->
		<div
			v-if="projectsStore.selectedProject"
			class="fixed inset-0 z-50 flex items-center justify-center p-4"
		>
			<div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="closeProject"></div>

			<div
				ref="projectDetailsRef"
				class="project-details max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto z-10"
			>
				<Card :title="`project.${projectsStore.selectedProject.id}`" variant="window">
					<div class="flex justify-between items-start mb-8">
						<h2 class="text-3xl font-bold gradient-text">
							{{ projectsStore.selectedProject.title }}
						</h2>
						<button
							@click="closeProject"
							class="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-indigo-500/10"
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

					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						<div class="space-y-6">
							<div class="relative rounded-lg overflow-hidden shadow-xl shadow-indigo-900/20">
								<img
									:src="projectsStore.selectedProject.image"
									:alt="projectsStore.selectedProject.title"
									class="w-full rounded-lg aspect-video object-cover"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
								></div>
							</div>
							<div class="flex flex-wrap gap-3">
								<span
									v-for="tech in projectsStore.selectedProject.tech"
									:key="tech"
									class="px-3 py-1.5 text-base bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20 hover:bg-primary-500/20 transition-colors duration-300"
								>
									{{ tech }}
								</span>
							</div>
						</div>

						<div class="space-y-6">
							<p class="text-gray-200 text-lg leading-relaxed">
								{{ projectsStore.selectedProject.longDescription }}
							</p>

							<div class="grid grid-cols-2 gap-4">
								<div
									v-for="(image, index) in projectsStore.selectedProject.gallery.slice(0, 4)"
									:key="index"
									class="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									<img
										:src="image"
										:alt="`${projectsStore.selectedProject.title} gallery ${index + 1}`"
										class="w-full rounded-lg aspect-video object-cover"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="flex justify-end space-x-5 pt-4 border-t border-indigo-500/20">
						<Button
							v-if="projectsStore.selectedProject.liveUrl"
							:href="projectsStore.selectedProject.liveUrl"
							external
							variant="primary"
							size="lg"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
									clip-rule="evenodd"
								/>
							</svg>
							{{ t('projects.viewLiveDemo') }}
						</Button>
						<Button
							v-if="projectsStore.selectedProject.sourceUrl"
							:href="projectsStore.selectedProject.sourceUrl"
							external
							variant="outline"
							size="lg"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
							{{ t('projects.viewSource') }}
						</Button>
					</div>
				</Card>
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
}

.delay-1000 {
	animation-delay: 1s;
}

@keyframes shine {
	0% {
		background-position: 0% 50%;
	}
	100% {
		background-position: 200% 50%;
	}
}

@keyframes shine {
	to {
		background-position: 200% center;
	}
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
