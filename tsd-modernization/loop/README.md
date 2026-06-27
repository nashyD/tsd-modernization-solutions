# The Improvement Loop — runbook

This folder is a self-improving loop for tsd-modernization.com, built on Addy
Osmani's [Loop Engineering](https://www.oreilly.com/radar/loop-engineering/).
Read [`loop.md`](loop.md) for the full spec.

## In one breath

A daily agent finds concrete, evidence-backed improvements to the live site, a
second independent agent verifies them, the best safe ones get implemented on a
review branch, and you approve what ships. Findings accumulate in
[`BOARD.md`](BOARD.md).

## Files

| File | Role |
|---|---|
| `loop.md` | the loop spec: stages, gates, cadence, the six primitives |
| `SKILL.md` | persistent site knowledge agents load each run |
| `BOARD.md` | the State board: inbox, backlog, shipped ledger |
| `agents/` | the three subagents (explorer, verifier, implementer) |
| `cycle.workflow.js` | the runnable engine (Diagnose → Verify → Synthesize fan-out) |

## Run a full cycle on demand

From a Claude Code session in this repo, invoke the Workflow tool with
`{ scriptPath: "loop/cycle.workflow.js" }`. It produces verified, ranked
findings. Review the board, then ask Claude to implement a chosen batch on a
worktree branch.

## The daily heartbeat

A propose-only scheduled task (`tsd-loop-daily`) runs each morning: Explorer +
Verifier, appending new verified findings to `BOARD.md` under the day's date. It
never edits the site. Pause it by disabling the scheduled task.

## Promote a win

Review the branch the implementer left (`loop/cycle-<date>`), check the build and
preview, and merge when satisfied. Vercel deploys `main`. Move the board entries
to Shipped.

## The one rule

You are the ceiling. The loop drafts and verifies. You confirm and ship. Read
the diffs.
