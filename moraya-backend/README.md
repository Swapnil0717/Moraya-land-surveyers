# moraya-backend

Cloudflare Worker API + Supabase database setup for Moraya Land Surveyors. Currently: **login**.

```
moraya-frontend → this Worker (/api/*) → Supabase (Auth, Postgres, RLS)
```

## 1. Database (once)

1. Create a Supabase project.
2. SQL Editor → run `supabase/migrations/0001_auth_foundation.sql`.
3. Authentication → Users → **Add user** (your email + password, tick *Auto Confirm User*).
4. SQL Editor → edit your name/email in `supabase/seed_main_admin.sql` and run it. This creates the Main Admin.

## 2. Run locally

```bash
npm install
cp .dev.vars.example .dev.vars     # Windows: copy .dev.vars.example .dev.vars
# edit .dev.vars: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm run dev                        # http://localhost:8787
```

Check it: http://localhost:8787/api/health → `{"ok":true}`

## 3. Deploy

1. Edit `wrangler.jsonc`: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (public) and `ALLOWED_ORIGINS` (add your deployed frontend URL).
2. `npx wrangler login`
3. `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY`
4. `npm run deploy`

## API

`GET /api/health` → `{ ok: true }`

`GET /api/me` (Authorization: Bearer <Supabase token>)
1. Verifies the token with Supabase Auth.
2. Finds the employee record for that user.
3. Rejects `inactive` / `revoked` accounts and logins with no employee record.
4. Returns name, role and permissions (Main Admin = all, Sub-Admin = granted, Surveyor = none).
   Aadhaar and salary are never returned.

Errors: `UNAUTHENTICATED` 401 · `NO_PROFILE` / `ACCOUNT_INACTIVE` / `ACCESS_REVOKED` 403 · `UPSTREAM_UNAVAILABLE` 502 · `SERVER_NOT_CONFIGURED` 500 · `NOT_FOUND` 404.

CORS: only origins listed in `ALLOWED_ORIGINS` are answered.

## Database rules enforced by Postgres

- Exactly one Main Admin; cannot be demoted, deactivated, revoked or deleted.
- Employees are never deleted. Audit logs are append-only.
- Permissions can only belong to Sub-Admins (cleared if the role changes).
- RLS: browsers can read only their own employee row; they cannot write anything.

## Commands

`npm run dev` · `npm test` (Vitest) · `npm run typecheck` · `npm run deploy`

The service-role key lives only in `.dev.vars` (local) and Cloudflare secrets (production).
