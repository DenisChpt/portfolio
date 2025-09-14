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
 * Send a contact form submission to Discord via local relay server
 */
export async function sendToDiscord(data: ContactMessage): Promise<void> {
	// Use local relay server (or production server URL when deployed)
	const apiEndpoint = config.apiUrl

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
		console.log('✅ Message envoyé avec succès')
	} catch (error) {
		console.error('Failed to send message:', error)
		
		// Provide user-friendly error messages in French
		if (error instanceof Error) {
			if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
				throw new Error('Le serveur de contact n\'est pas disponible. Assurez-vous que le serveur est démarré (npm run server).')
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