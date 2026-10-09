# moraya-frontend

React + TypeScript + Vite + Tailwind PWA for Moraya Land Surveyors. Currently: **login page**.
It talks to `moraya-backend` (Cloudflare Worker) and to Supabase Auth with the public anon key only.

## Run locally

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (leave VITE_API_URL empty)
npm run dev
```

Start `moraya-backend` too (`npm run dev` in that folder, port 8787). Open http://localhost:5173/login

## Deploy (Cloudflare)

1. Deploy `moraya-backend` first and copy its URL.
2. Put it in `.env` as `VITE_API_URL=https://moraya-backend.<your-subdomain>.workers.dev`
3. `npx wrangler login` then `npm run deploy` (builds and uploads `dist/` as static assets).
4. Add the deployed frontend URL to `ALLOWED_ORIGINS` in `moraya-backend/wrangler.jsonc` and redeploy the backend.

## Structure

```
src/
  features/auth/   LoginPage, AuthProvider, authService, loginSchema, useMe, ProtectedRoute
  components/      Logo (original), LanguageToggle, ThemeToggle
  i18n/            English + मराठी messages
  theme/           light / dark
  lib/             api client, supabase client, queryClient
  pages/           DashboardPlaceholder (temporary)
```

Never put the Supabase service-role key in this project.
