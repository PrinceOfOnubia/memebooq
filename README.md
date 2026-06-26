# Memebooq

Memebooq is a Next.js frontend with a lightweight backend for public data and deployment support.

## What’s included

- Updated landing page branding and copy
- Memebooq wordmark and icon favicon
- Backend API for Railway deployment
- Frontend-to-backend connection through `NEXT_PUBLIC_API_URL`

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
npm run start
```

## Environment files

Frontend `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
```

Backend `backend/.env.example`:

```bash
PORT=8080
CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
CLIENT_ORIGIN=http://localhost:3000
```

## Deployment

- Deploy the frontend from the repo root to Vercel
- Deploy the backend from `backend/` to Railway
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Railway backend URL
- Set `CORS_ORIGIN` in Railway to include your Vercel domain

## Notes

- No real `.env` files are committed
- No secrets are committed
- `node_modules` is ignored
- README stays updated with the current setup
