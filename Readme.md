# URL Shortener

A simple URL shortener built with Next.js and TypeScript for the campus hiring evaluation.

## Features

- Shorten long URLs with custom or auto-generated codes
- Set expiry time (1-10080 minutes, default 30)
- View statistics and click tracking
- Integrated logging middleware
- Responsive design with Tailwind CSS

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Shorten URL**: Enter URL, set validity, optionally add custom code
2. **View Stats**: Switch to Statistics tab to see all URLs and clicks
3. **Access Links**: Visit `localhost:3000/[shortcode]` to redirect

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- localStorage for data persistence
- Custom logging middleware

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main app with tabs
│   ├── [shortcode]/page.tsx     # Redirect handler
│   └── layout.tsx + globals.css
├── components/
│   ├── URLShortener.tsx         # Form + URL list
│   └── Statistics.tsx           # Analytics dashboard
└── lib/
    ├── logging.ts               # Logging middleware
    └── storage.ts               # localStorage utils
```

## Key Implementation

- **Logging**: Sends logs to `http://20.244.56.144/evaluation-service/logs`
- **Validation**: URL format, shortcode uniqueness, expiry limits
- **Storage**: Browser localStorage with JSON serialization
- **Routing**: Dynamic routes for shortcode redirects

Built in 2 hours for campus hiring evaluation.