/**
 * Vercel Serverless Function for Discord Contact Form
 * This function is automatically deployed to Vercel and handles contact form submissions
 * The Discord webhook URL is stored securely in Vercel environment variables
 */

export default async function handler(req, res) {
  // Enable CORS for your domain only
  const allowedOrigins = [
    'https://denischpt-portfolio.fr',
    'https://www.denischpt-portfolio.fr',
    // Vercel preview deployments (optional)
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
  ].filter(Boolean)

  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  // Check if Discord webhook is configured
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URL not configured in Vercel environment')
    return res.status(500).json({
      success: false,
      error: 'Le service de contact n\'est pas configuré correctement.'
    })
  }

  const { name, email, message } = req.body

  // Input validation
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Le nom doit contenir au moins 2 caractères'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
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

  // Sanitize input to prevent injection
  const sanitizedName = name.trim().substring(0, 100)
  const sanitizedEmail = email.trim().toLowerCase().substring(0, 100)
  const sanitizedMessage = message.trim().substring(0, 2000)

  // Get user IP for logging (Vercel provides this)
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  // Create Discord embed
  const embed = {
    title: '📬 Nouveau message du portfolio',
    color: 0x6366f1, // Indigo color
    fields: [
      {
        name: '👤 Nom',
        value: sanitizedName,
        inline: true,
      },
      {
        name: '📧 Email',
        value: sanitizedEmail,
        inline: true,
      },
      {
        name: '💬 Message',
        value: sanitizedMessage,
        inline: false,
      },
      {
        name: '🌐 IP',
        value: userIp || 'Unknown',
        inline: true,
      },
      {
        name: '📅 Date',
        value: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        inline: true,
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Portfolio Contact Form - denischpt-portfolio.fr',
    },
  }

  const payload = {
    embeds: [embed],
    username: 'Portfolio Bot',
  }

  try {
    // Send to Discord webhook
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      // Log error but don't expose Discord errors to client
      console.error('Discord webhook failed:', response.status, response.statusText)
      return res.status(500).json({
        success: false,
        error: 'Impossible d\'envoyer le message. Veuillez réessayer.'
      })
    }

    // Success
    console.log(`Contact form submitted: ${sanitizedEmail}`)
    return res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès!'
    })

  } catch (error) {
    // Log error but don't expose internal errors to client
    console.error('Error sending to Discord:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Une erreur est survenue. Veuillez réessayer plus tard.'
    })
  }
}