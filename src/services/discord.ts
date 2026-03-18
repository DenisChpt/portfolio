import { config } from '@/config'
import { createLogger } from '@/services/logger'

interface ContactMessage {
	name: string
	email: string
	message: string
}

const logger = createLogger('DiscordService')

export async function sendToDiscord(data: ContactMessage): Promise<void> {
	if (config.isDevelopment) {
		logger.info('Contact form is disabled in development mode', { email: data.email })
		throw new Error('CONTACT_DISABLED_DEV')
	}

	try {
		const response = await fetch(config.apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})

		const result = await response.json()

		if (!response.ok) {
			throw new Error(result.error || 'SEND_FAILED')
		}

		logger.info('Message sent successfully', { email: data.email })
	} catch (error) {
		logger.error('Failed to send contact form', error)

		if (error instanceof Error) {
			if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
				throw new Error('SERVICE_UNAVAILABLE')
			}
			throw error
		}

		throw new Error('UNKNOWN_ERROR')
	}
}

export function validateContactForm(data: ContactMessage): string | null {
	if (!data.name || data.name.trim().length < 2) {
		return 'INVALID_NAME'
	}

	if (!data.email || !isValidEmail(data.email)) {
		return 'INVALID_EMAIL'
	}

	if (!data.message || data.message.trim().length < 5) {
		return 'INVALID_MESSAGE'
	}

	return null
}

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}
