/**
 * Media service for handling images, placeholders and other media
 */

import { AVATAR_SIZE, EXTERNAL_URLS } from '@/constants/app.constants'

/**
 * Get a placeholder image URL with specified dimensions
 * @param width Width of the placeholder image
 * @param height Height of the placeholder image
 * @param text Optional text to display on the placeholder
 * @returns Placeholder image URL
 */
export const getPlaceholder = (width: number, height: number, text?: string): string => {
	if (text) {
		return `${EXTERNAL_URLS.PLACEHOLDER_IMAGE}/${width}x${height}?text=${encodeURIComponent(text)}`
	}
	return `${EXTERNAL_URLS.PLACEHOLDER_IMAGE}/${width}x${height}`
}

/**
 * Get a random avatar image
 * @param seed Seed to generate consistent avatars (e.g. user id or name)
 * @param size Size of the avatar in pixels
 * @returns Avatar image URL
 */
export const getAvatar = (seed: string, size = AVATAR_SIZE.DEFAULT): string => {
	return `${EXTERNAL_URLS.AVATAR_API}?seed=${encodeURIComponent(seed)}&size=${size}`
}

/**
 * Get a blurred placeholder for images that are loading
 * @param width Width of the placeholder
 * @param height Height of the placeholder
 * @param color Color of the placeholder (hex without #)
 * @returns SVG data URL for the placeholder
 */
export const getBlurredPlaceholder = (width: number, height: number, color = '1e293b'): string => {
	// Create a simple SVG with a blurred rectangle
	const svg = `
	  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
		<filter id="blur" x="0" y="0">
		  <feGaussianBlur stdDeviation="20" />
		</filter>
		<rect width="100%" height="100%" fill="#${color}" filter="url(#blur)" />
	  </svg>
	`

	// Convert to a data URL
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`
}

/**
 * Check if an image URL is valid
 * @param url URL to check
 * @returns Promise that resolves to a boolean indicating if the image is valid
 */
export const isImageValid = (url: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const img = new Image()
		img.onload = () => resolve(true)
		img.onerror = () => resolve(false)
		img.src = url
	})
}
