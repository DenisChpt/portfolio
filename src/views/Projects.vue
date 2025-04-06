<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import ContentWindow from '../components/ContentWindow.vue'

const { t } = useI18n()

const selectedProject = ref(null)

const projects = [
	{
		id: 1,
		title: 'E-commerce Platform',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
		longDescription:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		tech: ['Vue', 'Node.js', 'MongoDB'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 2,
		title: 'Social Media Dashboard',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		longDescription:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
		tech: ['React', 'GraphQL', 'PostgreSQL'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 3,
		title: 'AI-Powered Analytics',
		description:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		longDescription:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		tech: ['Python', 'TensorFlow', 'Flask'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 4,
		title: 'Mobile Fitness App',
		description:
			'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		longDescription:
			'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		tech: ['React Native', 'Firebase', 'Redux'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 5,
		title: 'Smart Home IoT Platform',
		description:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
		longDescription:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
		tech: ['Angular', 'Node.js', 'MongoDB'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
	{
		id: 6,
		title: 'Blockchain Wallet',
		description:
			'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
		longDescription:
			'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		tech: ['Web3.js', 'React', 'Solidity'],
		image: 'https://via.placeholder.com/800x600',
		gallery: [
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
			'https://via.placeholder.com/800x600',
		],
	},
]

const openProject = (project: any) => {
	selectedProject.value = project
	gsap.to('.project-details', {
		opacity: 1,
		scale: 1,
		duration: 0.5,
		ease: 'back.out(1.7)',
	})
}

const closeProject = () => {
	gsap.to('.project-details', {
		opacity: 0,
		scale: 0.95,
		duration: 0.3,
		ease: 'power2.in',
		onComplete: () => {
			selectedProject.value = null
		},
	})
}

onMounted(() => {
	gsap.from('.projects-window', {
		y: 50,
		opacity: 0,
		duration: 1,
		ease: 'expo.out',
		delay: 0.2,
	})

	gsap.from('.project-card', {
		y: 30,
		opacity: 0,
		duration: 0.8,
		stagger: 0.1,
		delay: 0.6,
		ease: 'power3.out',
	})
})
</script>

<template>
	<div class="section flex items-center justify-center pt-24 pb-16">
		<div class="projects-window max-w-6xl w-full mx-auto">
			<ContentWindow title="portfolio.projects" :fullHeight="true">
				<div class="mb-8">
					<h1
						class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500 mb-4"
					>
						{{ t('projects.title') }}
					</h1>
					<p class="text-gray-300">
						{{ t('projects.description') }}
					</p>
				</div>

				<div
					class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-20rem)]"
				>
					<div
						v-for="project in projects"
						:key="project.id"
						class="project-card cursor-pointer group"
						@click="openProject(project)"
					>
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
								v-for="tech in project.tech"
								:key="tech"
								class="px-2 py-1 text-xs bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
							>
								{{ tech }}
							</span>
						</div>
					</div>
				</div>
			</ContentWindow>
		</div>

		<!-- Project Details Modal -->
		<div
			v-if="selectedProject"
			class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
			@click.self="closeProject"
		>
			<div
				class="project-details max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto opacity-0 scale-95"
			>
				<ContentWindow :title="`project.${selectedProject.id}`">
					<div class="flex justify-between items-start mb-6">
						<h2
							class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500"
						>
							{{ selectedProject.title }}
						</h2>
						<button
							@click="closeProject"
							class="text-gray-400 hover:text-white transition-colors duration-200"
						>
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div class="space-y-4">
							<img
								:src="selectedProject.image"
								:alt="selectedProject.title"
								class="w-full rounded-lg shadow-lg aspect-video object-cover"
							/>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="tech in selectedProject.tech"
									:key="tech"
									class="px-3 py-1 text-sm bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
								>
									{{ tech }}
								</span>
							</div>
						</div>

						<div class="space-y-4">
							<p class="text-gray-300">
								{{ selectedProject.longDescription }}
							</p>

							<div class="grid grid-cols-2 gap-4">
								<img
									v-for="(image, index) in selectedProject.gallery.slice(0, 4)"
									:key="index"
									:src="image"
									:alt="`${selectedProject.title} gallery ${index + 1}`"
									class="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 aspect-video object-cover"
								/>
							</div>
						</div>
					</div>

					<div class="flex justify-end space-x-4">
						<button class="btn btn-primary">View Live Demo</button>
						<button class="btn bg-white/5 text-white border border-white/10 hover:bg-white/10">
							View Source
						</button>
					</div>
				</ContentWindow>
			</div>
		</div>
	</div>
</template>

<style scoped>
.section {
	min-height: 100vh;
	padding: 0 1rem;
}

.project-details {
	transform-origin: center center;
}

.project-card {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 0.75rem;
	padding: 1rem;
	transition: all 0.3s ease;
}

.project-card:hover {
	transform: translateY(-5px);
	background: rgba(255, 255, 255, 0.1);
	border-color: rgba(14, 165, 233, 0.3);
	box-shadow: 0 10px 25px rgba(14, 165, 233, 0.1);
}
</style>
