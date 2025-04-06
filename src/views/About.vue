<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import ContentPanel from '../components/ContentPanel.vue'

const { t } = useI18n()

onMounted(() => {
	gsap.from('.about-window', {
		y: 50,
		opacity: 0,
		duration: 1,
		ease: 'expo.out',
		delay: 0.2,
	})
})
</script>

<template>
	<div class="section flex items-center justify-center pt-24">
		<div class="about-window max-w-4xl w-full mx-auto">
			<ContentPanel title="About Me">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<div class="space-y-4 text-indigo-100">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua.
							</p>
							<p>
								Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
								ex ea commodo consequat.
							</p>
							<p>
								Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
								fugiat nulla pariatur.
							</p>
						</div>

						<div class="mt-8">
							<h2 class="text-xl font-semibold text-indigo-400 mb-4">Technologies</h2>
							<div class="flex flex-wrap gap-2">
								<span class="tech-badge">Vue.js</span>
								<span class="tech-badge">TypeScript</span>
								<span class="tech-badge">Node.js</span>
								<span class="tech-badge">Express</span>
								<span class="tech-badge">MongoDB</span>
								<span class="tech-badge">TailwindCSS</span>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<div class="exp-card">
							<h2 class="text-xl font-semibold text-indigo-400 mb-4">Experience</h2>
							<div class="space-y-4">
								<div class="exp-item">
									<h3 class="text-white font-medium">Senior Developer</h3>
									<div class="text-indigo-200 text-sm">TechCorp • 2019 - Present</div>
									<p class="text-gray-300 mt-2">
										Led development of multiple web applications using Vue.js and Node.js.
									</p>
								</div>

								<div class="exp-item opacity-90">
									<h3 class="text-white font-medium">Frontend Developer</h3>
									<div class="text-indigo-200 text-sm">WebSolutions • 2016 - 2019</div>
									<p class="text-gray-300 mt-2">
										Developed responsive and interactive UI components for client projects.
									</p>
								</div>

								<div class="exp-item opacity-80">
									<h3 class="text-white font-medium">Junior Developer</h3>
									<div class="text-indigo-200 text-sm">StartupX • 2014 - 2016</div>
									<p class="text-gray-300 mt-2">
										Built and maintained frontend features for a SaaS product.
									</p>
								</div>
							</div>
						</div>

						<div class="exp-card">
							<h2 class="text-xl font-semibold text-indigo-400 mb-4">Education</h2>
							<div class="exp-item">
								<h3 class="text-white font-medium">M.S. Computer Science</h3>
								<div class="text-indigo-200 text-sm">Tech University • 2012 - 2014</div>
								<p class="text-gray-300 mt-2">
									Specialized in Web Technologies and Software Engineering
								</p>
							</div>
						</div>
					</div>
				</div>
			</ContentPanel>
		</div>
	</div>
</template>

<style scoped>
.section {
	min-height: 100vh;
	padding: 0 1rem;
}

.exp-card {
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(99, 102, 241, 0.15);
	border-radius: 0.75rem;
	padding: 1.25rem;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.exp-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 2px;
	background: linear-gradient(
		90deg,
		rgba(99, 102, 241, 0) 0%,
		rgba(99, 102, 241, 0.6) 50%,
		rgba(99, 102, 241, 0) 100%
	);
}

.exp-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	border-color: rgba(99, 102, 241, 0.3);
}

.exp-item {
	border-left: 2px solid rgba(99, 102, 241, 0.6);
	padding-left: 1rem;
	position: relative;
	transition: all 0.3s ease;
}

.exp-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: -5px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: rgba(99, 102, 241, 0.8);
	box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
}

.exp-item:hover {
	border-left-color: rgba(99, 102, 241, 1);
}

.tech-badge {
	padding: 0.5rem 1rem;
	background: rgba(99, 102, 241, 0.15);
	color: rgba(165, 180, 252, 1);
	border-radius: 0.5rem;
	font-size: 0.875rem;
	border: 1px solid rgba(99, 102, 241, 0.2);
	transition: all 0.3s ease;
}

.tech-badge:hover {
	background: rgba(99, 102, 241, 0.25);
	transform: translateY(-2px);
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
	border-color: rgba(99, 102, 241, 0.4);
}
</style>
