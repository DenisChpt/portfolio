<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { usePageAnimation } from '@/composables/useAnimation'
import { useProjectsStore } from '@/stores/projectsStore'
import Card from '@/components/Card.vue'
import Button from '@/components/Button.vue'

const { t } = useI18n()
const projectsStore = useProjectsStore()

// Use our animation composable
usePageAnimation('.home-content', 0.4)

// Get featured projects from the store
const featuredProjects = projectsStore.featuredProjects
</script>

<template>
	<div class="section flex items-center justify-center pt-24">
		<div class="home-content max-w-4xl mx-auto p-8">
			<Card variant="panel">
				<div class="text-center">
					<h1 class="text-5xl md:text-6xl font-bold gradient-text mb-6">
						{{ t('home.title') }}
					</h1>

					<p class="text-xl md:text-2xl text-indigo-100 mb-10">
						{{ t('home.subtitle') }}
					</p>

					<div class="terminal mb-10">
						<div class="mb-2 text-gray-400">
							<span class="text-indigo-400">~</span> $ <span class="typing-effect">{{ t('home.terminal.commandWhoAmI') }}</span>
						</div>
						<div class="text-indigo-400 mb-2">{{ t('home.terminal.developerInfo') }}</div>
						<div class="mb-2 text-gray-400">
							<span class="text-indigo-400">~</span> $ <span class="typing-effect">{{ t('home.terminal.commandSkills') }}</span>
						</div>
						<div class="text-indigo-400 flex flex-wrap gap-2">
							<span class="tech-badge">Vue.js</span>
							<span class="tech-badge">TypeScript</span>
							<span class="tech-badge">Node.js</span>
							<span class="tech-badge">TailwindCSS</span>
							<span class="tech-badge">GraphQL</span>
							<span class="tech-badge">MongoDB</span>
						</div>
					</div>

					<div class="flex flex-wrap justify-center gap-4">
						<Button to="/projects" variant="primary">
							{{ t('home.viewProjects') }}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 ml-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</Button>

						<Button to="/contact" variant="outline"> {{ t('home.contactMe') }} </Button>
					</div>
				</div>

				<!-- Featured Projects Section -->
				<div v-if="featuredProjects.length > 0" class="mt-20">
					<h2 class="text-2xl font-bold gradient-text mb-6 text-center">{{ t('home.featuredProjects') }}</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div v-for="project in featuredProjects.slice(0, 2)" :key="project.id" class="group">
							<Card hover>
								<div class="relative overflow-hidden rounded-lg mb-4 aspect-video">
									<img
										:src="project.image"
										:alt="project.title"
										class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
									>
										<div class="text-white text-sm font-medium">View Project</div>
									</div>
								</div>
								<h3 class="text-lg font-medium text-white mb-2">
									{{ project.title }}
								</h3>
								<p class="text-gray-400 text-sm mb-4 line-clamp-2">
									{{ project.description }}
								</p>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="tech in project.tech.slice(0, 3)"
										:key="tech"
										class="px-2 py-1 text-xs bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
									>
										{{ tech }}
									</span>
								</div>

								<div class="mt-4">
									<Button to="/projects" variant="text" size="sm"> View details </Button>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>
