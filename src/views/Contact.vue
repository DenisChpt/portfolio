<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageAnimation } from '@/composables/useAnimation'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { ContactForm } from '@/types/project'
import { IconEmail, IconLocation, IconGithub, IconLinkedin } from '@/components/icons'
import { sendToDiscord, validateContactForm } from '@/services/discord'
import { config } from '@/config'

const { t } = useI18n()
const errorMessage = ref<string>('')

// Initial form values
const initialValues: ContactForm = {
	name: '',
	email: '',
	message: '',
}

// Function to handle actual Discord submission
const submitToDiscord = async (values: ContactForm) => {
	// Validate form data
	const validationError = validateContactForm(values)
	if (validationError) {
		errorMessage.value = validationError
		throw new Error(validationError)
	}
	
	// Clear any previous error
	errorMessage.value = ''
	
	// Send to Discord
	await sendToDiscord(values)
}

// Use our form handling composable with Discord integration
const { form, isLoading, isSuccess, handleSubmit } = useFormSubmit<ContactForm>(
	initialValues,
	submitToDiscord,
	{
		resetAfter: true,
		resetDelay: 3000,
		onError: (err) => {
			console.error('Form submission error:', err)
			if (!errorMessage.value) {
				errorMessage.value = 'Failed to send message. Please try again later.'
			}
		},
	}
)

// Use our animation composable
usePageAnimation('.contact-window', 0.2)
</script>

<template>
	<div class="min-h-screen pt-32 pb-16">
		<!-- Animated background -->
		<div class="fixed inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/10 to-gray-900"></div>
			<div class="absolute top-64 right-48 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-64 left-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
		</div>
		
		<div class="contact-window max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="text-center mb-12">
				<h1 class="text-5xl md:text-7xl font-bold mb-6">
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
						{{ t('contact.title') }}
					</span>
				</h1>
				<p class="text-xl text-gray-300 max-w-3xl mx-auto">
					{{ t('contact.subtitle') }}
				</p>
				<div class="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<!-- Contact Info -->
				<div class="space-y-8">
					<div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
						<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
							{{ t('contact.getInTouchTitle') }}
						</h2>
						<p class="text-gray-300 mb-8">
							{{ t('contact.getInTouch') }}
						</p>

						<div class="space-y-6">
							<div class="flex items-center gap-4 group">
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
									<IconEmail />
								</div>
								<div>
									<p class="text-sm text-gray-400">{{ t('contact.emailLabel') }}</p>
									<a :href="`mailto:${config.email}`" class="text-gray-200 hover:text-indigo-300 transition-colors">
										{{ config.email }}
									</a>
								</div>
							</div>

							<div class="flex items-center gap-4 group">
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
									<IconLocation />
								</div>
								<div>
									<p class="text-sm text-gray-400">{{ t('contact.locationLabel') }}</p>
									<p class="text-gray-200">{{ t('contact.locationValue') }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Social Links -->
					<div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
						<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
							{{ t('contact.connectWithMe') }}
						</h2>
						<div class="flex gap-4">
							<a
								:href="config.github.url"
								target="_blank"
								rel="noopener noreferrer"
								class="group w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-300"
							>
								<IconGithub class="w-5 h-5" />
							</a>

							<a
								:href="config.linkedin.url"
								target="_blank"
								rel="noopener noreferrer"
								class="group w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-300"
							>
								<IconLinkedin class="w-5 h-5" />
							</a>

							<a
								:href="`mailto:${config.email}`"
								class="group w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-300"
							>
								<IconEmail class="w-5 h-5" />
							</a>
						</div>
					</div>
				</div>

				<!-- Contact Form -->
				<div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
					<h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
						{{ t('contact.sendMessageTitle') }}
					</h2>
					<form @submit="handleSubmit" class="space-y-6">
						<div
							v-if="isSuccess"
							class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl text-center font-medium"
							role="alert"
						>
							✓ {{ t('contact.messageSent') }}
						</div>

						<div>
							<label class="block text-gray-300 font-medium mb-2" for="name">
								{{ t('contact.name') }}
							</label>
							<input
								v-model="form.name"
								type="text"
								id="name"
								class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
								:placeholder="t('contact.namePlaceholder')"
								required
								:disabled="isLoading"
								aria-required="true"
							/>
						</div>

						<div>
							<label class="block text-gray-300 font-medium mb-2" for="email">
								{{ t('contact.email') }}
							</label>
							<input
								v-model="form.email"
								type="email"
								id="email"
								class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
								:placeholder="t('contact.emailPlaceholder')"
								required
								:disabled="isLoading"
								aria-required="true"
							/>
						</div>

						<div>
							<label class="block text-gray-300 font-medium mb-2" for="message">
								{{ t('contact.message') }}
							</label>
							<textarea
								v-model="form.message"
								id="message"
								class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 resize-none"
								:placeholder="t('contact.messagePlaceholder')"
								rows="5"
								required
								:disabled="isLoading"
								aria-required="true"
							></textarea>
						</div>

						<!-- Error Message -->
						<div v-if="errorMessage && !isSuccess" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
							<p class="text-red-400 text-sm">{{ errorMessage }}</p>
						</div>

						<!-- Success Message -->
						<div v-if="isSuccess" class="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
							<p class="text-green-400 text-sm">{{ t('contact.messageSent') }}</p>
						</div>

						<div class="flex justify-end">
							<button
								type="submit"
								:disabled="isLoading || isSuccess"
								class="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span v-if="!isLoading">{{ t('contact.send') }}</span>
								<span v-else class="flex items-center gap-2">
									<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									{{ t('contact.sending') }}
								</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
