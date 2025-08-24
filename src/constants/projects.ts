import type { Project } from '@/types/project'

/**
 * List of projects to display in the portfolio
 */
export const PROJECTS: Project[] = [
	{
		id: 1,
		title: 'ProChain - CI/CD Production Chain',
		description:
			'Nouvelle chaîne de production logicielle modulaire pour Thales, remplaçant GCONF_TOOLS. Architecture Python permettant compilation parallèle, production incrémentale et indépendance vis-à-vis de Jenkins.',
		longDescription:
			'Durant mon alternance chez Thales, j\'ai conçu et implémenté ProChain, une chaîne de production CI/CD modulaire remplaçant l\'ancienne solution GCONF_TOOLS. Cette nouvelle architecture en Python permet la parallélisation des builds, la gestion fine des dépendances par OS/architecture, et réduit drastiquement la dépendance à Jenkins. Le système gère des projets de plusieurs millions de lignes de code avec traçabilité ITAR et support multi-plateformes (Linux, Windows). Résultats : réduction de 20% du temps de compilation en mode full, et jusqu\'à 80% en mode delta.',
		tech: ['Python', 'Jenkins', 'Docker', 'GitLab CI'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		featured: true,
		status: 'completed' as const,
	},
	{
		id: 2,
		title: 'RiemannOpt - Librairie d\'Optimisation Riemannienne',
		description:
			'Librairie Rust haute performance pour l\'optimisation sur variétés riemanniennes. Implémentation d\'algorithmes de descente de gradient géodésique et rétraction pour l\'apprentissage automatique.',
		longDescription:
			'RiemannOpt est une librairie d\'optimisation développée en Rust, spécialisée dans les méthodes d\'optimisation sur variétés riemanniennes. Elle implémente des algorithmes de pointe comme la descente de gradient riemannien, les méthodes de rétraction et le transport parallèle. La librairie offre des performances exceptionnelles grâce à Rust et trouve des applications en apprentissage automatique, vision par ordinateur et traitement du signal. Elle inclut des optimisations pour les variétés de Grassmann, Stiefel et les matrices SPD.',
		tech: ['Rust', 'C++', 'Python'],
		image: '/images/RiemannOpt_logo.png',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		sourceUrl: 'https://github.com/DenisChpt/RiemannOpt',
		featured: true,
		status: 'maintenance' as const,
	},
	{
		id: 3,
		title: 'MinePP - Clone Minecraft en C++',
		description:
			'Moteur de jeu voxel développé from scratch en C++ moderne avec OpenGL. Génération procédurale de terrain, système de chunks optimisé et moteur physique custom.',
		longDescription:
			'MinePP est un clone de Minecraft développé entièrement en C++ moderne (C++20), utilisant OpenGL pour le rendu 3D. Le projet implémente un système de chunks avec culling frustum, génération procédurale de terrain via bruit de Perlin, moteur physique custom avec détection de collision AABB, et système d\'éclairage dynamique. L\'architecture est conçue pour être extensible avec un système ECS (Entity Component System) et supporte le multithreading pour la génération de terrain.',
		tech: ['C++', 'OpenGL'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		sourceUrl: 'https://github.com/DenisChpt/MinePP',
		status: 'archived' as const,
	},
	{
		id: 4,
		title: 'Wazuh AI Assistant - API Cybersécurité',
		description:
			'API REST on-premise intégrant un LLM pour synthétiser les rapports Wazuh. Solution conteneurisée respectant les contraintes de sécurité C3 avec support multi-modèles.',
		longDescription:
			'Développé durant mon stage en Roumanie chez Thales, ce projet consiste en une API REST sécurisée permettant l\'analyse et la synthèse automatique des rapports de sécurité Wazuh via un LLM hébergé localement. La solution, entièrement conteneurisée avec Docker, supporte plusieurs modèles (TinyLlama, Qwen, Mistral 7B) et intègre un cache Redis pour optimiser les performances. L\'architecture inclut PostgreSQL pour la gestion des comptes, Qdrant pour la recherche vectorielle dans les CVE, et Nginx pour la terminaison TLS. Conforme aux exigences de sécurité C3.',
		tech: ['Python', 'Docker', 'SQL'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		featured: true,
		status: 'completed' as const,
	},
	{
		id: 5,
		title: 'Portfolio Personnel',
		description:
			'Site portfolio moderne développé avec Vue 3 et TypeScript. Design responsive, animations fluides, support multilingue et mode sombre.',
		longDescription:
			'Portfolio personnel développé avec les dernières technologies web. Utilise Vue 3 avec Composition API, TypeScript pour le typage fort, et Pinia pour la gestion d\'état. Le design est entièrement responsive avec Tailwind CSS, inclut des animations personnalisées, un système de thème clair/sombre, et support multilingue (i18n) pour 6 langues. Optimisé pour les performances avec lazy loading et code splitting.',
		tech: ['Vue.js', 'TypeScript'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		sourceUrl: 'https://github.com/DenisChpt/portfolio',
		liveUrl: 'https://denischaput.dev',
		status: 'active' as const,
	},
	{
		id: 6,
		title: 'Module SBOM/CVE Generator',
		description:
			'Outil d\'analyse de dépendances et génération de SBOM pour la détection de vulnérabilités. Parse les fichiers CMake et vcxproj pour identifier les dépendances réelles.',
		longDescription:
			'Module développé chez Thales pour générer automatiquement des Software Bill of Materials (SBOM) et détecter les CVE dans les projets C++/Java. L\'outil analyse les fichiers de build (Makefiles, vcxproj) pour extraire les dépendances réelles plutôt que déclarées, garantissant une précision maximale. Il produit des fichiers JSON enrichis servant à la génération de SBOM au format standard, permettant l\'intégration avec les scanners de vulnérabilités. Solution critique pour la conformité et la sécurité de la supply chain logicielle.',
		tech: ['Python', 'Jenkins'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
		status: 'in-progress' as const,
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
