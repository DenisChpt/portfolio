import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project, ProjectI18nItem } from '@/types/project'
import { PROJECTS_METADATA } from '@/constants/projects'

/**
 * Safely get saved filters from sessionStorage
 * @returns Saved filter technologies or empty array if error
 */
const getSavedFilterTechs = (): string[] => {
	try {
		const saved = sessionStorage.getItem('projectFilterTechs')
		return saved ? JSON.parse(saved) : []
	} catch (error) {
		return []
	}
}

/**
 * Safely get saved search query from sessionStorage
 * @returns Saved search query or empty string if error
 */
const getSavedSearchQuery = (): string => {
	try {
		return sessionStorage.getItem('projectSearchQuery') || ''
	} catch (error) {
		return ''
	}
}

/**
 * Store for project management
 * Combines metadata from constants with text content from i18n
 */
export const useProjectsStore = defineStore('projects', () => {
	const { tm, locale } = useI18n()

	// State - with session persistence for filters
	const selectedProjectId = ref<number | null>(null)

	// Load persisted filters from sessionStorage with error handling
	const filterTechs = ref<string[]>(getSavedFilterTechs())
	const searchQuery = ref(getSavedSearchQuery())

	/**
	 * Combine metadata with i18n translations to create full project objects
	 */
	const projects = computed((): Project[] => {
		// Force reactivity on locale change
		locale.value
		
		const projectItems = tm('projects.items') as ProjectI18nItem[]
		if (!Array.isArray(projectItems)) return []

		return PROJECTS_METADATA.map(metadata => {
			const projectText = projectItems.find((item: ProjectI18nItem) => item.id === metadata.id)
			if (!projectText) return null
			
			return {
				id: metadata.id,
				title: projectText.title || '',
				description: projectText.description || '',
				longDescription: projectText.longDescription || '',
				tech: metadata.tech,
				image: metadata.image,
				gallery: metadata.gallery,
				sourceUrl: metadata.sourceUrl,
				liveUrl: metadata.liveUrl,
				featured: metadata.featured,
				status: metadata.status,
			} as Project
		}).filter(Boolean) as Project[]
	})

	// Computed
	const selectedProject = computed(() => {
		if (selectedProjectId.value === null) return null
		return projects.value.find((project) => project.id === selectedProjectId.value) || null
	})

	const filteredProjects = computed(() => {
		let result = [...projects.value]

		// Filter by technologies
		if (filterTechs.value.length > 0) {
			result = result.filter((project) =>
				filterTechs.value.some((tech) => project.tech.includes(tech))
			)
		}

		// Filter by search query
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase()
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

	const getAllTechnologies = () => {
		const techSet = new Set<string>()
		projects.value.forEach((project) => {
			project.tech.forEach((tech) => techSet.add(tech))
		})
		return Array.from(techSet).sort()
	}

	// Actions
	const setSelectedProject = (projectId: number | null) => {
		selectedProjectId.value = projectId
	}
	
	// Alias for backward compatibility
	const selectProject = setSelectedProject

	/**
	 * Set filter technologies and persist to sessionStorage
	 * @param techs Array of technology names to filter by
	 */
	const setFilterTechs = (techs: string[]) => {
		filterTechs.value = techs
		// Persist to sessionStorage with error handling
		try {
			sessionStorage.setItem('projectFilterTechs', JSON.stringify(techs))
		} catch (error) {
			// Silently fail if sessionStorage is not available
		}
	}
	
	// Alias for backward compatibility
	const setMultipleTechFilters = setFilterTechs

	/**
	 * Set search query and persist to sessionStorage
	 * @param query Search query string
	 */
	const setSearchQuery = (query: string) => {
		searchQuery.value = query
		// Persist to sessionStorage with error handling
		try {
			sessionStorage.setItem('projectSearchQuery', query)
		} catch (error) {
			// Silently fail if sessionStorage is not available
		}
	}

	const clearFilters = () => {
		filterTechs.value = []
		searchQuery.value = ''
		// Clear sessionStorage
		sessionStorage.removeItem('projectFilterTechs')
		sessionStorage.removeItem('projectSearchQuery')
	}
	
	// Computed as getter
	const allTechnologies = computed(() => getAllTechnologies())

	return {
		// State
		projects,
		selectedProjectId,
		filterTechs,
		searchQuery,
		// Computed
		selectedProject,
		filteredProjects,
		featuredProjects,
		allTechnologies,
		// Actions
		setSelectedProject,
		selectProject,
		setFilterTechs,
		setMultipleTechFilters,
		setSearchQuery,
		clearFilters,
		getAllTechnologies,
	}
})