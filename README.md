# Denis Chaput - Portfolio

A modern, responsive portfolio website highlighting the projects I’ve worked on and my professional path.

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