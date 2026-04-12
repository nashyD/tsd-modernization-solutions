# Instructions for Claude (auto-loaded by Claude Code)

This folder uses a shared project log to maintain continuity across Claude Chat, Cowork, and Code sessions.

## Start of every session
1. Read `PROJECT_LOG.md` before doing anything else.
2. Pay particular attention to the **Current State** section — that's the ground truth for where things stand right now.
3. Skim the most recent 3–5 entries in the **Change Log** for recent context.
4. Check **Open Questions / TODOs** to see if anything there is relevant to what the user is asking.

## End of every meaningful change
When you finish making a change the user would care about (editing a file, creating a deliverable, making a decision, etc.):

1. **Overwrite** the `Current State` section in `PROJECT_LOG.md` so it reflects reality right now. Do not append — replace.
2. **Prepend** a new entry to the top of the `Change Log` section using this format:
   ```
   ### YYYY-MM-DD — Code
   - What changed (1–2 short bullets)
   - Why (the rationale, not just the action)
   - Follow-ups if any
   ```
   Use today's actual date. Tag the entry with `Code` since you're running in Claude Code.
3. If you created a new open question or TODO, add it to the `Open Questions / TODOs` section.

## Rules
- Keep log entries short. 2–4 bullets max. Long entries get skipped by future-Claude.
- Record the *why*, not just the *what*. The what is usually recoverable from git or file contents; the why is not.
- Never delete Change Log entries. If the log gets longer than ~200 lines, move older entries to `PROJECT_LOG_ARCHIVE.md`.
- If you're unsure whether a change is "log-worthy," err on the side of logging it.
