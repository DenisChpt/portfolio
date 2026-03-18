export const config = {
	email: import.meta.env.VITE_EMAIL || 'contact@example.com',
	github: {
		username: import.meta.env.VITE_GITHUB_USERNAME || 'username',
		url: `https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'username'}`,
	},
	linkedin: {
		username: import.meta.env.VITE_LINKEDIN_USERNAME || 'username',
		url: `https://www.linkedin.com/in/${import.meta.env.VITE_LINKEDIN_USERNAME || 'username'}/`,
	},
	apiUrl: import.meta.env.VITE_API_URL || '/api/contact',
	isProduction: import.meta.env.PROD,
	isDevelopment: import.meta.env.DEV,
}

export const getMailtoLink = (email?: string) => `mailto:${email || config.email}`
