/**
 * Configuration centralized from environment variables
 */

export const config = {
	// Contact information
	email: import.meta.env.VITE_EMAIL || 'contact@example.com',
	github: {
		username: import.meta.env.VITE_GITHUB_USERNAME || 'username',
		url: `https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'username'}`,
	},
	linkedin: {
		username: import.meta.env.VITE_LINKEDIN_USERNAME || 'username',
		url: `https://www.linkedin.com/in/${import.meta.env.VITE_LINKEDIN_USERNAME || 'username'}/`,
	},

	// API configuration
	// In production: Vercel will handle /api/contact
	// In development: contact form will show but won't actually send (no server running)
	apiUrl: import.meta.env.VITE_API_URL || '/api/contact',

	// Feature flags
	isProduction: import.meta.env.PROD,
	isDevelopment: import.meta.env.DEV,
}

// Helper function to get mailto link
export const getMailtoLink = (email?: string) => `mailto:${email || config.email}`