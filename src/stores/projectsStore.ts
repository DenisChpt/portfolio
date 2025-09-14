import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types/project'
import { PROJECTS_METADATA } from '@/constants/projects'

/**
 * Store for project management
 * Combines metadata from constants with text content from i18n
 */
export const useProjectsStore = defineStore('projects', () => {
	const { tm, locale } = useI18n()

	// State - with session persistence for filters
	const selectedProjectId = ref<number | null>(null)
	
	// Load persisted filters from sessionStorage
	const savedFilterTechs = sessionStorage.getItem('projectFilterTechs')
	const savedSearchQuery = sessionStorage.getItem('projectSearchQuery')
	
	const filterTechs = ref<string[]>(savedFilterTechs ? JSON.parse(savedFilterTechs) : [])
	const searchQuery = ref(savedSearchQuery || '')

	/**
	 * Combine metadata with i18n translations to create full project objects
	 */
	const projects = computed((): Project[] => {
		// Force reactivity on locale change
		locale.value
		
		const projectItems = tm('projects.items') as any[]
		if (!Array.isArray(projectItems)) return []
		
		return PROJECTS_METADATA.map(metadata => {
			const projectText = projectItems.find(item => item.id === metadata.id)
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

	const setFilterTechs = (techs: string[]) => {
		filterTechs.value = techs
		// Persist to sessionStorage
		sessionStorage.setItem('projectFilterTechs', JSON.stringify(techs))
	}
	
	// Alias for backward compatibility
	const setMultipleTechFilters = setFilterTechs

	const setSearchQuery = (query: string) => {
		searchQuery.value = query
		// Persist to sessionStorage
		sessionStorage.setItem('projectSearchQuery', query)
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