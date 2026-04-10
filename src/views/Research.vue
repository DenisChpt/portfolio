<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { usePageAnimation } from '@/composables/useAnimation'
import { IconCalendar, IconUsers, IconTag, IconDownload, IconExternalLink, IconQuote } from '@/components/icons'

/**
 * Research paper interface
 */
interface ResearchPaper {
	id: number
	title: string
	authors: string[]
	abstract: string
	publicationDate: string
	journal?: string
	conference?: string
	arxivUrl?: string
	pdfUrl?: string
	codeUrl?: string
	doi?: string
	topics: string[]
	featured?: boolean
	citations?: number
}

const { t, tm } = useI18n()

// Animation
usePageAnimation('.research-section', 0.1)

// State
const selectedTopic = ref<string>('all')
const sortBy = ref<'date' | 'citations'>('date')
const searchQuery = ref('')

// Modal state
const selectedPaper = ref<ResearchPaper | null>(null)
const modalMode = ref<'card' | 'pdf'>('card')
const modalBackdropRef = ref<HTMLElement | null>(null)
const modalContentRef = ref<HTMLElement | null>(null)

/**
 * Get research papers from i18n configuration
 */
const researchPapers = computed((): ResearchPaper[] => {
	const papers = tm('research.papers') as any
	return Array.isArray(papers) ? papers : []
})

// Get unique topics from all papers
const availableTopics = computed(() => {
	const topics = new Set<string>()
	topics.add('all')
	researchPapers.value.forEach(paper => {
		if (paper.topics && Array.isArray(paper.topics)) {
			paper.topics.forEach((topic: string) => topics.add(topic))
		}
	})
	return Array.from(topics)
})

