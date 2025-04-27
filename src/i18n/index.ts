import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import ar from './locales/ar.json'
import es from './locales/es.json'
import pt from './locales/pt.json'

export default createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: {
		en,
		fr,
		de,
		ar,
		es,
		pt,
	},
})
