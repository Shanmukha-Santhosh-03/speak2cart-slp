# Deployment Guide

## Overview
The application consists of a React/Vite frontend and a Python FastAPI machine learning backend.

## Frontend
- **Framework**: React (TypeScript) + Vite
- **Deployment Targets**: Vercel, Netlify, Cloudflare Pages, or AWS S3.
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

## Backend (ML API)
- **Framework**: FastAPI (Python)
- **Requirements**: `python 3.10+`, `tensorflow`, `fastapi`, `uvicorn`
- **Deployment Targets**: Heroku, Render, AWS EC2, or Google Cloud Run.
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port 8000`
- **Important**: The backend requires the `ml/artifacts/` folder containing the saved model `.keras` file and the JSON tokenizer/label encoders.

## Environment Variables
If deployed, the frontend needs to know where the ML API lives. 
By default, the code hardcodes `http://localhost:8000/predict-intent`. 
For production, this should be swapped to an environment variable in Vite, e.g., `VITE_ML_API_URL`.

## Known Deployment Limitations
- **Hosting Credentials**: This project is prepared for deployment, but requires actual platform credentials to push live.
- **Model Size**: The TensorFlow dependency is large (~400MB). A lightweight hosting solution might experience slow cold-starts. AWS Lambda may require containerization due to size limits.
- **HTTPS Requirement**: Browser Speech Recognition (Web Speech API) strictly requires HTTPS to function without repeatedly prompting for microphone permission. Any deployed frontend *must* be served over HTTPS.
