import type { Project } from '@/types/project'

/**
 * List of projects to display in the portfolio
 */
export const PROJECTS: Project[] = [
	{
		id: 1,
		title: 'E-commerce Platform',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
		longDescription:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		tech: ['Vue', 'Node.js', 'MongoDB'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		liveUrl: 'https://example.com',
		sourceUrl: 'https://github.com',
		featured: true,
	},
	{
		id: 2,
		title: 'Social Media Dashboard',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		longDescription:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
		tech: ['React', 'GraphQL', 'PostgreSQL'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		liveUrl: 'https://example.com',
		sourceUrl: 'https://github.com',
	},
	{
		id: 3,
		title: 'AI-Powered Analytics',
		description:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		longDescription:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		tech: ['Python', 'TensorFlow', 'Flask'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		featured: true,
	},
	{
		id: 4,
		title: 'Mobile Fitness App',
		description:
			'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		longDescription:
			'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		tech: ['React Native', 'Firebase', 'Redux'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 5,
		title: 'Smart Home IoT Platform',
		description:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
		longDescription:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
		tech: ['Angular', 'Node.js', 'MongoDB'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 6,
		title: 'Blockchain Wallet',
		description:
			'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
		longDescription:
			'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		tech: ['Web3.js', 'React', 'Solidity'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
]

/**
 * Filter projects by technology
 */
export function filterProjectsByTech(projects: Project[], tech: string): Project[] {
	return projects.filter((project) => project.tech.includes(tech))
}

/**
 * Get featured projects
 */
export function getFeaturedProjects(projects: Project[]): Project[] {
	return projects.filter((project) => project.featured)
}
