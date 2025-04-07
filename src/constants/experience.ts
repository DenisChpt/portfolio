import type { Experience, Education, Skill } from '@/types/project'

/**
 * Professional experience entries
 */
export const EXPERIENCES: Experience[] = [
	{
		company: 'TechCorp',
		role: 'Senior Developer',
		period: '2019 - Present',
		description: 'Led development of multiple web applications using Vue.js and Node.js.',
		technologies: ['Vue.js', 'Node.js', 'MongoDB', 'GraphQL'],
		highlights: [
			'Led a team of 5 developers',
			'Implemented CI/CD pipelines',
			'Reduced page load time by 40%',
		],
		opacity: 1,
	},
	{
		company: 'WebSolutions',
		role: 'Frontend Developer',
		period: '2016 - 2019',
		description: 'Developed responsive and interactive UI components for client projects.',
		technologies: ['React', 'Redux', 'TypeScript', 'SASS'],
		highlights: [
			'Built reusable component library',
			'Improved accessibility compliance',
			'Mentored junior developers',
		],
		opacity: 0.9,
	},
	{
		company: 'StartupX',
		role: 'Junior Developer',
		period: '2014 - 2016',
		description: 'Built and maintained frontend features for a SaaS product.',
		technologies: ['JavaScript', 'jQuery', 'CSS3', 'HTML5'],
		highlights: [
			'Implemented responsive designs',
			'Created data visualization dashboards',
			'Fixed critical performance issues',
		],
		opacity: 0.8,
	},
]

/**
 * Education entries
 */
export const EDUCATION: Education[] = [
	{
		institution: 'Tech University',
		degree: 'M.S. Computer Science',
		period: '2012 - 2014',
		description: 'Specialized in Web Technologies and Software Engineering',
	},
	{
		institution: 'State College',
		degree: 'B.S. Computer Science',
		period: '2008 - 2012',
		description: 'Focus on programming fundamentals and algorithms',
	},
]

/**
 * Skills with proficiency levels
 */
export const SKILLS: Skill[] = [
	{ name: 'Vue.js', level: 95, category: 'frontend' },
	{ name: 'TypeScript', level: 90, category: 'frontend' },
	{ name: 'Node.js', level: 85, category: 'backend' },
	{ name: 'Express', level: 80, category: 'backend' },
	{ name: 'MongoDB', level: 75, category: 'database' },
	{ name: 'TailwindCSS', level: 95, category: 'frontend' },
	{ name: 'GraphQL', level: 70, category: 'backend' },
	{ name: 'React', level: 75, category: 'frontend' },
	{ name: 'Docker', level: 65, category: 'devops' },
	{ name: 'AWS', level: 60, category: 'devops' },
]

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: string): Skill[] {
	return SKILLS.filter((skill) => skill.category === category)
}
