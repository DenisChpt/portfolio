import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '@/types/project'
import { PROJECTS } from '@/constants/projects'

/**
 * Store for project management
 */
export const useProjectsStore = defineStore('projects', () => {
	// State
	const projects = ref<Project[]>(PROJECTS)
	const selectedProjectId = ref<number | null>(null)
	const filterTech = ref<string | null>(null)
	const searchQuery = ref('')

	// Computed
	const selectedProject = computed(() => {
		if (selectedProjectId.value === null) return null
		return projects.value.find((project) => project.id === selectedProjectId.value) || null
	})

	const filteredProjects = computed(() => {
		let result = projects.value

		// Apply tech filter if active
		if (filterTech.value) {
			result = result.filter((project) => project.tech.includes(filterTech.value!))
		}

		// Apply search filter if there's a query
		if (searchQuery.value.trim()) {
			const query = searchQuery.value.toLowerCase().trim()
			result = result.filter(
				(project) =>
					project.title.toLowerCase().includes(query) ||
					project.description.toLowerCase().includes(query) ||
					project.tech.some((tech) => tech.toLowerCase().includes(query))
			)
		}

		return result
	})

	const featuredProjects = computed(() => {
		return projects.value.filter((project) => project.featured)
	})

	// Get all unique technologies used across projects
	const allTechnologies = computed(() => {
		const techSet = new Set<string>()

		projects.value.forEach((project) => {
			project.tech.forEach((tech) => {
				techSet.add(tech)
			})
		})

		return Array.from(techSet).sort()
	})

	// Actions
	const selectProject = (id: number | null) => {
		selectedProjectId.value = id
	}

	const setTechFilter = (tech: string | null) => {
		filterTech.value = tech
	}

	const setSearchQuery = (query: string) => {
		searchQuery.value = query
	}

	const clearFilters = () => {
		filterTech.value = null
		searchQuery.value = ''
	}

	return {
		projects,
		selectedProjectId,
		filterTech,
		searchQuery,
		selectedProject,
		filteredProjects,
		featuredProjects,
		allTechnologies,
		selectProject,
		setTechFilter,
		setSearchQuery,
		clearFilters,
	}
})
