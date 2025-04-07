<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageAnimation, useStaggeredAnimation } from '@/composables/useAnimation'
import { useProjectsStore } from '@/stores/projectsStore'
import Card from '@/components/Card.vue'
import Button from '@/components/Button.vue'

const { t } = useI18n()
const projectsStore = useProjectsStore()

// Search and filters
const searchQuery = ref('')
const selectedTech = ref(null)

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
}

const closeProject = () => {
	projectsStore.selectProject(null)
}

// Use our animation composables
usePageAnimation('.projects-window', 0.2)
useStaggeredAnimation('.project-card', { delay: 0.6 })
</script>

<template>
	<div class="section flex items-center justify-center pt-24 pb-16">
		<div class="projects-window max-w-6xl w-full mx-auto">
			<Card title="portfolio.projects" variant="window" :fullHeight="true">
				<div class="mb-8">
					<h1 class="text-3xl font-bold gradient-text mb-4">
						{{ t('projects.title') }}
					</h1>
					<p class="text-gray-300">
						{{ t('projects.description') }}
					</p>
				</div>

				<!-- Search and filter -->
				<div class="mb-6 flex flex-wrap gap-4 items-center">
					<div class="flex-1 min-w-[250px]">
						<div class="relative">
							<input
								v-model="searchQuery"
								@input="handleSearch"
								type="text"
								placeholder="Search projects..."
								class="input pr-10"
							/>
							<button
								v-if="searchQuery"
								@click="clearFilters"
								class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
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

					<div class="flex flex-wrap gap-2">
						<button
							v-for="tech in projectsStore.allTechnologies"
							:key="tech"
							@click="handleTechFilter(tech)"
							class="px-3 py-1 text-sm rounded-full border transition-colors duration-200"
							:class="
								tech === selectedTech
									? 'bg-indigo-500/30 text-indigo-200 border-indigo-500'
									: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20'
							"
						>
							{{ tech }}
						</button>
					</div>
				</div>

				<!-- No results message -->
				<div v-if="projectsStore.filteredProjects.length === 0" class="text-center py-12">
					<p class="text-gray-400 mb-4">No projects found matching your criteria.</p>
					<Button @click="clearFilters" variant="outline" size="sm">Clear Filters</Button>
				</div>

				<!-- Projects grid -->
				<div
					v-else
					class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-20rem)]"
				>
					<div
						v-for="project in projectsStore.filteredProjects"
						:key="project.id"
						class="project-card cursor-pointer group"
						@click="openProject(project.id)"
					>
						<Card hover>
							<div class="relative overflow-hidden rounded-lg mb-4 aspect-video">
								<img
									:src="project.image"
									:alt="project.title"
									class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
								>
									<div class="text-white text-sm font-medium">View Project</div>
								</div>
							</div>
							<h3 class="text-lg font-medium text-white mb-2">
								{{ project.title }}
							</h3>
							<p class="text-gray-400 text-sm mb-4 line-clamp-2">
								{{ project.description }}
							</p>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="tech in project.tech"
									:key="tech"
									class="px-2 py-1 text-xs bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
								>
									{{ tech }}
								</span>
							</div>
						</Card>
					</div>
				</div>
			</Card>
		</div>

		<!-- Project Details Modal -->
		<div
			v-if="projectsStore.selectedProject"
			class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
			@click.self="closeProject"
		>
			<div
				class="project-details max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto opacity-0 scale-95"
			>
				<Card :title="`project.${projectsStore.selectedProject.id}`" variant="window">
					<div class="flex justify-between items-start mb-6">
						<h2 class="text-3xl font-bold gradient-text">
							{{ projectsStore.selectedProject.title }}
						</h2>
						<button
							@click="closeProject"
							class="text-gray-400 hover:text-white transition-colors duration-200"
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

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div class="space-y-4">
							<img
								:src="projectsStore.selectedProject.image"
								:alt="projectsStore.selectedProject.title"
								class="w-full rounded-lg shadow-lg aspect-video object-cover"
							/>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="tech in projectsStore.selectedProject.tech"
									:key="tech"
									class="px-3 py-1 text-sm bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
								>
									{{ tech }}
								</span>
							</div>
						</div>

						<div class="space-y-4">
							<p class="text-gray-300">
								{{ projectsStore.selectedProject.longDescription }}
							</p>

							<div class="grid grid-cols-2 gap-4">
								<img
									v-for="(image, index) in projectsStore.selectedProject.gallery.slice(0, 4)"
									:key="index"
									:src="image"
									:alt="`${projectsStore.selectedProject.title} gallery ${index + 1}`"
									class="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 aspect-video object-cover"
								/>
							</div>
						</div>
					</div>

					<div class="flex justify-end space-x-4">
						<Button
							v-if="projectsStore.selectedProject.liveUrl"
							:href="projectsStore.selectedProject.liveUrl"
							external
							variant="primary"
						>
							View Live Demo
						</Button>
						<Button
							v-if="projectsStore.selectedProject.sourceUrl"
							:href="projectsStore.selectedProject.sourceUrl"
							external
							variant="outline"
						>
							View Source
						</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>

<style scoped>
.project-details {
	transform-origin: center center;
}
</style>
