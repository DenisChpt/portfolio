<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageAnimation } from '@/composables/useAnimation'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { ContactForm } from '@/types/project'
import Card from '@/components/Card.vue'
import Button from '@/components/Button.vue'
import { IconEmail, IconLocation, IconGithub, IconLinkedin, IconTwitter } from '@/components/icons'

const { t } = useI18n()

// Initial form values
const initialValues: ContactForm = {
	name: '',
	email: '',
	message: '',
}

// Use our form handling composable
const { form, isLoading, isSuccess, handleSubmit } = useFormSubmit<ContactForm>(
	initialValues,
	undefined, // No actual API call, using simulation
	{
		resetAfter: true,
		resetDelay: 3000,
		simulateDelay: 1500,
	}
)

// Use our animation composable
usePageAnimation('.contact-window', 0.2)
</script>

<template>
	<div class="section flex items-center justify-center pt-24">
		<div class="contact-window max-w-4xl w-full mx-auto">
			<Card title="portfolio.contact" variant="window">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<h1 class="text-3xl font-bold gradient-text mb-6">
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
									<IconEmail />
								</div>
								<span>contact@example.com</span>
							</div>

							<div class="flex items-center space-x-4 text-gray-300">
								<div
									class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400"
								>
									<IconLocation />
								</div>
								<span>Paris, France</span>
							</div>

							<div class="mt-8 flex space-x-4">
								<a
									href="#"
									class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-colors duration-200"
								>
									<IconGithub />
								</a>

								<a
									href="#"
									class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-colors duration-200"
								>
									<IconLinkedin />
								</a>

								<a
									href="#"
									class="w-10 h-10 rounded-full bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-300 hover:text-primary-400 transition-colors duration-200"
								>
									<IconTwitter />
								</a>
							</div>
						</div>
					</div>

					<Card variant="default">
						<form @submit="handleSubmit" class="space-y-4">
							<div
								v-if="isSuccess"
								class="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg mb-4 text-center"
								role="alert"
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
									class="input"
									required
									:disabled="isLoading"
									aria-required="true"
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
									class="input"
									required
									:disabled="isLoading"
									aria-required="true"
								/>
							</div>

							<div>
								<label class="block text-gray-300 text-sm font-medium mb-2" for="message">
									{{ t('contact.message') }}
								</label>
								<textarea
									v-model="form.message"
									id="message"
									class="input"
									rows="5"
									required
									:disabled="isLoading"
									aria-required="true"
								></textarea>
							</div>

							<div class="flex justify-end">
								<Button type="submit" variant="primary" :loading="isLoading">
									{{ t('contact.send') }}
								</Button>
							</div>
						</form>
					</Card>
				</div>
			</Card>
		</div>
	</div>
</template>
