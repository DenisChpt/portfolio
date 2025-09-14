/**
 * Local relay server for Discord webhook
 * This server acts as a proxy to bypass CORS restrictions
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 3001

// Discord webhook URL from environment
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

if (!DISCORD_WEBHOOK_URL) {
	console.error('⚠️  DISCORD_WEBHOOK_URL not configured in .env file')
	console.error('Please add your Discord webhook URL to the .env file')
	process.exit(1)
}

// Middleware
app.use(cors({
	origin: ['http://localhost:5173', 'http://localhost:5174', 'https://denischaput.dev'],
	credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'ok', message: 'Discord relay server is running' })
})

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
	console.log('📨 Received contact form submission')
	
	const { name, email, message } = req.body

	// Validate input
	if (!name || name.trim().length < 2) {
		return res.status(400).json({ 
			success: false, 
			error: 'Le nom doit contenir au moins 2 caractères' 
		})
	}

	if (!email || !isValidEmail(email)) {
		return res.status(400).json({ 
			success: false, 
			error: 'Veuillez entrer une adresse email valide' 
		})
	}

	if (!message || message.trim().length < 5) {
		return res.status(400).json({ 
			success: false, 
			error: 'Le message doit contenir au moins 5 caractères' 
		})
	}

	// Create Discord embed
	const embed = {
		title: '📬 Nouveau message du portfolio',
		color: 0x6366f1, // Indigo color
		fields: [
			{
				name: '👤 Nom',
				value: name.trim(),
				inline: true,
			},
			{
				name: '📧 Email',
				value: email.trim(),
				inline: true,
			},
			{
				name: '💬 Message',
				value: message.trim(),
				inline: false,
			},
		],
		timestamp: new Date().toISOString(),
		footer: {
			text: 'Portfolio Contact Form',
		},
	}

	const payload = {
		embeds: [embed],
		username: 'Portfolio Bot',
	}

	try {
		// Send to Discord
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			console.error('❌ Discord webhook failed:', response.status, response.statusText)
			return res.status(500).json({ 
				success: false, 
				error: 'Impossible d\'envoyer le message. Veuillez réessayer.' 
			})
		}

		console.log('✅ Message sent to Discord successfully')
		res.json({ 
			success: true, 
			message: 'Message envoyé avec succès!' 
		})

	} catch (error) {
		console.error('❌ Error sending to Discord:', error)
		res.status(500).json({ 
			success: false, 
			error: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
		})
	}
})

// Email validation helper
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Discord relay server running on http://localhost:${PORT}`)
	console.log('📡 Ready to receive contact form submissions')
	console.log('🔒 Discord webhook URL is securely configured')
})