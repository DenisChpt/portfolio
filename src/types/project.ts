/**
 * Project status types
 */
export type ProjectStatus = 'active' | 'completed' | 'in-progress' | 'archived' | 'maintenance'

/**
 * Represents a project in the portfolio
 */
export interface Project {
	id: number
	title: string
	description: string
	longDescription: string
	tech: string[]
	image: string
	gallery: string[]
	liveUrl?: string
	sourceUrl?: string
	featured?: boolean
	status?: ProjectStatus
}

/**
 * Represents a tech skill with optional proficiency level
 */
export interface Skill {
	name: string
	level?: number // 0-100
	category?: 'frontend' | 'backend' | 'database' | 'devops' | 'other'
	icon?: string
}

/**
 * Represents a work experience entry
 */
export interface Experience {
	company: string
	role: string
	period: string
	description: string
	highlights?: string[]
	technologies?: string[]
	opacity?: number // For UI display
}

/**
 * Represents an education entry
 */
export interface Education {
	institution: string
	degree: string
	period: string
	description: string
}

/**
 * Represents a contact form submission
 */
export interface ContactForm {
	name: string
	email: string
	message: string
}

/**
 * Represents a project item from i18n translations
 */
export interface ProjectI18nItem {
	id: number
	title: string
	description: string
	longDescription: string
}
