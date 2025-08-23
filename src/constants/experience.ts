import type { Experience, Education, Skill } from '@/types/project'

/**
 * Professional experience entries
 */
export const EXPERIENCES: Experience[] = [
	{
		company: 'Thales Land & Air Systems',
		role: 'Apprenti Ingénieur Développeur CI/CD',
		period: 'Sept 2023 - Août 2025',
		description: 'Conception et implémentation d\'une nouvelle chaîne de production logicielle modulaire (ProChain) remplaçant GCONF_TOOLS pour gérer des projets de plusieurs millions de lignes de code.',
		technologies: ['Python', 'Jenkins', 'Docker', 'CMake', 'GitLab CI', 'Bash'],
		highlights: [
			'Réduction des temps de compilation de 20% à 80% grâce à la parallélisation',
			'Gestion des contraintes ITAR et support multi-plateformes (Linux/Windows)',
			'Développement de modules SBOM/CVE pour la sécurité de la supply chain',
			'Migration progressive de Jenkins vers GitLab CI/CD',
		],
		opacity: 1,
	},
	{
		company: 'Thales Romania',
		role: 'Stagiaire Développeur Cybersécurité',
		period: 'Juin 2025 - Août 2025',
		description: 'Développement d\'une API REST on-premise intégrant un LLM pour l\'analyse automatique de rapports Wazuh, conforme aux exigences C3.',
		technologies: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Redis', 'LLM'],
		highlights: [
			'Architecture microservices avec support multi-modèles LLM',
			'Implémentation de sécurité multicouches (TLS 1.3, JWT, rate limiting)',
			'Optimisation avec cache Redis et recherche vectorielle Qdrant',
			'Tests de conformité aux exigences de sécurité C3',
		],
		opacity: 0.9,
	},
	{
		company: 'Freelance',
		role: 'Développeur Full Stack',
		period: '2022 - 2023',
		description: 'Développement de solutions web personnalisées pour divers clients avec focus sur la performance et l\'expérience utilisateur.',
		technologies: ['Vue.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
		highlights: [
			'Création d\'applications web modernes avec Vue 3 et TypeScript',
			'Optimisation SEO et performances (Core Web Vitals)',
			'Mise en place de pipelines CI/CD avec GitHub Actions',
		],
		opacity: 0.8,
	},
]

/**
 * Education entries
 */
export const EDUCATION: Education[] = [
	{
		institution: 'Polytech Paris-Saclay',
		degree: 'Diplôme d\'Ingénieur - Spécialité IIM',
		period: '2023 - 2025',
		description: 'Ingénierie Informatique et Mathématiques. Formation en alternance chez Thales.',
	},
	{
		institution: 'CPGE',
		degree: 'Classes Préparatoires MP',
		period: '2020 - 2023',
		description: 'Mathématiques et Physique. Formation intensive en sciences fondamentales.',
	},
]

/**
 * Skills with proficiency levels
 */
export const SKILLS: Skill[] = [
	{ name: 'Python', level: 95, category: 'backend' },
	{ name: 'C++', level: 90, category: 'backend' },
	{ name: 'Rust', level: 85, category: 'backend' },
	{ name: 'TypeScript', level: 88, category: 'frontend' },
	{ name: 'Vue.js', level: 85, category: 'frontend' },
	{ name: 'React', level: 75, category: 'frontend' },
	{ name: 'Docker', level: 90, category: 'devops' },
	{ name: 'Jenkins/GitLab CI', level: 95, category: 'devops' },
	{ name: 'CMake', level: 85, category: 'devops' },
	{ name: 'Git', level: 92, category: 'devops' },
	{ name: 'PostgreSQL', level: 80, category: 'database' },
	{ name: 'Redis', level: 82, category: 'database' },
	{ name: 'FastAPI', level: 88, category: 'backend' },
	{ name: 'TailwindCSS', level: 80, category: 'frontend' },
]

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: string): Skill[] {
	return SKILLS.filter((skill) => skill.category === category)
}
