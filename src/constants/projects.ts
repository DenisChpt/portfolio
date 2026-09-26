/**
 * Project metadata and configuration
 * Text content is managed through i18n translations
 */

export interface ProjectMetadata {
	id: number
	tech: string[]
	image: string
sourceUrl?: string
	liveUrl?: string
	featured?: boolean
	status: 'active' | 'completed' | 'in-progress' | 'archived' | 'maintenance'
}

/**
 * Technologies that stay on project cards but are not offered as filters
 */
export const HIDDEN_FILTER_TECHS: string[] = ['OpenGL']

/**
 * Project metadata - text content comes from i18n
 */
export const PROJECTS_METADATA: ProjectMetadata[] = [
	{
		id: 8,
		tech: ['Rust', 'C++', 'Maths'],
		image: '/images/Fluxion_logo.webp',
		sourceUrl: 'https://github.com/DenisChpt/fluxion',
		featured: true,
		status: 'in-progress',
	},
	{
		id: 5,
		tech: ['Rust', 'Python', 'Maths'],
		image: '/images/Synaplex_logo.webp',
		sourceUrl: 'https://github.com/DenisChpt/synaplex',
		featured: true,
		status: 'active',
	},
	{
		id: 2,
		tech: ['Rust', 'Python', 'Maths'],
		image: '/images/RiemannOpt_logo.webp',
		sourceUrl: 'https://github.com/DenisChpt/RiemannOpt',
		featured: true,
		status: 'active',
	},
	{
		id: 4,
		tech: ['Python', 'Docker', 'GitLab CI'],
		image: '/images/Thales_logo.webp',
		status: 'completed',
	},
	{
		id: 1,
		tech: ['Python', 'Jenkins', 'GitLab CI'],
		image: '/images/Thales_logo.webp',
		status: 'completed',
	},
	{
		id: 3,
		tech: ['C++', 'OpenGL'],
		image: '/images/MinePP_logo.webp',
		sourceUrl: 'https://github.com/DenisChpt/MinePP',
		status: 'archived',
	},
	{
		id: 6,
		tech: ['Vue.js', 'TypeScript'],
		image: '/images/Portfolio_logo.webp',
		sourceUrl: 'https://github.com/DenisChpt/portfolio',
		liveUrl: '/videos/portfolio.mp4',  // Video demo of the portfolio
		status: 'active',
	},
]
