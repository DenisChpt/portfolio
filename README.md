# Denis Chaput - Portfolio

A modern, responsive portfolio website showcasing my professional experience, projects, and technical expertise in software engineering, optimization, and cybersecurity.

## Features

- **Multi-language Support**: Available in 6 languages (English, French, German, Spanish, Portuguese, Arabic)
- **Responsive Design**: Optimized for all devices and screen sizes
- **Interactive Animations**: Smooth GSAP-powered animations and particle effects
- **Project Showcase**: Dynamic filtering and detailed project presentations
- **Research Section**: Academic publications and research work display (configurable via i18n)

## Technologies

### Core
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animation library
- **Canvas API** - Custom particle animation system

### State & Routing
- **Pinia** - Vue.js state management
- **Vue Router** - Official router for Vue.js
- **Vue i18n** - Internationalization plugin

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/DenisChpt/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env file and add your Discord webhook URL (optional, for contact form)
# VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

⚠️ **Important Note about Contact Form:**
- **Development mode** (`npm run dev`): Contact form shows a warning message
- **Preview mode** (`npm run preview`): Contact form returns 404 (expected behavior)
- **Production** (Vercel): Contact form fully functional

### API Behavior by Environment

| Environment | Command | URL | Contact Form Status |
|------------|---------|-----|-------------------|
| Development | `npm run dev` | `http://localhost:5173` | Shows warning message |
| Preview | `npm run preview` | `http://localhost:4173` | Returns 404 (no API server) |
| Production | (deployed) | `https://your-domain.vercel.app` | ✅ Fully functional |

The contact form API endpoint (`/api/contact`) is a Vercel serverless function that only exists in production.

### Deployment on Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variable in Vercel dashboard:
   ```
   DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
   ```
4. Deploy

Vercel will automatically:
- Build the Vue app
- Create serverless function from `api/contact.js`
- Handle all routing and API endpoints

## Project Structure

```
portfolio/
├── api/                # Vercel serverless functions
│   └── contact.js      # Contact form API endpoint
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page components
│   ├── stores/         # Pinia state stores
│   ├── services/       # API services and utilities
│   │   ├── logger.ts   # Professional logging system
│   │   └── discord.ts  # Contact form service
│   ├── constants/      # Application constants
│   ├── i18n/           # Internationalization files
│   ├── composables/    # Vue composition utilities
│   ├── router/         # Routing configuration
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── package.json        # Project dependencies
```

## Configuration

### Environment Variables
The portfolio uses environment variables for the contact form. Create a `.env` file based on `.env.example`:

```bash
# Discord Webhook for Contact Form (used by Express server)
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Server configuration
SERVER_PORT=3001

# API URL for production (optional)
# VITE_API_URL=https://your-server.com/api/contact

# Contact Information (public but centralized)
VITE_EMAIL=your.email@example.com
VITE_GITHUB_USERNAME=your-github-username
VITE_LINKEDIN_USERNAME=your-linkedin-username
```

#### Setting up Discord Webhook:
1. Go to your Discord server settings
2. Navigate to Integrations → Webhooks
3. Create a new webhook and copy the URL
4. Add it to your `.env` file

#### Contact Form Architecture:
The contact form uses a relay server to bypass CORS restrictions:
- **Local**: Vue app → Express server (localhost:3001) → Discord
- **Production**: Vue app → Your server → Discord

**Security Benefits:**
- Discord webhook URL never exposed to client
- No CORS issues
- Server-side validation
- Works with any hosting provider

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License

Copyright (c) 2025 Denis Chaput

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.