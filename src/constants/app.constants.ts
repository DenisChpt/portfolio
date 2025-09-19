/**
 * Application-wide constants
 * Centralizes magic numbers, configuration values, and common settings
 */

/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = {
	INSTANT: 0,
	FAST: 200,
	NORMAL: 300,
	MEDIUM: 500,
	SLOW: 800,
	VERY_SLOW: 1000,
	EXTRA_SLOW: 1500,
	SUPER_SLOW: 2000,
	ULTRA_SLOW: 3000,
} as const

/**
 * Animation delay constants (in milliseconds)
 */
export const ANIMATION_DELAY = {
	SHORT: 100,
	NORMAL: 200,
	MEDIUM: 500,
	LONG: 1000,
	VERY_LONG: 2000,
} as const

/**
 * Size constants (in pixels)
 */
export const SIZE = {
	XS: 48,
	SM: 72,
	MD: 96,
	LG: 200,
	XL: 300,
	XXL: 400,
	XXXL: 500,
} as const

/**
 * Avatar specific sizes
 */
export const AVATAR_SIZE = {
	SMALL: 48,
	MEDIUM: 96,
	LARGE: 200,
	DEFAULT: 200,
} as const

/**
 * Form-related constants
 */
export const FORM = {
	DEFAULT_RESET_DELAY_MS: 3000,
	DEFAULT_SIMULATE_DELAY_MS: 1500,
	MIN_PASSWORD_LENGTH: 8,
	MAX_MESSAGE_LENGTH: 1000,
} as const

/**
 * Loader animation constants
 */
export const LOADER = {
	ROTATION_DURATION: 8,
	PROGRESS_DURATION: 3,
	FADE_IN_DURATION: 1.5,
	EXIT_SCALE: 1.3,
	EXIT_DURATION: 0.5,
} as const

/**
 * Circle animation constants
 */
export const CIRCLE = {
	NORMAL_OUTER_RADIUS: 150,
	NORMAL_INNER_RADIUS: 160,
	HOVER_OUTER_RADIUS: 160,
	HOVER_INNER_RADIUS: 150,
	GAP_SIZE_NORMAL: 0.05, // 5%
	GAP_SIZE_HOVER: 0.001, // 0.1%
	ROTATION_OFFSET: 0.333, // 120°
} as const

/**
 * GSAP animation easing presets
 */
export const EASING = {
	DEFAULT: 'power2.out',
	IN: 'power2.in',
	IN_OUT: 'power2.inOut',
	BOUNCE: 'bounce.out',
	ELASTIC: 'elastic.out(1, 0.3)',
	BACK: 'back.out(1.7)',
} as const

/**
 * Breakpoint constants (matching Tailwind breakpoints)
 */
export const BREAKPOINTS = {
	XS: 475,
	SM: 640,
	MD: 768,
	LG: 1024,
	XL: 1280,
	XXL: 1536,
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
	BACKGROUND: -10,
	DEFAULT: 0,
	DROPDOWN: 10,
	STICKY: 20,
	OVERLAY: 30,
	MODAL: 40,
	POPOVER: 50,
	TOOLTIP: 60,
	TOAST: 70,
	LOADER: 100,
} as const

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
	THEME: 'app-theme',
	LANGUAGE: 'app-language',
	PROJECT_FILTERS: 'projectFilterTechs',
	PROJECT_SEARCH: 'projectSearchQuery',
	USER_PREFERENCES: 'user-preferences',
} as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
	CONTACT: '/api/contact',
	PROJECTS: '/api/projects',
	ANALYTICS: '/api/analytics',
} as const

/**
 * External URLs
 */
export const EXTERNAL_URLS = {
	GITHUB: 'https://github.com',
	LINKEDIN: 'https://linkedin.com',
	PLACEHOLDER_IMAGE: 'https://via.placeholder.com',
	AVATAR_API: 'https://api.dicebear.com/7.x/avataaars/svg',
} as const