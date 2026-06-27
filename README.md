# Shillcoins

Shillcoins is a Next.js frontend with a lightweight backend for public data and deployment support.

## What’s included

- Updated landing page branding and copy
- Shillcoins wordmark and icon favicon
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
NEXT_PUBLIC_APP_NAME=Shillcoins
NEXT_PUBLIC_API_URL=https://shillcoins-backend.up.railway.app
NEXT_PUBLIC_SITE_URL=https://shillcoins.vercel.app
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_X_CALLBACK_URL=https://shillcoins-backend.up.railway.app/api/auth/x/callback
```

Backend `backend/.env.example`:

```bash
PORT=8080
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000,https://shillcoins.vercel.app
CLIENT_ORIGIN=https://shillcoins.vercel.app
APP_NAME=Shillcoins
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shillcoins
JWT_SECRET=replace_with_a_long_random_secret
SESSION_SECRET=replace_with_another_long_random_secret
CHAIN_ID=56
BNB_RPC_URL=https://bsc-dataseed.binance.org
ADMIN_WALLET=0x0000000000000000000000000000000000000000
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_client_secret
X_CALLBACK_URL=https://shillcoins-backend.up.railway.app/api/auth/x/callback
X_BEARER_TOKEN=your_optional_x_api_bearer_token
```

## Deployment

- Deploy the frontend from the repo root to Vercel as `shillcoins`
- Vercel root directory: `.`
- Vercel framework preset: Next.js
- Vercel build command: `npm run build`
- Vercel install command: `npm install`
- Deploy the backend from `backend/` to Railway as `shillcoins-backend`
- Railway root directory: `backend`
- Railway start command: `npm run start`
- Railway build command: `npm run build`
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Railway backend URL
- Set `CORS_ORIGIN` in Railway to include your Vercel domain
- Set `CLIENT_ORIGIN` in Railway to the same Vercel domain
- Set `X_CALLBACK_URL` to the Railway backend callback URL
- Set `ADMIN_WALLET` to the admin wallet address you want to authorize

## Notes

- No real `.env` files are committed
- No secrets are committed
- `node_modules` is ignored
- README stays updated with the current setup
