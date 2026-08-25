# herdr-worker-orchestrator

[![Website](https://img.shields.io/badge/Live_Showcase-6366f1?style=flat-square&logo=google-chrome&logoColor=white)](https://anhnd3005-infinity.github.io/herdr-worker-orchestrator/)
[![Version](https://img.shields.io/badge/v0.5.0-06b6d4?style=flat-square)](https://github.com/anhnd3005-infinity/herdr-worker-orchestrator/releases)
[![License](https://img.shields.io/badge/MIT-10b981?style=flat-square)](LICENSE)

**Claude Code** orchestrates. **Herdr** manages terminals. Isolated **workers** (agy, codex, etc.) write code in git worktrees with automated diff review.

```
Claude Code (orchestrator)  →  Herdr (terminal layer)  →  Workers (isolated)
```

## Install

### Prerequisites

- [Herdr](https://herdr.dev) — Claude Code must run **inside** a Herdr pane (`HERDR_ENV=1`)
- [Claude Code](https://claude.com/claude-code)
- A worker CLI: `agy`, `codex`, or any Herdr-supported kind

### Plugin Setup

**Claude Code:**
```
/plugin marketplace add https://github.com/anhnd3005-infinity/herdr-worker-orchestrator.git
/plugin install herdr-worker-orchestrator@herdr-worker-orchestrator-marketplace
```

**Herdr CLI:**
```bash
herdr plugin install anhnd3005-infinity/herdr-worker-orchestrator
```

### Verify

```bash
herdr --version
echo "$HERDR_ENV"   # must print 1
```

## Usage

Just ask Claude naturally — the skill activates automatically:

> "Use agy as a worker to create a RESTful API using FastAPI, test it thoroughly, and report the results."

Or force it explicitly:
```
/herdr-dispatch Create a FastAPI service using agy, test it, and report results.
```

**Herdr CLI actions:**
```bash
herdr plugin action invoke herdr-worker-orchestrator.status   # live status
herdr plugin action invoke herdr-worker-orchestrator.resume   # resume after crash
```

## How It Works

![AI Coding Workflow](./ai_coding_workflow_animated.gif)

### 3-Layer Architecture

| Layer | Role | Component |
|-------|------|-----------|
| 1. Cognitive | Plans, decomposes, reviews | Claude Code |
| 2. Process | Terminal supervision, lifecycle polling | Herdr |
| 3. Execution | Writes code in isolation | agy / codex / any CLI |

### Task Lifecycle

```
pending → dispatching → working → verifying → passed
                ↓           ↓         ↓
              failed     blocked    failed
```

Tasks are persisted in `.agents/tasks/TASK-xxx.json`. If Claude restarts, it reads the ledger and resumes — no state lost.

### Worker Isolation

Workers run in dedicated git worktrees on separate branches:

```
Project/
├── main worktree        ← Claude works here
├── .worktrees/TASK-001  ← Worker 1 (agy)
└── .worktrees/TASK-002  ← Worker 2 (codex)
```

## Key Design Principles

1. **Never trust status codes alone.** Always inspect actual files and diffs.
2. **Clarify before dispatching.** One clarifying question saves a wasted dispatch cycle.
3. **Reviewers inspect `git diff`, not worker reports.** Workers can hallucinate success.
4. **`stalled ≠ failed`.** Check terminal transcripts for delivery markers before retrying.
5. **`--dangerously-skip-permissions`** injected automatically to prevent interactive hangs.

## Known Gotchas

- `HERDR_ENV` must be `1` — no headless fallback
- `--timeout` capped at 300,000ms (5 min); loop `herdr agent wait` for longer tasks
- `agent_prompt_stalled` is **UNKNOWN**, not FAIL — inspect transcript, then decide wait vs retry
- Herdr writes errors to **stderr**, not stdout

## Project Structure

```
skills/dispatching-to-herdr-workers/
├── SKILL.md                        # Full process documentation
└── scripts/
    ├── dispatch-herdr-worker.sh    # Bash dispatch wrapper
    └── dispatch-herdr-worker.py    # Python dispatch wrapper
commands/herdr-dispatch.md          # Slash command definition
.agents/                            # Stateful task ledger
```

## Version History

| Version | Changes |
|---------|---------|
| **0.5.0** | Renamed to herdr-worker-orchestrator. Stateful ledger, git worktree isolation, diff-based review, `stalled=UNKNOWN` handling. |
| **0.4.1** | Timeout validation, `--wait` drop tested & rejected, delivery-check fix for `done` state. |
| **0.4.0** | Herdr pane mode (replacing headless), multi-kind support, per-kind quirks table. |
| **0.3.0** | Cross-platform: pure-Python dispatch port. |
| **0.2.0** | Clarify-first (step 0), tiered review, `/agy-dispatch` command. |
| **0.1.0** | Initial skill: `.agents/` ledger, `--add-dir` gotcha, dispatch script. |

## License

MIT — [Đức Anh](https://github.com/anhnd3005-infinity) @ Infinity Tech
