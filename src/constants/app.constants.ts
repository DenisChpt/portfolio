export const ANIMATION_DURATION = {
	INSTANT: 0,
	FAST: 200,
	NORMAL: 300,
	MEDIUM: 500,
	SLOW: 800,
	VERY_SLOW: 1000,
	EXTRA_SLOW: 1500,
} as const

export const ANIMATION_DELAY = {
	SHORT: 100,
	NORMAL: 200,
	MEDIUM: 500,
	LONG: 1000,
} as const

export const SIZE = {
	XS: 48,
	SM: 72,
	MD: 96,
	LG: 200,
	XL: 300,
	XXL: 400,
} as const

export const AVATAR_SIZE = {
	SMALL: 48,
	MEDIUM: 96,
	LARGE: 200,
	DEFAULT: 200,
} as const

export const FORM = {
	DEFAULT_RESET_DELAY_MS: 3000,
	DEFAULT_SIMULATE_DELAY_MS: 1500,
	MAX_MESSAGE_LENGTH: 1000,
} as const

export const STORAGE_KEYS = {
	THEME: 'portfolio-theme',
	PROJECT_FILTERS: 'projectFilterTechs',
	PROJECT_SEARCH: 'projectSearchQuery',
} as const

export const EXTERNAL_URLS = {
	GITHUB: 'https://github.com',
	LINKEDIN: 'https://linkedin.com',
	PLACEHOLDER_IMAGE: 'https://via.placeholder.com',
	AVATAR_API: 'https://api.dicebear.com/7.x/avataaars/svg',
} as const
