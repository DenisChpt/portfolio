<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageAnimation } from '@/composables/useAnimation'
import { 
	RESEARCH_PAPERS, 
	filterResearchByTopic, 
	sortResearchByDate,
	sortResearchByCitations 
} from '@/constants/research'
import type { ResearchPaper } from '@/types/research'
import { IconCalendar, IconUsers, IconTag, IconDownload, IconExternalLink, IconQuote } from '@/components/icons'

const { t } = useI18n()

// Animation
usePageAnimation('.research-section', 0.1)

// State
const selectedTopic = ref<string>('all')
const sortBy = ref<'date' | 'citations'>('date')
const searchQuery = ref('')

// Get unique topics from all papers
const availableTopics = computed(() => {
	const topics = new Set<string>()
	topics.add('all')
	RESEARCH_PAPERS.forEach(paper => {
		paper.topics.forEach(topic => topics.add(topic))
	})
	return Array.from(topics)
})

// Filter and sort papers
const filteredPapers = computed(() => {
	let papers = [...RESEARCH_PAPERS]
	
	// Filter by topic
	if (selectedTopic.value !== 'all') {
		papers = filterResearchByTopic(papers, selectedTopic.value)
	}
	
	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		papers = papers.filter(paper =>
			paper.title.toLowerCase().includes(query) ||
			paper.abstract.toLowerCase().includes(query) ||
			paper.authors.some(author => author.toLowerCase().includes(query)) ||
			paper.topics.some(topic => topic.toLowerCase().includes(query))
		)
	}
	
	// Sort papers
	if (sortBy.value === 'date') {
		papers = sortResearchByDate(papers)
	} else {
		papers = sortResearchByCitations(papers)
	}
	
	return papers
})

// Format date for display
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

// Get publication venue
const getVenue = (paper: ResearchPaper) => {
	return paper.journal || paper.conference || 'Preprint'
}
</script>

<template>
	<div class="min-h-screen pt-32 pb-16">
		<!-- Animated background -->
		<div class="fixed inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/10 to-gray-900"></div>
			<div class="absolute top-48 left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-48 right-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
		</div>
		
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="research-section">
				<!-- Header -->
				<div class="text-center mb-12">
					<h1 class="text-5xl md:text-7xl font-bold mb-6">
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
							{{ t('research.title') }}
						</span>
					</h1>
					<p class="text-xl text-gray-300 max-w-3xl mx-auto">
						{{ t('research.description') }}
					</p>
					<div class="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
				</div>

				<!-- Filters and Search with glassmorphism -->
				<div class="mb-12 bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
					<div class="flex flex-col md:flex-row gap-4">
						<!-- Search Bar -->
						<div class="flex-1">
							<div class="relative">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								<input
									v-model="searchQuery"
									type="text"
									:placeholder="t('research.searchPlaceholder')"
									class="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
								/>
							</div>
						</div>

						<!-- Sort Dropdown -->
						<select
							v-model="sortBy"
							class="px-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 cursor-pointer"
						>
							<option value="date">{{ t('research.sortByDate') }}</option>
							<option value="citations">{{ t('research.sortByCitations') }}</option>
						</select>
					</div>

					<!-- Topic Filters -->
					<div class="flex flex-wrap gap-3 mt-4">
						<button
							v-for="topic in availableTopics"
							:key="topic"
							@click="selectedTopic = topic"
							:class="[
								'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
								selectedTopic === topic
									? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
									: 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-indigo-500/50 hover:text-indigo-300'
							]"
						>
							{{ topic === 'all' ? t('research.allTopics') : topic }}
						</button>
					</div>
				</div>

				<!-- Research Papers Grid -->
				<div v-if="filteredPapers.length > 0" class="grid gap-6">
					<div
						v-for="(paper, index) in filteredPapers"
						:key="paper.id"
						class="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 research-paper-card"
						:style="{ animationDelay: `${index * 0.1}s` }"
					>
						<!-- Featured Badge -->
						<div v-if="paper.featured" class="mb-4">
							<span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
								{{ t('research.featured') }}
							</span>
						</div>

						<!-- Title -->
						<h3 class="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
							{{ paper.title }}
						</h3>

						<!-- Authors -->
						<div class="flex items-center gap-2 mb-4 text-gray-400">
							<IconUsers class="w-5 h-5 text-indigo-400" />
							<span>{{ paper.authors.join(', ') }}</span>
						</div>

						<!-- Publication Info -->
						<div class="flex flex-wrap items-center gap-6 mb-6 text-sm">
							<div class="flex items-center gap-2 text-gray-400">
								<IconCalendar class="w-4 h-4 text-indigo-400" />
								<span>{{ formatDate(paper.publicationDate) }}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg font-medium">
									{{ getVenue(paper) }}
								</span>
							</div>
							<div v-if="paper.citations" class="flex items-center gap-2 text-gray-400">
								<IconQuote class="w-4 h-4 text-indigo-400" />
								<span>{{ paper.citations }} {{ t('research.citations') }}</span>
							</div>
						</div>

						<!-- Abstract -->
						<p class="text-gray-300 mb-6 leading-relaxed line-clamp-4">
							{{ paper.abstract }}
						</p>

						<!-- Topics -->
						<div class="flex flex-wrap gap-2 mb-6">
							<span
								v-for="topic in paper.topics"
								:key="topic"
								class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900/50 text-gray-300 border border-gray-700/50"
							>
								<IconTag class="w-3 h-3" />
								{{ topic }}
							</span>
						</div>

						<!-- Actions -->
						<div class="flex flex-wrap gap-3">
							<a
								v-if="paper.pdfUrl"
								:href="paper.pdfUrl"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
							>
								<IconDownload class="w-4 h-4" />
								{{ t('research.downloadPdf') }}
							</a>
							<a
								v-if="paper.arxivUrl"
								:href="paper.arxivUrl"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800/50 text-gray-300 rounded-lg font-medium border border-gray-700/50 hover:border-indigo-500/50 hover:text-indigo-300 transition-all duration-300"
							>
								<IconExternalLink class="w-4 h-4" />
								arXiv
							</a>
							<a
								v-if="paper.doi"
								:href="`https://doi.org/${paper.doi}`"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800/50 text-gray-300 rounded-lg font-medium border border-gray-700/50 hover:border-indigo-500/50 hover:text-indigo-300 transition-all duration-300"
							>
								<IconExternalLink class="w-4 h-4" />
								DOI
							</a>
						</div>
					</div>
				</div>

				<!-- No Results -->
				<div v-else class="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-16 w-16 mx-auto text-indigo-500/50 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
					<p class="text-gray-400 text-lg">{{ t('research.noResults') }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.research-paper-card {
	animation: fadeInUp 0.6s ease-out forwards;
	opacity: 0;
}

.research-paper-card:hover {
	transform: translateY(-4px);
}

.line-clamp-4 {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.delay-1000 {
	animation-delay: 1s;
}
</style>