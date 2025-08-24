import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types/project'
import { PROJECTS } from '@/constants/projects'

/**
 * Store for project management
 */
export const useProjectsStore = defineStore('projects', () => {
	const { t, locale } = useI18n()

	// State
	const projects = ref<Project[]>(PROJECTS)
	const selectedProjectId = ref<number | null>(null)
	const filterTechs = ref<string[]>([])
	const searchQuery = ref('')

	// Computed
	const selectedProject = computed(() => {
		if (selectedProjectId.value === null) return null
		const project = projects.value.find((project) => project.id === selectedProjectId.value) || null

		if (!project) return null

		// Get translated versions
		const translatedTitle = t(`projects.items.${project.id - 1}.title`)
		const translatedDescription = t(`projects.items.${project.id - 1}.description`)
		const translatedLongDescription = t(`projects.items.${project.id - 1}.longDescription`)

		return {
			...project,
			title: translatedTitle,
			description: translatedDescription,
			longDescription: translatedLongDescription,
		}
	})

	const filteredProjects = computed(() => {
		let result = projects.value.map((project) => {
			// Get translated versions
			const translatedTitle = t(`projects.items.${project.id - 1}.title`)
			const translatedDescription = t(`projects.items.${project.id - 1}.description`)
			const translatedLongDescription = t(`projects.items.${project.id - 1}.longDescription`)

			return {
				...project,
				title: translatedTitle,
				description: translatedDescription,
				longDescription: translatedLongDescription,
			}
		})

		// Apply tech filters if active (project must have ANY of the selected techs)
		if (filterTechs.value.length > 0) {
			result = result.filter((project) => 
				filterTechs.value.some(tech => project.tech.includes(tech))
			)
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
		return projects.value
			.filter((project) => project.featured)
			.map((project) => {
				// Get translated versions
				const translatedTitle = t(`projects.items.${project.id - 1}.title`)
				const translatedDescription = t(`projects.items.${project.id - 1}.description`)
				const translatedLongDescription = t(`projects.items.${project.id - 1}.longDescription`)

				return {
					...project,
					title: translatedTitle,
					description: translatedDescription,
					longDescription: translatedLongDescription,
				}
			})
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

	const setMultipleTechFilters = (techs: string[]) => {
		filterTechs.value = techs
	}

	const setSearchQuery = (query: string) => {
		searchQuery.value = query
	}

	const clearFilters = () => {
		filterTechs.value = []
		searchQuery.value = ''
	}

	return {
		projects,
		selectedProjectId,
		filterTechs,
		searchQuery,
		selectedProject,
		filteredProjects,
		featuredProjects,
		allTechnologies,
		selectProject,
		setMultipleTechFilters,
		setSearchQuery,
		clearFilters,
	}
})
