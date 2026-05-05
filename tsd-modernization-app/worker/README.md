# tsd-audit-worker

Phase 4 monthly snapshot worker. Runs Playwright + Claude to capture a fresh audit + screenshot for clients on a monthly cadence.

## Deploy (Railway)

1. Create a new Railway project, select "Deploy from Dockerfile" pointed at `worker/`.
2. Set env:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL` (optional, defaults to `claude-sonnet-4-6`)
   - `WORKER_SECRET` (matches the Next app's `WORKER_SECRET`)
3. Note the public Railway URL — that's your `WORKER_URL` in the Next app.

## Endpoints

- `GET /health` — heartbeat
- `POST /run-audit` (header `x-worker-secret`) — body `{auditId, clientId, businessName, url}`. Updates the audit row in Supabase, uploads a screenshot to the `audit-screenshots` bucket.

## Dev

```sh
npm install
npx playwright install --with-deps chromium
npm run dev
```

The Next.js app's `/api/audit/cron` route dispatches here; bypass cron locally by hitting `/api/audit/cron` with `x-internal-secret`.
