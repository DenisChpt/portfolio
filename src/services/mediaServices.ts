import { AVATAR_SIZE, EXTERNAL_URLS } from '@/constants/app.constants'

export const getPlaceholder = (width: number, height: number, text?: string): string => {
	if (text) {
		return `${EXTERNAL_URLS.PLACEHOLDER_IMAGE}/${width}x${height}?text=${encodeURIComponent(text)}`
	}
	return `${EXTERNAL_URLS.PLACEHOLDER_IMAGE}/${width}x${height}`
}

export const getAvatar = (seed: string, size = AVATAR_SIZE.DEFAULT): string => {
	return `${EXTERNAL_URLS.AVATAR_API}?seed=${encodeURIComponent(seed)}&size=${size}`
}

export const getBlurredPlaceholder = (width: number, height: number, color = '1e293b'): string => {
	const svg = `
	  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
		<filter id="blur" x="0" y="0">
		  <feGaussianBlur stdDeviation="20" />
		</filter>
		<rect width="100%" height="100%" fill="#${color}" filter="url(#blur)" />
	  </svg>
	`
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`
}

export const isImageValid = (url: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const img = new Image()
		img.onload = () => resolve(true)
		img.onerror = () => resolve(false)
		img.src = url
	})
}
