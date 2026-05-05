# tsd-modernization-app

Public audit tool (`/audit`) and authenticated client portal (`/app` + `/admin`) for TSD Modernization Solutions. Deploys as a separate Next.js project alongside the existing Vite marketing site; Vercel rewrites on the marketing site expose these routes on `tsd-modernization.com`.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind 4
- Supabase (Postgres + Auth + Storage)
- Anthropic Claude API for audit synthesis
- Resend for transactional email
- Google Places API + cheerio for V1 scraping (Vercel functions, no worker yet)
- Upstash for rate limiting
- Vapi Web SDK for the test-call widget (Phase 3)
- Railway worker + Playwright (Phase 4 monthly snapshots only)

## Setup

```sh
cp .env.example .env.local
# Fill in env vars from each provider
npm install
npm run dev
```

### Supabase

1. Create a new Supabase project.
2. Paste `supabase/migrations/0001_init.sql` and `supabase/migrations/0002_rls.sql` into the SQL editor (in order). Or use the Supabase CLI:
   ```sh
   supabase link --project-ref <ref>
   supabase db push
   ```
3. Auth → URL Configuration: add `http://localhost:3000/auth/callback` and (later) `https://tsd-modernization.com/auth/callback` to redirect URLs.
4. Auth → Email Templates: customize the magic-link email if desired.
5. Storage → create a `audit-screenshots` bucket (private) for the Phase 4 worker.

### Required env vars

See `.env.example`. The minimum for Phase 1 (audit tool) to function:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_PLACES_API_KEY`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `INTERNAL_API_SECRET` (32+ char random hex)

`UPSTASH_*` is optional in dev (rate limiting fails open without it). `VERCEL_API_TOKEN` and `NEXT_PUBLIC_VAPI_PUBLIC_KEY` only matter for portal modules.

## Routes

| Route                           | Phase | Purpose                                   |
| ------------------------------- | ----- | ----------------------------------------- |
| `/audit`                        | 1     | Public audit form                         |
| `/audit/[id]`                   | 1     | Polling + report page                     |
| `/api/audit/run`                | 1     | Internal pipeline runner (secret-gated)   |
| `/api/audit/[id]/status`        | 1     | Polling status                            |
| `/login`                        | 2     | Magic-link sign-in                        |
| `/auth/callback`                | 2     | Supabase OAuth-style code exchange        |
| `/app`                          | 2     | Authenticated portal home                 |
| `/app/package`                  | 3     | Package and services                      |
| `/app/progress`                 | 3     | Work-items kanban                         |
| `/app/deployment`               | 3     | Latest Vercel deploy                      |
| `/app/voice`                    | 3     | Vapi test-call widget                     |
| `/app/snapshot`                 | 4     | Monthly diff vs previous audit            |
| `/admin/clients`                | 2     | List + create clients                     |
| `/admin/clients/[id]`           | 2     | Per-client work-items                     |
| `/api/audit/cron`               | 4     | Vercel Cron entrypoint, dispatches worker |

## Deploy

1. New Vercel project rooted at this directory (`tsd-modernization-app/`).
2. Add all env vars from `.env.example`.
3. Add `CRON_SECRET` (Vercel auto-injects it for cron, otherwise generate one).
4. Note the deployment URL (e.g. `tsd-modernization-app.vercel.app`).
5. Update the **existing** `tsd-modernization/vercel.json` with the rewrites in `vercel-rewrites-snippet.json`, replacing `MODERNIZATION_APP_URL`. Push to redeploy the marketing site.
6. Verify `tsd-modernization.com/audit` loads the form.

## Phase 4 worker

See `worker/README.md`. Deploy on Railway from `worker/Dockerfile`, set `WORKER_URL` and `WORKER_SECRET` in the Next app env.
