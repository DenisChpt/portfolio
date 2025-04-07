<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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

// Search and filters
const searchQuery = ref('')
const selectedTech = ref(null)

// Référence pour le modal
const projectDetailsRef = ref(null)

// Handle filtering
const handleSearch = () => {
	projectsStore.setSearchQuery(searchQuery.value)
}

const handleTechFilter = (tech) => {
	projectsStore.setTechFilter(tech === selectedTech.value ? null : tech)
	selectedTech.value = tech === selectedTech.value ? null : tech
}

const clearFilters = () => {
	searchQuery.value = ''
	selectedTech.value = null
	projectsStore.clearFilters()
}

// Open and close project details
const openProject = (id) => {
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

	// Grille de projets
	tl.fromTo(
		'.project-card',
		{ y: 30, opacity: 0, scale: 0.95 },
		{
			y: 0,
			opacity: 1,
			scale: 1,
			duration: 0.7,
			stagger: 0.1,
			clearProps: 'transform,opacity',
		},
		0.7
	)
}

onMounted(() => {
	// Animation à l'entrée
	setTimeout(() => {
		animateProjects()
	}, 200)
})

// Réanimer la grille quand les filtres changent
watch(
	() => projectsStore.filteredProjects,
	() => {
		gsap.fromTo(
			'.project-card',
			{ opacity: 0, y: 20, scale: 0.95 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.5,
				stagger: 0.05,
				clearProps: 'transform,opacity',
			}
		)
	},
	{ deep: true }
)
</script>

<template>
	<div class="section min-h-screen flex items-center justify-center pt-32 pb-16">
		<div class="projects-window max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
			<Card title="portfolio.projects" variant="window" :fullHeight="true">
				<div ref="headerRef" class="mb-12">
					<h1 class="text-4xl md:text-5xl font-bold gradient-text mb-6">
						{{ t('projects.title') }}
					</h1>
					<p class="text-xl text-gray-300 max-w-3xl">
						{{ t('projects.description') }}
					</p>
				</div>

				<!-- Search and filter -->
				<div ref="filtersRef" class="mb-10 flex flex-wrap gap-6 items-center">
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

				<!-- Projects grid -->
				<div
					v-else
					ref="projectsGridRef"
					class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto max-h-[calc(100vh-20rem)] px-1 py-2"
				>
					<div
						v-for="project in projectsStore.filteredProjects"
						:key="project.id"
						class="project-card cursor-pointer group"
						@click="openProject(project.id)"
					>
						<Card hover>
							<div
								class="relative overflow-hidden rounded-lg mb-5 aspect-video shadow-lg shadow-indigo-900/20"
							>
								<img
									:src="project.image"
									:alt="project.title"
									class="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6"
								>
									<div
										class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
									>
										<div class="text-white text-lg font-medium mb-2">View Project</div>
										<p class="text-indigo-200 text-sm">
											{{ project.description.substring(0, 80) }}...
										</p>
									</div>
								</div>
							</div>
							<h3 class="text-xl font-medium text-white mb-3">
								{{ project.title }}
							</h3>
							<p class="text-gray-300 text-base mb-5 line-clamp-2">
								{{ project.description }}
							</p>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="tech in project.tech"
									:key="tech"
									class="px-3 py-1 text-sm bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
								>
									{{ tech }}
								</span>
							</div>
						</Card>
					</div>
				</div>
			</Card>
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
							View Live Demo
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
							View Source
						</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>

<style scoped>
.gradient-text {
	background: linear-gradient(to right, rgb(129, 140, 248), rgb(165, 180, 252), rgb(129, 140, 248));
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	background-size: 200% auto;
	animation: shine 8s linear infinite;
}

@keyframes shine {
	to {
		background-position: 200% center;
	}
}

.project-details {
	transform-origin: center center;
}

/* Personnalisation de la scrollbar pour la grille de projets */
.projects-grid::-webkit-scrollbar {
	width: 6px;
}

.projects-grid::-webkit-scrollbar-track {
	background: rgba(30, 41, 59, 0.5);
	border-radius: 3px;
}

.projects-grid::-webkit-scrollbar-thumb {
	background: rgba(99, 102, 241, 0.3);
	border-radius: 3px;
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
