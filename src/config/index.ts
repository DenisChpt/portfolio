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
	apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/contact',
}

// Helper function to get mailto link
export const getMailtoLink = (email?: string) => `mailto:${email || config.email}`