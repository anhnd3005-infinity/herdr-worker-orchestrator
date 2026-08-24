#!/usr/bin/env python3
"""Resume after restart — inspect in-progress tasks and report what needs attention.

Herdr plugin action: herdr-worker-orchestrator.resume
Reads .agents/state.json, checks live agent status for each active task,
and reports which tasks need retry, verification, or manual intervention.
"""

import json
import os
import subprocess
import sys
from pathlib import Path


def find_key(obj, key):
    if isinstance(obj, dict):
        if key in obj:
            return obj[key]
        for v in obj.values():
            found = find_key(v, key)
            if found is not None:
                return found
    elif isinstance(obj, list):
        for item in obj:
            found = find_key(item, key)
            if found is not None:
                return found
    return None


def get_agent_status(herdr, agent_name):
    """Query herdr for a specific agent's live status."""
    try:
        result = subprocess.run(
            [herdr, "agent", "get", agent_name],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode == 0 and result.stdout.strip():
            data = json.loads(result.stdout)
            return find_key(data, "agent_status") or "unknown"
    except Exception:
        pass
    return "not_found"


def main():
    state_path = Path(".agents/state.json")
    if not state_path.exists():
        print("No .agents/state.json found — nothing to resume.")
        return

    state = json.loads(state_path.read_text(encoding="utf-8"))
    active = state.get("active_tasks", [])

    if not active:
        print("No active tasks to resume.")
        return

    herdr = os.environ.get("HERDR_BIN_PATH", "herdr")

    print(f"═══ Resume Check — {len(active)} active task(s) ═══")
    print()

    actions_needed = []

    for task_id in active:
        task_path = Path(f".agents/tasks/{task_id}.json")
        if not task_path.exists():
            print(f"  ⚠️  {task_id}: task file missing — cannot resume")
            actions_needed.append((task_id, "task file missing"))
            continue

        task = json.loads(task_path.read_text(encoding="utf-8"))
        task_status = task.get("status", "unknown")
        agent_name = task.get("agent_name", "")
        live_status = get_agent_status(herdr, agent_name) if agent_name else "no_agent"

        print(f"  {task_id}:")
        print(f"    Task status:  {task_status}")
        print(f"    Agent:        {agent_name} → live: {live_status}")

        # Determine action
        if task_status in ("dispatching", "working"):
            if live_status == "idle" or live_status == "done":
                action = "→ VERIFY: agent settled, run self-check on workspace files"
            elif live_status == "working":
                action = "→ WAIT: agent still working, poll with 'herdr agent wait'"
            elif live_status == "blocked":
                action = "→ RESOLVE: agent blocked, use 'herdr agent read' to see what it needs"
            elif live_status == "not_found":
                action = "→ RETRY: agent not found, may need re-dispatch"
            else:
                action = f"→ INSPECT: unexpected live status '{live_status}'"
        elif task_status == "blocked":
            if live_status in ("idle", "done"):
                action = "→ VERIFY: was blocked but agent now settled"
            else:
                action = "→ RESOLVE: still blocked"
        elif task_status == "verifying":
            action = "→ CONTINUE: verification was in progress, complete it"
        elif task_status in ("passed", "failed"):
            action = "→ DONE: task already completed, can remove from active list"
        else:
            action = f"→ INSPECT: unknown task status '{task_status}'"

        print(f"    {action}")
        actions_needed.append((task_id, action))
        print()

    print("═══ Summary ═══")
    for tid, act in actions_needed:
        print(f"  {tid}: {act}")


if __name__ == "__main__":
    main()
