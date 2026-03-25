# Deploy Shine Web App (Free)

This project is configured for one-click deployment on Netlify and Vercel.

## Before Deploy

1. Push this folder to a GitHub repository.
2. Make sure the repo contains:
   - `netlify.toml`
   - `vercel.json`
   - `package.json` with `build:web` script

## Netlify (One Click)

1. Go to https://app.netlify.com/start
2. Import your GitHub repo.
3. Netlify auto-detects:
   - Build command: `npm run build:web`
   - Publish directory: `dist`
4. Click Deploy.

## Vercel (One Click)

1. Go to https://vercel.com/new
2. Import your GitHub repo.
3. Vercel auto-detects from `vercel.json`:
   - Install command: `npm install`
   - Build command: `npm run build:web`
   - Output directory: `dist`
4. Click Deploy.

## Install on iPhone as an App

1. Open deployed URL in Safari.
2. Tap Share icon.
3. Tap "Add to Home Screen".

This creates a stable home-screen app shortcut with no 7-day expiry.
