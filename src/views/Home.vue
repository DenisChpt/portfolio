<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import ContentPanel from '../components/ContentPanel.vue'

const { t } = useI18n()

// Animation des sections
onMounted(() => {
	gsap.from('.home-content', {
		opacity: 0,
		y: 30,
		duration: 1,
		ease: 'expo.out',
		delay: 0.4,
	})
})
</script>

<template>
	<div class="section flex items-center justify-center pt-24">
		<div class="home-content max-w-4xl mx-auto p-8">
			<ContentPanel>
				<div class="text-center">
					<h1
						class="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500 mb-6"
					>
						{{ t('home.title') }}
					</h1>

					<p class="text-xl md:text-2xl text-indigo-100 mb-10">
						{{ t('home.subtitle') }}
					</p>

					<div
						class="terminal bg-gray-900/70 p-4 rounded-lg font-mono text-sm mb-10 border border-indigo-500/20"
					>
						<div class="mb-2 text-gray-400">
							<span class="text-indigo-400">~</span> $ <span class="typing-effect">whoami</span>
						</div>
						<div class="text-indigo-400 mb-2">Denis Chapot • Full Stack Developer</div>
						<div class="mb-2 text-gray-400">
							<span class="text-indigo-400">~</span> $
							<span class="typing-effect">skills --list</span>
						</div>
						<div class="text-indigo-400 flex flex-wrap gap-2">
							<span class="px-2 py-1 bg-indigo-900/30 rounded-md">Vue.js</span>
							<span class="px-2 py-1 bg-indigo-900/30 rounded-md">TypeScript</span>
							<span class="px-2 py-1 bg-indigo-900/30 rounded-md">Node.js</span>
							<span class="px-2 py-1 bg-indigo-900/30 rounded-md">TailwindCSS</span>
							<span class="px-2 py-1 bg-indigo-900/30 rounded-md">GraphQL</span>
							<span class="px-2 py-1 bg-indigo-900/30 rounded-md">MongoDB</span>
						</div>
					</div>

					<div class="flex flex-wrap justify-center gap-4">
						<router-link to="/projects" class="btn-futuristic inline-flex items-center">
							<span>View Projects</span>
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
						</router-link>

						<router-link to="/contact" class="btn-outline-futuristic inline-flex items-center">
							<span>Contact Me</span>
						</router-link>
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

.typing-effect {
	position: relative;
}

.typing-effect::after {
	content: '';
	position: absolute;
	right: -10px;
	top: 50%;
	transform: translateY(-50%);
	width: 6px;
	height: 15px;
	background-color: #6366f1;
	animation: blink 1s step-end infinite;
}

.btn-futuristic {
	background: rgba(99, 102, 241, 0.2);
	color: rgba(165, 180, 252, 1);
	padding: 0.75rem 1.5rem;
	border-radius: 0.375rem;
	font-weight: 500;
	border: 1px solid rgba(99, 102, 241, 0.4);
	position: relative;
	overflow: hidden;
	transition: all 0.3s;
	box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.btn-futuristic::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
	transition: 0.5s;
}

.btn-futuristic:hover {
	background: rgba(99, 102, 241, 0.3);
	box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
	transform: translateY(-2px);
}

.btn-futuristic:hover::before {
	left: 100%;
}

.btn-outline-futuristic {
	background: transparent;
	color: rgba(165, 180, 252, 1);
	padding: 0.75rem 1.5rem;
	border-radius: 0.375rem;
	font-weight: 500;
	border: 1px solid rgba(99, 102, 241, 0.4);
	transition: all 0.3s;
}

.btn-outline-futuristic:hover {
	border-color: rgba(99, 102, 241, 0.8);
	box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
	transform: translateY(-2px);
}

@keyframes blink {
	from,
	to {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
}
</style>
