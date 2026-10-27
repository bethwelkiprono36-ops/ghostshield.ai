# GhostShield AI

A mobile-first scam-screening web app built with Next.js. It flags common warning patterns in suspicious messages and URLs and gives practical safety advice.

## Features in this starter

- Responsive, futuristic dashboard designed for Android and desktop
- Rule-based message screening with explainable findings
- Optional AI-enhanced analysis through a server-side API call
- No database, account system, or scan history in this starter
- API key is read only on the server from an environment variable

## Important limitations

This is a screening aid, not a guarantee that content is safe or fraudulent. Basic rules can miss sophisticated scams and can flag legitimate messages. It does not check a live threat-intelligence database or verify website ownership. Do not paste passwords, PINs, one-time codes, or other sensitive data.

## Deploy on Vercel from GitHub

1. Create a GitHub repository named `ghostshield-ai`.
2. Upload the contents of this folder to the repository root. Do not upload the ZIP file as the only repository file.
3. In Vercel, choose **Add New → Project**, import `ghostshield-ai`, and keep the detected Next.js settings.
4. Deploy. The rule-based scanner works without an AI key.
5. Optional: in Vercel **Project Settings → Environment Variables**, add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` (`gpt-4.1-mini` by default). Redeploy after adding the variables.
6. Never commit a real API key to GitHub or expose it in frontend code.

## Run locally (optional)

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` for local development. Add secrets only to local environment variables or your hosting provider's environment settings.
