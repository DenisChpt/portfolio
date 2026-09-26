/**
 * Internationalization Configuration
 *
 * Manages multi-language support for the portfolio:
 * - Supported languages: English (default), French, German, Spanish, Portuguese, Arabic
 * - Only English ships in the main bundle; other locales are loaded on demand
 *
 * @module i18n
 */

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

type Messages = typeof en

const localeLoaders: Record<string, () => Promise<{ default: Messages }>> = {
	fr: () => import('./locales/fr.json'),
	de: () => import('./locales/de.json'),
	ar: () => import('./locales/ar.json'),
	es: () => import('./locales/es.json'),
	pt: () => import('./locales/pt.json'),
}

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: { en } as Record<string, Messages>,
})

/**
 * Starts downloading every locale in the background (e.g. when the language menu opens),
 * so switching language is instant. Dynamic imports are cached, so this is idempotent.
 */
export function prefetchLocales() {
	Object.values(localeLoaders).forEach((load) => load().catch(() => {}))
}

/**
 * Switches the active language, loading its messages first if needed
 */
export async function setLocale(locale: string) {
	const { global } = i18n
	if (!global.availableLocales.includes(locale)) {
		const load = localeLoaders[locale]
		if (!load) return
		global.setLocaleMessage(locale, (await load()).default)
	}
	global.locale.value = locale
	document.documentElement.lang = locale
}

export default i18n
