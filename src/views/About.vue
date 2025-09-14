<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageAnimation } from '@/composables/useAnimation'
import { PROGRAMMING_SKILLS, type ProgrammingSkill } from '@/constants/experience'

const { t, tm } = useI18n()

// Use our animation composable
usePageAnimation('.about-window', 0.2)

// Get programming skills
const programmingSkills = PROGRAMMING_SKILLS

// Function to get skill level color - following portfolio gradient theme
const getSkillLevelColor = (level: ProgrammingSkill['level']) => {
	switch (level) {
		case 'expert':
			return 'from-blue-500 to-blue-600 border-blue-500/30 shadow-blue-500/20'
		case 'advanced':
			return 'from-purple-500 to-blue-500 border-purple-500/30 shadow-purple-500/20'
		case 'intermediate':
			return 'from-pink-500 to-purple-500 border-pink-500/30 shadow-pink-500/20'
		case 'beginner':
			return 'from-pink-400 to-pink-500 border-pink-400/30 shadow-pink-400/20'
		default:
			return 'from-gray-500 to-gray-600 border-gray-500/30'
	}
}

// Get experiences from i18n
interface ExperienceItem {
	company: string
	role: string
	period: string
	description: string
}

const experiences = computed((): ExperienceItem[] => {
	const items = tm('about.experienceItems') as any
	return Array.isArray(items) ? items : []
})

// Get education from i18n
interface EducationItem {
	institution: string
	degree: string
	period: string
	description: string
}

const education = computed((): EducationItem[] => {
	const items = tm('about.educationItems') as any
	return Array.isArray(items) ? items : []
})
</script>

<template>
	<div class="min-h-screen pt-32 pb-16">
		<!-- Animated background -->
		<div class="fixed inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/10 to-gray-900"></div>
			<div class="absolute top-32 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-32 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
		</div>

		<div class="about-window max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="text-center mb-12">
				<h1 class="text-5xl md:text-7xl font-bold mb-6">
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
						{{ t('about.title') }}
					</span>
				</h1>
				<p class="text-xl text-gray-300 max-w-3xl mx-auto">
					{{ t('about.description') }}
				</p>
				<div class="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
			</div>

			<!-- Main content -->
			<div>
				<!-- Content sections -->
				<div class="space-y-16">
					<!-- Experience and Profile/Skills Section -->
					<div class="relative">
						<!-- Titles centered within the content boxes -->
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
							<div class="lg:pr-8">
								<div class="lg:max-w-md lg:ml-auto text-center">
									<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
										{{ t('about.personalInfo') }}
									</h2>
								</div>
							</div>
							<div class="lg:pl-8">
								<div class="lg:max-w-md text-center">
									<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
										{{ t('about.experience') }}
									</h2>
								</div>
							</div>
						</div>

						<!-- Timeline items with vertical line -->
						<div class="space-y-8 relative">
							<!-- Central vertical line - only for experience section -->
							<div class="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 hidden lg:block"></div>
							<div v-for="(exp, index) in experiences" :key="exp.company" class="relative experience-item">
								<!-- Timeline dot aligned with top of cards -->
								<div class="timeline-dot absolute left-1/2 transform -translate-x-1/2 top-0 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-gray-900 z-10 hidden lg:block transition-all duration-300"></div>

								<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
									<!-- Left side content (Profile and Skills for first two items) -->
									<div class="lg:pr-8">
										<div v-if="index === 0" class="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 lg:ml-auto lg:max-w-md description-card hover:bg-gray-800/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
											<h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
												{{ t('about.profile') }}
											</h2>
											<div class="space-y-4 text-gray-300">
												<div class="flex items-center gap-3">
													<div class="p-2 bg-indigo-500/10 rounded-lg">
														<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
														</svg>
													</div>
													<div>
														<p class="text-sm text-gray-400">{{ t('about.currentPosition') }}</p>
														<p class="font-medium">Mathematics and Computer Science Engineer</p>
													</div>
												</div>
												<div class="flex items-center gap-3">
													<div class="p-2 bg-indigo-500/10 rounded-lg">
														<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
														</svg>
													</div>
													<div>
														<p class="text-sm text-gray-400">{{ t('about.location') }}</p>
														<p class="font-medium">France</p>
													</div>
												</div>
											</div>
										</div>

										<div v-else-if="index === 1" class="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 lg:ml-auto lg:max-w-md description-card hover:bg-gray-800/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
											<h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
												{{ t('about.programmingLanguages') }}
											</h2>
											<div class="space-y-3">
												<div v-for="(skill, skillIndex) in programmingSkills" :key="skill.name" 
													class="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-700/30 hover:bg-gray-900/50 transition-all duration-300 group">
													<span class="text-gray-200 font-medium text-lg group-hover:text-indigo-300 transition-colors">
														{{ skill.name }}
													</span>
													<span 
														:class="`px-4 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r ${getSkillLevelColor(skill.level)} border backdrop-blur-sm text-white shadow-lg`"
														class="transform group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
													>
														{{ t(`about.skillLevels.${skill.level}`) }}
													</span>
												</div>
											</div>
										</div>

										<div v-else class="hidden lg:block"></div>
									</div>

									<!-- Right side content (Experience cards) -->
									<div class="lg:pl-8">
										<div class="relative bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 lg:max-w-md experience-card hover:bg-gray-800/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
											<div class="flex flex-wrap items-start justify-between mb-3">
												<div>
													<h3 class="text-xl font-bold text-white">{{ exp.role }}</h3>
													<p class="text-indigo-400 font-medium">{{ exp.company }}</p>
												</div>
												<span class="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm font-medium">
													{{ exp.period }}
												</span>
											</div>
											<p class="text-gray-300 leading-relaxed">
												{{ exp.description }}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Education Section (without timeline) -->
					<div>
						<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-8 text-center">
							{{ t('about.education') }}
						</h2>

						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div
								v-for="(edu, index) in education"
								:key="edu.institution"
								:class="index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'"
							>
								<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-indigo-500/30 transition-all duration-300 group lg:max-w-md" :class="index % 2 === 0 ? 'lg:ml-auto' : ''">
									<div class="mb-4">
										<div class="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg inline-block mb-3">
											<svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path d="M12 14l9-5-9-5-9 5 9 5z" />
												<path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
											</svg>
										</div>
									</div>
									<h3 class="text-lg font-bold text-white mb-1">{{ edu.degree }}</h3>
									<p class="text-indigo-400 font-medium text-sm mb-2">{{ edu.institution }}</p>
									<p class="text-gray-400 text-sm mb-3">{{ edu.period }}</p>
									<p class="text-gray-300 text-sm leading-relaxed">
										{{ edu.description }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.delay-1000 {
	animation-delay: 1s;
}

/* Hover effect on timeline dot when hovering experience or description cards */
.experience-item:has(.experience-card:hover) .timeline-dot,
.experience-item:has(.description-card:hover) .timeline-dot {
	width: 1.5rem;
	height: 1.5rem;
	border-width: 5px;
	transform: translateX(-50%) translateY(-0.25rem);
}
</style>
