# Deployment Guide

## Overview
The application consists of a React/Vite frontend hosted on GitHub Pages, utilizing local browser-based TensorFlow.js for Machine Learning inference, and a Cloudflare Worker acting as a secure proxy for the Gemini API (Kitchen Buddy).

## Frontend (GitHub Pages)
- **Framework**: React (TypeScript) + Vite
- **Deployment Target**: GitHub Pages
- **Build/Deployment**: Handled automatically via GitHub Actions (.github/workflows/deploy.yml).
- **Build Command**: npm run build
- **Output Directory**: dist/
- **Routing**: index.html is copied to 404.html to support React SPA routing on GitHub Pages.
- **Environment Variables**:
  - VITE_KITCHEN_BUDDY_API_URL: The public URL of the deployed Cloudflare Worker.

## Machine Learning (TensorFlow.js)
- **Inference**: Conducted entirely locally in the user\'s browser using @tensorflow/tfjs.
- **Model**: The trained Keras BiLSTM model (ml/artifacts/model.keras) was converted to a TFJS Layers model (public/tfjs_model/).
- **Dependencies**: No Python backend is required for production inference, drastically reducing hosting costs to \.

## Kitchen Buddy (Cloudflare Worker)
- **Framework**: Cloudflare Workers
- **Purpose**: Securely proxies requests to the Gemini API so the GEMINI_API_KEY is not exposed in the frontend.
- **Deployment**:
  cd cloudflare
  npm install wrangler -g
  wrangler deploy
  wrangler secret put GEMINI_API_KEY
- **Configuration**: Ensure the deployed worker URL is set as VITE_KITCHEN_BUDDY_API_URL in the GitHub Actions secrets.

## Known Deployment Limitations
- **HTTPS Requirement**: Browser Speech Recognition (Web Speech API) strictly requires HTTPS to function without repeatedly prompting for microphone permission. GitHub Pages automatically provides HTTPS.
