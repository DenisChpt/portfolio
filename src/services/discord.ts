/**
 * Discord webhook service for contact form submissions
 */

interface ContactMessage {
	name: string
	email: string
	message: string
}

import { config } from '@/config'

/**
 * Send a contact form submission to Discord
 * In production: Routes to Vercel serverless function
 * In development: Will fail gracefully (no server running)
 */
export async function sendToDiscord(data: ContactMessage): Promise<void> {
	const apiEndpoint = config.apiUrl

	// In development, show a helpful message
	if (config.isDevelopment) {
		console.warn('📧 Contact form is disabled in development mode')
		console.warn('The form will work when deployed to production on Vercel')
		throw new Error('Le formulaire de contact est désactivé en mode développement. Il fonctionnera en production.')
	}

	try {
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		const result = await response.json()

		if (!response.ok) {
			throw new Error(result.error || 'Erreur lors de l\'envoi du message')
		}

		// Success - message sent
		if (config.isDevelopment) {
			console.log('✅ Message would be sent in production')
		}
	} catch (error) {
		// Log error only in development
		if (config.isDevelopment) {
			console.error('Contact form error:', error)
		}

		// Provide user-friendly error messages
		if (error instanceof Error) {
			// Network errors
			if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
				if (config.isDevelopment) {
					throw new Error('Le formulaire de contact est désactivé en développement.')
				}
				throw new Error('Le service de contact est temporairement indisponible. Veuillez réessayer.')
			}
			throw new Error(error.message)
		}

		throw new Error('Une erreur inattendue s\'est produite. Veuillez réessayer.')
	}
}

/**
 * Validate contact form data before sending
 */
export function validateContactForm(data: ContactMessage): string | null {
	// Removed debug log to avoid exposing data
	
	if (!data.name || data.name.trim().length < 2) {
		return 'Veuillez entrer un nom valide (au moins 2 caractères)'
	}

	if (!data.email || !isValidEmail(data.email)) {
		return 'Veuillez entrer une adresse email valide'
	}

	if (!data.message || data.message.trim().length < 5) {
		return 'Veuillez entrer un message (au moins 5 caractères)'
	}

	return null
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}