// Filter and sort papers
const filteredPapers = computed(() => {
	let papers = [...researchPapers.value]

	// Filter by topic
	if (selectedTopic.value !== 'all') {
		papers = papers.filter(paper =>
			paper.topics && paper.topics.some((t: string) =>
				t.toLowerCase().includes(selectedTopic.value.toLowerCase())
			)
		)
	}

	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		papers = papers.filter(paper =>
			(paper.title && paper.title.toLowerCase().includes(query)) ||
			(paper.abstract && paper.abstract.toLowerCase().includes(query)) ||
			(paper.authors && paper.authors.some((author: string) => author.toLowerCase().includes(query))) ||
			(paper.topics && paper.topics.some((topic: string) => topic.toLowerCase().includes(query)))
		)
	}

	// Sort papers
	if (sortBy.value === 'date') {
		papers.sort((a, b) => {
			const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0
			const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0
			return dateB - dateA
		})
	} else {
		papers.sort((a, b) => (b.citations || 0) - (a.citations || 0))
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

// Open paper detail modal
const openPaper = (paper: ResearchPaper) => {
	selectedPaper.value = paper
	modalMode.value = 'card'

	nextTick(() => {
		if (modalBackdropRef.value) {
			gsap.fromTo(modalBackdropRef.value, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
		}
		if (modalContentRef.value) {
			gsap.fromTo(modalContentRef.value, { y: '100%', opacity: 0.8 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
		}
	})
}

// Close modal
const closePaper = () => {
	if (modalBackdropRef.value) {
		gsap.to(modalBackdropRef.value, { opacity: 0, duration: 0.3, ease: 'power2.in' })
	}
	if (modalContentRef.value) {
		gsap.to(modalContentRef.value, {
			y: '50%', opacity: 0, duration: 0.3, ease: 'power2.in',
			onComplete: () => {
				selectedPaper.value = null
				modalMode.value = 'card'
			}
		})
	} else {
		selectedPaper.value = null
		modalMode.value = 'card'
	}
}

// Switch to PDF viewer mode
const switchToPdf = () => {
	modalMode.value = 'pdf'
}

// Switch back to card mode
const switchToCard = () => {
	modalMode.value = 'card'
}
</script>

<template>
	<div class="min-h-screen pt-24 sm:pt-32 pb-16">
		<!-- Animated background -->
		<div class="fixed inset-0 -z-10">
					</div>

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="research-section">
				<!-- Header -->
				<div class="text-center mb-8 sm:mb-12">
					<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-4">
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
							{{ t('research.title') }}
						</span>
					</h1>
					<p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
						{{ t('research.description') }}
					</p>
					<div class="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
				</div>

				<!-- Filters and Search -->
				<div class="mb-12 bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
					<div class="flex flex-col md:flex-row gap-4">
						<!-- Search Bar -->
						<div class="flex-1">
							<div class="relative">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								<input
									v-model="searchQuery"
									type="text"
									:placeholder="t('research.searchPlaceholder')"
									class="w-full pl-12 pr-4 py-3 min-h-[48px] bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 text-base placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
								/>
							</div>
						</div>

						<!-- Sort Dropdown -->
						<select
							v-model="sortBy"
							class="px-5 py-3 min-h-[48px] bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 text-base focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 cursor-pointer"
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
								'px-3 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium transition-all duration-300',
								selectedTopic === topic
									? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
									: 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-indigo-500/50 hover:text-indigo-300'
							]"
						>
							{{ topic === 'all' ? t('research.allTopics') : topic }}
						</button>
					</div>
				</div>

				<!-- No papers at all -->
				<div v-if="researchPapers.length === 0" class="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-indigo-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 class="text-xl font-semibold text-gray-300 mb-2">{{ t('research.notAvailableTitle') }}</h3>
					<p class="text-gray-400 max-w-md mx-auto">{{ t('research.notAvailableMessage') }}</p>
				</div>

				<!-- Research Papers Grid -->
				<div v-else-if="filteredPapers.length > 0" class="grid gap-6">
					<div
						v-for="(paper, index) in filteredPapers"
						:key="paper.id"
						class="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer"
						:style="{ animationDelay: `${index * 0.1}s` }"
						@click="openPaper(paper)"
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

						<!-- Abstract preview -->
						<p class="text-gray-300 mb-6 leading-relaxed line-clamp-3">
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

						<!-- Quick actions row -->
						<div class="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-700/50">
							<span v-if="paper.pdfUrl" class="inline-flex items-center gap-2 text-sm text-indigo-400 font-medium">
								<IconDownload class="w-4 h-4" />
								PDF
							</span>
							<span v-if="paper.codeUrl" class="inline-flex items-center gap-2 text-sm text-purple-400 font-medium">
								<IconExternalLink class="w-4 h-4" />
								Code
							</span>
							<span class="ml-auto text-sm text-gray-500 group-hover:text-indigo-400 transition-colors">
								Click to view details
								<svg xmlns="http://www.w3.org/2000/svg" class="inline h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</span>
						</div>
					</div>
				</div>

				<!-- No Results after filter -->
				<div v-else class="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-indigo-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
					<p class="text-gray-400 text-lg">{{ t('research.noResults') }}</p>
				</div>
			</div>
		</div>

		<!-- Paper Detail Modal -->
		<div v-if="selectedPaper" class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
			<div ref="modalBackdropRef" class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="closePaper"></div>

			<div
				ref="modalContentRef"
				class="relative w-full mx-auto h-screen overflow-hidden sm:rounded-3xl transition-all duration-300"
				:class="modalMode === 'pdf' ? 'max-w-[95vw] sm:max-h-[95vh]' : 'max-w-5xl sm:h-auto sm:max-h-[90vh]'"
			>
				<!-- Glassmorphism background -->
				<div class="absolute inset-0 bg-gray-900/90 backdrop-blur-xl"></div>
				
				<div class="absolute inset-0 sm:rounded-3xl border border-gray-700/30"></div>

				<!-- PDF Viewer Mode -->
				<div v-if="modalMode === 'pdf' && selectedPaper.pdfUrl" class="relative z-10 h-screen sm:h-[95vh] flex flex-col">
					<!-- PDF Header -->
					<div class="flex items-center justify-between px-4 py-3 border-b border-gray-700/50 flex-shrink-0">
						<button
							@click="switchToCard"
							class="p-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-white hover:bg-indigo-500/20 transition-all duration-300"
							aria-label="Back to details"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
							</svg>
						</button>

						<h3 class="hidden sm:block text-sm text-gray-300 font-medium truncate mx-4 flex-1 text-center">
							{{ selectedPaper.title }}
						</h3>

						<div class="flex items-center gap-3">
							<a
								:href="selectedPaper.pdfUrl"
								download
								class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
								@click.stop
							>
								<IconDownload class="w-4 h-4" />
								<span class="hidden sm:inline">{{ t('research.downloadPdf') }}</span>
							</a>
							<a
								:href="selectedPaper.pdfUrl"
								target="_blank"
								rel="noopener noreferrer"
								class="p-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-white hover:bg-indigo-500/20 transition-all duration-300"
								aria-label="Open in new tab"
								@click.stop
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
							<button
								@click="closePaper"
								class="p-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500/20 transition-all duration-300"
								aria-label="Close"
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					<!-- PDF Embed - takes all remaining space -->
					<div class="flex-1 min-h-0 bg-gray-800">
						<iframe
							:src="selectedPaper.pdfUrl + '#zoom=page-width&view=FitH'"
							class="w-full h-full border-0"
							type="application/pdf"
						></iframe>
					</div>
				</div>

				<!-- Card Detail Mode -->
				<div v-else class="relative z-10 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen sm:h-auto sm:max-h-[90vh]">
					<!-- Header -->
					<div class="flex justify-between items-start mb-8">
						<div class="flex-1 mr-4">
							<!-- Featured badge -->
							<div v-if="selectedPaper.featured" class="mb-3">
								<span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
									{{ t('research.featured') }}
								</span>
							</div>
							<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
								<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
									{{ selectedPaper.title }}
								</span>
							</h2>
							<div class="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
						</div>
						<button
							@click="closePaper"
							class="text-gray-400 hover:text-white transition-all duration-300 p-2 sm:p-3 min-w-[44px] min-h-[44px] rounded-full hover:bg-indigo-500/20 hover:rotate-90 transform flex-shrink-0"
							aria-label="Close"
						>
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<!-- Content grid -->
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
						<!-- Left column - Abstract (2/3 width) -->
						<div class="lg:col-span-2 space-y-6">
							<!-- Authors -->
							<div class="flex items-center gap-3">
								<IconUsers class="w-5 h-5 text-indigo-400 flex-shrink-0" />
								<span class="text-gray-300 text-lg">{{ selectedPaper.authors.join(', ') }}</span>
							</div>

							<!-- Abstract -->
							<div>
								<h3 class="text-sm font-semibold text-indigo-300 mb-3 uppercase tracking-wider">{{ t('research.abstract') }}</h3>
								<p class="text-gray-300 text-base leading-relaxed">
									{{ selectedPaper.abstract }}
								</p>
							</div>
						</div>

						<!-- Right column - Metadata (1/3 width) -->
						<div class="space-y-6">
							<!-- Publication Info -->
							<div>
								<h3 class="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">{{ t('research.publicationInfo') }}</h3>
								<div class="space-y-3">
									<div class="flex items-center gap-2 text-gray-300">
										<IconCalendar class="w-4 h-4 text-indigo-400 flex-shrink-0" />
										<span>{{ formatDate(selectedPaper.publicationDate) }}</span>
									</div>
									<div>
										<span class="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg text-sm font-medium">
											{{ getVenue(selectedPaper) }}
										</span>
									</div>
									<div v-if="selectedPaper.citations" class="flex items-center gap-2 text-gray-300">
										<IconQuote class="w-4 h-4 text-indigo-400 flex-shrink-0" />
										<span>{{ selectedPaper.citations }} {{ t('research.citations') }}</span>
									</div>
								</div>
							</div>

							<!-- Topics -->
							<div>
								<h3 class="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">Topics</h3>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="topic in selectedPaper.topics"
										:key="topic"
										class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900/50 text-gray-300 border border-gray-700/50"
									>
										<IconTag class="w-3 h-3" />
										{{ topic }}
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Action buttons -->
					<div class="flex flex-wrap gap-4 pt-6 border-t border-indigo-500/20">
						<!-- View PDF button -->
						<button
							v-if="selectedPaper.pdfUrl"
							@click="switchToPdf"
							class="group relative inline-flex items-center px-6 py-3 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
						>
							<span class="relative z-10 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								{{ t('research.viewPdf') }}
							</span>
							<div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full"></div>
						</button>

						<!-- Download PDF -->
						<a
							v-if="selectedPaper.pdfUrl"
							:href="selectedPaper.pdfUrl"
							download
							class="group inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-600 text-gray-300 font-medium transition-all duration-300 hover:border-indigo-500 hover:text-indigo-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm"
							@click.stop
						>
							<IconDownload class="h-5 w-5 mr-2" />
							{{ t('research.downloadPdf') }}
						</a>

						<!-- View Code -->
						<a
							v-if="selectedPaper.codeUrl"
							:href="selectedPaper.codeUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-600 text-gray-300 font-medium transition-all duration-300 hover:border-purple-500 hover:text-purple-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
							{{ t('research.viewCode') }}
						</a>

						<!-- arXiv -->
						<a
							v-if="selectedPaper.arxivUrl"
							:href="selectedPaper.arxivUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-600 text-gray-300 font-medium transition-all duration-300 hover:border-indigo-500 hover:text-indigo-300 hover:scale-105 backdrop-blur-sm"
						>
							<IconExternalLink class="h-5 w-5 mr-2" />
							arXiv
						</a>

						<!-- DOI -->
						<a
							v-if="selectedPaper.doi"
							:href="`https://doi.org/${selectedPaper.doi}`"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center px-6 py-3 rounded-full border-2 border-gray-600 text-gray-300 font-medium transition-all duration-300 hover:border-indigo-500 hover:text-indigo-300 hover:scale-105 backdrop-blur-sm"
						>
							<IconExternalLink class="h-5 w-5 mr-2" />
							DOI
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.line-clamp-3 {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
