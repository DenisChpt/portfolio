import type { ResearchPaper } from '@/types/research'

/**
 * List of research papers and publications
 */
export const RESEARCH_PAPERS: ResearchPaper[] = [
	{
		id: 1,
		title: 'Optimisation Parallèle des Chaînes de Production CI/CD dans les Environnements Multi-Plateformes',
		authors: ['Denis Chaput', 'Clément Foucault', 'Aurélien Max'],
		abstract: 'Cette recherche présente ProChain, une architecture modulaire innovante pour l\'optimisation des chaînes de production logicielle en environnement industriel. Nous démontrons comment la parallélisation basée sur l\'analyse de graphes de dépendances permet une réduction significative des temps de compilation (jusqu\'à 80% en mode delta) tout en maintenant la traçabilité ITAR et le support multi-plateformes.',
		publicationDate: '2024-12',
		journal: 'Journal of Software Engineering and Production Systems',
		topics: ['CI/CD', 'Parallel Computing', 'Software Engineering', 'DevOps'],
		featured: true,
		citations: 5,
	},
	{
		id: 2,
		title: 'RiemannOpt: A High-Performance Library for Optimization on Riemannian Manifolds',
		authors: ['Denis Chaput'],
		abstract: 'We present RiemannOpt, a Rust-based optimization library specialized in gradient descent methods on Riemannian manifolds. The library implements state-of-the-art algorithms including geodesic gradient descent, retraction methods, and parallel transport, with applications in machine learning and computer vision. Performance benchmarks show significant improvements over existing implementations.',
		publicationDate: '2024-09',
		conference: 'International Conference on Optimization Methods',
		arxivUrl: 'https://arxiv.org/example/riemannopt',
		topics: ['Optimization', 'Riemannian Geometry', 'Machine Learning', 'Rust'],
		featured: true,
		citations: 12,
	},
	{
		id: 3,
		title: 'Analyse Automatique de Vulnérabilités via SBOM dans les Chaînes CI/CD',
		authors: ['Denis Chaput', 'M. Croitoru'],
		abstract: 'Nous proposons une méthode automatisée pour la génération de Software Bill of Materials (SBOM) et la détection de CVE dans les projets C++/Java. Notre approche analyse les fichiers de build pour extraire les dépendances réelles plutôt que déclarées, garantissant une précision maximale dans l\'identification des vulnérabilités de la supply chain logicielle.',
		publicationDate: '2024-06',
		journal: 'Cybersecurity & Software Supply Chain Journal',
		topics: ['Security', 'SBOM', 'CVE', 'Supply Chain'],
		citations: 8,
	},
	{
		id: 4,
		title: 'On-Premise LLM Integration for Automated Security Report Analysis',
		authors: ['Denis Chaput', 'M. Croitoru', 'Thales Security Team'],
		abstract: 'This paper presents a novel approach for integrating Large Language Models in on-premise cybersecurity environments. We demonstrate how containerized LLM deployment with multi-model support can enhance security report analysis while maintaining C3-level security constraints. Our solution achieves significant reduction in analysis time while preserving data confidentiality.',
		publicationDate: '2025-01',
		conference: 'European Conference on Cybersecurity and AI',
		topics: ['LLM', 'Cybersecurity', 'AI', 'Docker'],
		featured: true,
		citations: 3,
	},
	{
		id: 5,
		title: 'Efficient Voxel Engine Design with Modern C++20 Features',
		authors: ['Denis Chaput'],
		abstract: 'We explore the implementation of a high-performance voxel engine using modern C++20 features. Our approach combines frustum culling, multithreaded chunk generation, and custom physics engine with AABB collision detection. The architecture leverages Entity Component System (ECS) for extensibility and demonstrates significant performance improvements over traditional approaches.',
		publicationDate: '2023-11',
		conference: 'Game Development and Computer Graphics Conference',
		topics: ['Game Development', 'C++', 'Computer Graphics', 'OpenGL'],
		citations: 7,
	},
]

/**
 * Filter research papers by topic
 */
export function filterResearchByTopic(papers: ResearchPaper[], topic: string): ResearchPaper[] {
	if (topic === 'all') return papers
	return papers.filter((paper) => 
		paper.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
	)
}

/**
 * Get featured research papers
 */
export function getFeaturedResearch(papers: ResearchPaper[]): ResearchPaper[] {
	return papers.filter((paper) => paper.featured)
}

/**
 * Sort research papers by date (newest first)
 */
export function sortResearchByDate(papers: ResearchPaper[]): ResearchPaper[] {
	return [...papers].sort((a, b) => 
		new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
	)
}

/**
 * Sort research papers by citations (most cited first)
 */
export function sortResearchByCitations(papers: ResearchPaper[]): ResearchPaper[] {
	return [...papers].sort((a, b) => (b.citations || 0) - (a.citations || 0))
}