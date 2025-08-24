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

	// State - with session persistence for filters
	const projects = ref<Project[]>(PROJECTS)
	const selectedProjectId = ref<number | null>(null)
	
	// Load persisted filters from sessionStorage
	const savedFilterTechs = sessionStorage.getItem('projectFilterTechs')
	const savedSearchQuery = sessionStorage.getItem('projectSearchQuery')
	
	const filterTechs = ref<string[]>(savedFilterTechs ? JSON.parse(savedFilterTechs) : [])
	const searchQuery = ref(savedSearchQuery || '')

	// Computed
	const selectedProject = computed(() => {
		// Force reactivity on locale change
		const currentLocale = locale.value
		
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
		// Force reactivity on locale change
		const currentLocale = locale.value
		
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
		// Force reactivity on locale change
		const currentLocale = locale.value
		
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
		// Save to sessionStorage
		sessionStorage.setItem('projectFilterTechs', JSON.stringify(techs))
	}

	const setSearchQuery = (query: string) => {
		searchQuery.value = query
		// Save to sessionStorage
		sessionStorage.setItem('projectSearchQuery', query)
	}

	const clearFilters = () => {
		filterTechs.value = []
		searchQuery.value = ''
		// Clear from sessionStorage
		sessionStorage.removeItem('projectFilterTechs')
		sessionStorage.removeItem('projectSearchQuery')
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
