<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageAnimation } from '@/composables/useAnimation'
import { EXPERIENCES, EDUCATION, SKILLS } from '@/constants/experience'
import Card from '@/components/Card.vue'

const { t } = useI18n()

// Use our animation composable
usePageAnimation('.about-window', 0.2)

// Get the data from our constants
const experiences = EXPERIENCES
const education = EDUCATION
const skills = SKILLS
</script>

<template>
	<div class="min-h-screen pt-24 pb-16">
		<!-- Animated background -->
		<div class="fixed inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/10 to-gray-900"></div>
			<div class="absolute top-32 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-32 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
		</div>
		
		<div class="about-window max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
			
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left column - Personal Info & Skills -->
				<div class="lg:col-span-1 space-y-6">
					<!-- Personal Info Card -->
					<div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
						<h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
							Profile
						</h2>
						<div class="space-y-4 text-gray-300">
							<div class="flex items-center gap-3">
								<div class="p-2 bg-indigo-500/10 rounded-lg">
									<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<div>
									<p class="text-sm text-gray-400">Current Position</p>
									<p class="font-medium">CI/CD Engineer at Thales</p>
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
									<p class="text-sm text-gray-400">Location</p>
									<p class="font-medium">France</p>
								</div>
							</div>
						</div>
					</div>

					
					<!-- Skills Card -->
					<div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
						<h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
							{{ t('about.topSkills') }}
						</h2>
						<div class="space-y-4">
							<div v-for="skill in skills.slice(0, 6)" :key="skill.name" class="group">
								<div class="flex justify-between mb-2">
									<span class="text-gray-300 font-medium">{{ skill.name }}</span>
									<span class="text-indigo-400 text-sm">{{ skill.level }}%</span>
								</div>
								<div class="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
									<div
										class="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out skill-bar"
										:style="{ width: `${skill.level}%` }"
									></div>
									<div 
										class="absolute h-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-sm"
										:style="{ width: `${skill.level}%` }"
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				
				<!-- Middle & Right columns - Experience & Education -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Experience Timeline -->
					<div>
						<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
							{{ t('about.experience') }}
						</h2>
						<div class="relative">
							<!-- Timeline line -->
							<div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
							
							<div class="space-y-8">
								<div
									v-for="(exp, index) in experiences"
									:key="exp.company"
									class="relative pl-20 group"
								>
									<!-- Timeline dot -->
									<div class="absolute left-6 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-gray-900 group-hover:scale-125 transition-transform duration-300"></div>
									
									<!-- Content card -->
									<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-indigo-500/30 transition-all duration-300">
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
					
					<!-- Education -->
					<div>
						<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
							{{ t('about.education') }}
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div
								v-for="edu in education"
								:key="edu.institution"
								class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-indigo-500/30 transition-all duration-300 group"
							>
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
</template>

<style scoped>
@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-30px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.skill-bar {
	animation: slideInLeft 1s ease-out forwards;
	animation-delay: calc(var(--index) * 0.1s);
}

.delay-1000 {
	animation-delay: 1s;
}
</style>
