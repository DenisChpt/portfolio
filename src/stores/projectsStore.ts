import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project, ProjectI18nItem } from '@/types/project'
import { PROJECTS_METADATA } from '@/constants/projects'
import { STORAGE_KEYS } from '@/constants/app.constants'

const getSavedFilterTechs = (): string[] => {
	try {
		const saved = sessionStorage.getItem(STORAGE_KEYS.PROJECT_FILTERS)
		return saved ? JSON.parse(saved) : []
	} catch {
		return []
	}
}

const getSavedSearchQuery = (): string => {
	try {
		return sessionStorage.getItem(STORAGE_KEYS.PROJECT_SEARCH) || ''
	} catch {
		return ''
	}
}

export const useProjectsStore = defineStore('projects', () => {
	const { tm } = useI18n()

	const selectedProjectId = ref<number | null>(null)
	const filterTechs = ref<string[]>(getSavedFilterTechs())
	const searchQuery = ref(getSavedSearchQuery())

	const projects = computed((): Project[] => {
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
				sourceUrl: metadata.sourceUrl,
				liveUrl: metadata.liveUrl,
				featured: metadata.featured,
				status: metadata.status,
			} as Project
		}).filter(Boolean) as Project[]
	})

	const selectedProject = computed(() => {
		if (selectedProjectId.value === null) return null
		return projects.value.find((p) => p.id === selectedProjectId.value) || null
	})

	const filteredProjects = computed(() => {
		let result = [...projects.value]

		if (filterTechs.value.length > 0) {
			result = result.filter((project) =>
				filterTechs.value.some((tech) => project.tech.includes(tech))
			)
		}

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

	const allTechnologies = (() => {
		const techSet = new Set<string>()
		PROJECTS_METADATA.forEach((project) => {
			project.tech.forEach((tech) => techSet.add(tech))
		})
		return Array.from(techSet).sort()
	})()

	const setSelectedProject = (projectId: number | null) => {
		selectedProjectId.value = projectId
	}

	const setFilterTechs = (techs: string[]) => {
		filterTechs.value = techs
		try {
			sessionStorage.setItem(STORAGE_KEYS.PROJECT_FILTERS, JSON.stringify(techs))
		} catch { /* sessionStorage unavailable */ }
	}

	const setSearchQuery = (query: string) => {
		searchQuery.value = query
		try {
			sessionStorage.setItem(STORAGE_KEYS.PROJECT_SEARCH, query)
		} catch { /* sessionStorage unavailable */ }
	}

	const clearFilters = () => {
		filterTechs.value = []
		searchQuery.value = ''
		sessionStorage.removeItem(STORAGE_KEYS.PROJECT_FILTERS)
		sessionStorage.removeItem(STORAGE_KEYS.PROJECT_SEARCH)
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
		setSelectedProject,
		setFilterTechs,
		setSearchQuery,
		clearFilters,
	}
})
