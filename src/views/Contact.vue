<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import ContentWindow from '../components/ContentWindow.vue'

const { t } = useI18n()

const form = ref({
	name: '',
	email: '',
	message: '',
})

const messageSent = ref(false)
const isLoading = ref(false)

const handleSubmit = (e: Event) => {
	e.preventDefault()
	isLoading.value = true

	// Simuler l'envoi du formulaire
	setTimeout(() => {
		isLoading.value = false
		messageSent.value = true

		// Réinitialiser le formulaire
		form.value = {
			name: '',
			email: '',
			message: '',
		}

		// Réinitialiser après 3 secondes
		setTimeout(() => {
			messageSent.value = false
		}, 3000)
	}, 1500)
}

onMounted(() => {
	gsap.from('.contact-window', {
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
		<div class="contact-window max-w-4xl w-full mx-auto">
			<ContentWindow title="portfolio.contact">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<h1
							class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500 mb-6"
						>
							{{ t('contact.title') }}
						</h1>

						<div class="space-y-4 text-gray-300 mb-8">
							<p>
								Feel free to reach out to me for any questions, collaboration opportunities, or just
								to say hello!
							</p>
							<p>I'll get back to you as soon as possible.</p>
						</div>

						<div class="space-y-4">
							<div class="flex items-center space-x-4 text-gray-300">
								<div
									class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
										/>
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
								</div>
								<span>contact@example.com</span>
							</div>

							<div class="flex items-center space-x-4 text-gray-300">
								<div
									class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<span>Paris, France</span>
							</div>

							<div class="mt-8 flex space-x-4">
								<a
									href="#"
									class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-colors duration-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
										/>
									</svg>
								</a>

								<a
									href="#"
									class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-colors duration-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
										/>
									</svg>
								</a>

								<a
									href="#"
									class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-colors duration-200"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>

					<div class="card bg-gray-900/50 p-5 border border-white/10 rounded-xl">
						<form @submit="handleSubmit" class="space-y-4">
							<div
								v-if="messageSent"
								class="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg mb-4 text-center"
							>
								Message sent successfully!
							</div>

							<div>
								<label class="block text-gray-300 text-sm font-medium mb-2" for="name">
									{{ t('contact.name') }}
								</label>
								<input
									v-model="form.name"
									type="text"
									id="name"
									class="input w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200"
									required
									:disabled="isLoading"
								/>
							</div>

							<div>
								<label class="block text-gray-300 text-sm font-medium mb-2" for="email">
									{{ t('contact.email') }}
								</label>
								<input
									v-model="form.email"
									type="email"
									id="email"
									class="input w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200"
									required
									:disabled="isLoading"
								/>
							</div>

							<div>
								<label class="block text-gray-300 text-sm font-medium mb-2" for="message">
									{{ t('contact.message') }}
								</label>
								<textarea
									v-model="form.message"
									id="message"
									class="input w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200"
									rows="5"
									required
									:disabled="isLoading"
								></textarea>
							</div>

							<div class="flex justify-end">
								<button
									type="submit"
									class="btn btn-primary inline-flex items-center space-x-2"
									:disabled="isLoading"
								>
									<span
										v-if="isLoading"
										class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
									></span>
									<span>{{ t('contact.send') }}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</ContentWindow>
		</div>
	</div>
</template>

<style scoped>
.section {
	min-height: 100vh;
	padding: 0 1rem;
}

.card {
	transition: all 0.3s ease;
}
</style>
