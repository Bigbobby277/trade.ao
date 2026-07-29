# Trader.ai

An AI-powered market intelligence platform — reads live financial headlines,
runs each one through Claude to score market impact/sentiment, and streams the
result to a dashboard. Built in the same product category as tools like MRKT,
with original branding, copy, and code.

## Stack

- **Frontend:** React + Vite, React Router
- **Backend:** Node/Express, MongoDB (Mongoose), JWT auth
- **AI engine:** Claude (Anthropic API) — reads headlines, returns structured impact/sentiment JSON
- **News source:** free financial RSS feeds (Yahoo Finance, Investing.com, MarketWatch) — swap in a paid provider later if you want lower latency
- **Payments:** Stripe Checkout + webhooks (subscriptions)

## What's real vs. what you need to add

This is a working scaffold, not a mockup — the AI analysis genuinely calls
Claude and returns real interpretations, auth genuinely issues JWTs, and
Stripe checkout genuinely creates subscriptions. What you need to supply:

1. A MongoDB database (free tier: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
2. An Anthropic API key ([console.anthropic.com](https://console.anthropic.com)) — new accounts get free trial credits; production traffic is pay-as-you-go (this is a small model call per headline, so costs stay low even at a few hundred headlines/day)
3. A Stripe account in test mode (free) — switch to live keys when you're ready to charge real cards
4. Somewhere to host it — Render, Railway, or Fly.io all have free/cheap tiers for the backend; Vercel or Netlify for the frontend

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api` to `http://localhost:4000`, so run
both at once.

## Stripe webhook (local testing)

```bash
stripe listen --forward-to localhost:4000/api/subscription/webhook
```

## Notes on the name and branding

"Trader.ai" and the design here are original — palette, typography, copy, and
component structure were built fresh rather than copied. Don't reuse MRKT's
logo, brand assets, or exact marketing copy; that crosses from "similar
product category" into IP infringement. Everything in this repo is safe to
use as-is.

## Legal disclaimer

If you launch this for real users, you'll want a disclaimer like MRKT's own
(this platform is informational, not investment advice, not a brokerage) —
and depending on your jurisdiction, you may need to register as an investment
adviser or add specific disclosures if the AI output reads as advice rather
than analysis. Worth a quick pass by a lawyer before charging money for it.
