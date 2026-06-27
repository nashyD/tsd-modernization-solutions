# The tsd-modernization.com Improvement Loop

A continuous, agent-run improvement loop for the public marketing site, built on
Addy Osmani's [Loop Engineering](https://www.oreilly.com/radar/loop-engineering/)
framework. The loop finds leaks in our own site (the same wedge TSD sells to
clients), proposes fixes, an independent agent verifies them, safe wins ship to a
review branch, and a human promotes them. It repeats on a daily heartbeat.

## North star

Keep tsd-modernization.com fast, accurate, accessible, on message, and
converting. Improve it a little every day without ever regressing the brand or
shipping unreviewed copy or pricing.

## The six primitives (Osmani)

| Primitive | Where it lives in this repo |
|---|---|
| **Automations** (the heartbeat) | a daily propose-only `tsd-loop-explorer` run that deposits findings into the board |
| **Worktrees** (parallel isolation) | the implement phase runs in a git worktree branch `loop/cycle-<date>`, never editing `main` directly |
| **Skills** (persistent knowledge) | [`SKILL.md`](SKILL.md) |
| **Plugins & connectors** | MCP: Vercel (deploys, runtime logs), the preview dev server, WebFetch against the live URL, the repo itself |
| **Subagents** (creator != verifier) | [`agents/explorer.md`](agents/explorer.md), [`agents/verifier.md`](agents/verifier.md), [`agents/implementer.md`](agents/implementer.md) |
| **State / memory** | [`BOARD.md`](BOARD.md) — the inbox, backlog, and shipped ledger |

## The cycle

1. **Explore** — specialist lenses (conversion, copy/voice, SEO, performance,
   accessibility, design/UX, correctness) read the code and the live site and
   surface concrete, evidence-cited findings.
2. **Verify** — an independent verifier opens each citation and confirms the
   problem is real, present, safe to fix, and on voice. Skeptical by default.
   Rejects noise so the board stays trustworthy.
3. **Synthesize** — findings are ranked by impact-to-effort and written to
   `BOARD.md`. The top safe wins are selected for this cycle.
4. **Implement** — the implementer makes ONLY the safe wins, in a worktree
   branch, matching house style.
5. **Verify the build** — `npm run build` must pass and the preview server is
   checked for every changed surface.
6. **Review** (human gate) — Nash reviews the branch and the board. Nothing
   merges or deploys without him.
7. **Promote** — Nash merges, Vercel deploys, and the board entries move to
   Shipped.

## Gates (the human is the ceiling)

- Propose-only by default. The heartbeat never edits the site.
- Only findings flagged `safeToAutomate` (small, self-contained, low-risk, no
  product, pricing, or positioning judgment required) are eligible to implement.
- Copy, pricing, positioning, and anything touching `BUSINESS_PLAN.md` stay
  proposals until Nash approves them.
- No agent merges to `main` and no agent deploys to production. Ever.

## Cadence

Daily heartbeat each morning: a propose-only Explorer plus Verifier appends new
verified findings to `BOARD.md` under the day's date. Full implement cycles run
on demand via `cycle.workflow.js`, or when Nash greenlights a batch from the
board.

## Definition of done (per item)

Evidence cited, verifier-confirmed, change implemented on a branch,
`npm run build` green, preview checked, `BUSINESS_PLAN.md` updated if the change
touches one of its triggers, and the board entry moved to Shipped with the
commit or PR link.

## Do not touch

- The Next.js funnel app at `../tsd-modernization-app` (separate concern; it owns
  /audit, /app, /sales, /demos via Vercel rewrites).
- Live data and secrets. The loop reads. It does not rotate keys or move money.
- Brand voice. No em dashes, no "X, not Y", no buzzwords, no three-part closers.
