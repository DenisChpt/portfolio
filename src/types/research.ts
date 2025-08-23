/**
 * Research paper interface
 */
export interface ResearchPaper {
	id: number
	title: string
	authors: string[]
	abstract: string
	publicationDate: string
	journal?: string
	conference?: string
	doi?: string
	pdfUrl?: string
	arxivUrl?: string
	topics: string[]
	citations?: number
	featured?: boolean
}

/**
 * Research category type
 */
export type ResearchCategory = 'optimization' | 'machine-learning' | 'distributed-systems' | 'security' | 'all'