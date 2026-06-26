# Memebooq

Memebooq is a Next.js frontend with a lightweight Node backend for public data, branding and deployment support.

## What changed

- Public landing page updated to the supplied Memebooq brand and layout.
- Logo mark is used in the header, landing art and favicon.
- Public hero copy now reads:
  - Create challenges.
  - Grow your community.
  - Earn rewards.
- Hero buttons now say:
  - Open the Book
  - Explore Challenges
- Backend added for Railway deployment with CORS and JSON endpoints.

## Local development

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Environment variables

Frontend `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Backend `.env.example`:

```bash
PORT=8080
CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
CLIENT_ORIGIN=http://localhost:3000
```

## Deployment

- Deploy the frontend from the repo root to Vercel.
- Deploy the backend from `backend/` to Railway.
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Railway backend URL.
- Set `CORS_ORIGIN` in Railway to include the Vercel URL and local dev origin.

## Notes

- No real `.env` files are committed.
- `node_modules` remains ignored.
- Public data endpoints live under `/api/*` on the backend.
