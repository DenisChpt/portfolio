export type ProjectStatus = 'active' | 'completed' | 'in-progress' | 'archived' | 'maintenance'

export interface Project {
	id: number
	title: string
	description: string
	longDescription: string
	tech: string[]
	image: string
liveUrl?: string
	sourceUrl?: string
	featured?: boolean
	status?: ProjectStatus
}

export interface Skill {
	name: string
	level?: number
	category?: 'frontend' | 'backend' | 'database' | 'devops' | 'other'
	icon?: string
}

export interface Experience {
	company: string
	role: string
	period: string
	description: string
	highlights?: string[]
	technologies?: string[]
}

export interface Education {
	institution: string
	degree: string
	period: string
	description: string
}

export interface ContactForm {
	name: string
	email: string
	message: string
}

export interface ProjectI18nItem {
	id: number
	title: string
	description: string
	longDescription: string
}
