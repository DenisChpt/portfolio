<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageAnimation } from '@/composables/useAnimation'
import { useProjectsStore } from '@/stores/projectsStore'
const { t } = useI18n()
const projectsStore = useProjectsStore()

// Use our animation composable
usePageAnimation('.home-content', 0.4)

// Get featured projects from the store
const featuredProjects = projectsStore.featuredProjects
</script>

<template>
	<div class="min-h-screen flex items-center justify-center relative overflow-hidden">
		<!-- Animated gradient background -->
		<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900"></div>
		<div class="absolute inset-0">
			<div class="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
		</div>

		<div class="home-content relative z-10 max-w-7xl mx-auto p-8 w-full">
			<div class="text-center mb-16 pt-20">
				<!-- Hero Section with better typography -->
				<h1 class="text-6xl md:text-8xl font-bold mb-6 leading-tight">
					<span class="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
						Denis Chaput
					</span>
				</h1>

				<p class="text-2xl md:text-4xl text-gray-300 mb-4 font-light">
					{{ t('home.subtitle') }}
				</p>

				<p class="text-xl text-gray-400 max-w-4xl mx-auto mb-12">
					Passionate about optimization, advanced algorithms and complex technical challenges
				</p>
			</div>

			<!-- Featured Projects Section with modern design -->
			<div v-if="featuredProjects.length > 0" class="mt-32">
				<div class="text-center mb-12">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
							{{ t('home.featuredProjects') }}
						</span>
					</h2>
					<div class="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div
						v-for="(project, index) in featuredProjects.slice(0, 3)"
						:key="project.id"
						class="group relative"
						:style="{ animationDelay: `${index * 0.1}s` }"
					>
						<router-link :to="`/projects#${project.id}`" class="block">
							<div class="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
								<!-- Project Image with overlay -->
								<div class="relative h-48 overflow-hidden">
									<div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
									<img
										:src="project.image"
										:alt="project.title"
										class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60"></div>

									<!-- Featured badge -->
									<div class="absolute top-4 right-4">
										<span class="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
											Featured
										</span>
									</div>
								</div>

								<!-- Content -->
								<div class="p-6">
									<h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
										{{ project.title }}
									</h3>
									<p class="text-gray-400 text-sm mb-4 line-clamp-2">
										{{ project.description }}
									</p>

									<!-- Tech stack -->
									<div class="flex flex-wrap gap-2 mb-4">
										<span
											v-for="tech in project.tech.slice(0, 3)"
											:key="tech"
											class="px-3 py-1 text-xs bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20 backdrop-blur-sm"
										>
											{{ tech }}
										</span>
										<span v-if="project.tech.length > 3" class="px-3 py-1 text-xs text-gray-500">
											+{{ project.tech.length - 3 }} more
										</span>
									</div>

									<!-- View project link -->
									<div class="flex items-center text-indigo-400 font-medium text-sm group-hover:text-indigo-300 transition-colors">
										<span>{{ t('projects.viewProject') }}</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
										</svg>
									</div>
								</div>
							</div>
						</router-link>
					</div>
				</div>

				<!-- CTA Buttons repeated -->
				<div class="flex flex-wrap justify-center gap-6 mt-12">
					<router-link
						to="/projects"
						class="group relative inline-flex items-center px-8 py-4 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
					>
						<span class="relative z-10 flex items-center">
							{{ t('home.viewProjects') }}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
						<div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full"></div>
					</router-link>

					<router-link
						to="/contact"
						class="group inline-flex items-center px-8 py-4 rounded-full border-2 border-gray-600 text-gray-300 font-medium transition-all duration-300 hover:border-indigo-500 hover:text-indigo-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm"
					>
						<span class="flex items-center">
							{{ t('home.contactMe') }}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 ml-2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</span>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@keyframes gradient {
	0%, 100% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
}

.animate-gradient {
	background-size: 200% 200%;
	animation: gradient 3s ease infinite;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fadeIn {
	animation: fadeIn 0.5s ease-out;
}

.typing-animation {
	overflow: hidden;
	white-space: nowrap;
	animation: typing 1s steps(20, end);
}

.typing-complete {
	overflow: visible;
}

@keyframes typing {
	from {
		width: 0;
	}
	to {
		width: 100%;
	}
}

.cursor-blink {
	animation: blink 1s infinite;
}

@keyframes blink {
	0%, 49% {
		opacity: 1;
	}
	50%, 100% {
		opacity: 0;
	}
}

.skill-badge {
	@apply px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 rounded-full border border-indigo-500/30 text-xs font-medium backdrop-blur-sm;
	animation: slideIn 0.5s ease-out forwards;
	opacity: 0;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(-10px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.delay-1000 {
	animation-delay: 1s;
}

.delay-2000 {
	animation-delay: 2s;
}
</style>
