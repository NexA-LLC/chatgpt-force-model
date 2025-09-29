# AGENTS

Purpose: repository-wide guidance for agents to produce precise, minimal, and safe changes.

Principles
- DRY/KISS/YAGNI. Prefer smallest viable diffs; do not reflow text or refactor unrelated code.
- Least authority. Avoid destructive commands; ask before irreversible actions.
- Testability. When stating rules, add clear conditions/expected outcomes where feasible.
- Consistency. Match existing style (headings, bullets, code fences, language tone).

Input/Output Contract
- Input: concrete request, target files/paths, constraints, and success criteria.
- Output: minimal diff or actionable steps with explicit assumptions and next actions; no unnecessary chain-of-thought.

Authority Boundaries
- Tool scope: file reads/writes within workspace; searches via `rg`; shell without network unless explicitly permitted.
- Escalation: if a task requires elevated access, destructive operations, or network, pause and request human approval.

Fail-safe / Escalation
- MUST pause and escalate on ambiguity in requirements, missing target files (unless creating minimal scaffolds is allowed), or potential data loss.
- If validation is blocked (e.g., missing runtimes), provide clear manual verification steps and stop.

Notes on Rules Location
- This file is the primary source for agent policy. If `.cursor/rules` exists, keep it consistent and prefer consolidating rules here.

