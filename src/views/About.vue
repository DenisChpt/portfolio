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
	<div class="section flex items-center justify-center pt-24">
		<div class="about-window max-w-4xl w-full mx-auto">
			<Card title="About Me" variant="panel">
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
								<span v-for="skill in skills.slice(0, 6)" :key="skill.name" class="tech-badge">
									{{ skill.name }}
								</span>
							</div>
						</div>

						<!-- Skill Bars -->
						<div class="mt-8">
							<h2 class="text-xl font-semibold text-indigo-400 mb-4">Top Skills</h2>
							<div class="space-y-3">
								<div v-for="skill in skills.slice(0, 4)" :key="skill.name">
									<div class="flex justify-between mb-1">
										<span class="text-indigo-200">{{ skill.name }}</span>
										<span class="text-indigo-300">{{ skill.level }}%</span>
									</div>
									<div class="h-2 bg-gray-700 rounded overflow-hidden">
										<div
											class="h-full bg-indigo-500 rounded"
											:style="{ width: `${skill.level}%` }"
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<div class="exp-card">
							<h2 class="text-xl font-semibold text-indigo-400 mb-4">Experience</h2>
							<div class="space-y-4">
								<div
									v-for="exp in experiences"
									:key="exp.company"
									class="exp-item"
									:style="exp.opacity ? { opacity: exp.opacity } : {}"
								>
									<h3 class="text-white font-medium">{{ exp.role }}</h3>
									<div class="text-indigo-200 text-sm">{{ exp.company }} • {{ exp.period }}</div>
									<p class="text-gray-300 mt-2">
										{{ exp.description }}
									</p>
								</div>
							</div>
						</div>

						<div class="exp-card">
							<h2 class="text-xl font-semibold text-indigo-400 mb-4">Education</h2>
							<div class="space-y-4">
								<div v-for="edu in education" :key="edu.institution" class="exp-item">
									<h3 class="text-white font-medium">{{ edu.degree }}</h3>
									<div class="text-indigo-200 text-sm">
										{{ edu.institution }} • {{ edu.period }}
									</div>
									<p class="text-gray-300 mt-2">
										{{ edu.description }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>
