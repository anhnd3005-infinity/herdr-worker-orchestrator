#!/usr/bin/env python3
"""Show orchestrator status — active tasks, worker states, pending verifications.

Herdr plugin action: herdr-worker-orchestrator.status
Reads .agents/state.json and task files, queries live agent status via herdr.
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


def main():
    state_path = Path(".agents/state.json")
    if not state_path.exists():
        print("No .agents/state.json found — no orchestration in progress.")
        return

    state = json.loads(state_path.read_text(encoding="utf-8"))
    active = state.get("active_tasks", [])
    completed = state.get("completed_tasks", [])
    last_updated = state.get("last_updated", "unknown")

    print(f"═══ Herdr Worker Orchestrator Status ═══")
    print(f"  Version:      {state.get('version', '?')}")
    print(f"  Last updated: {last_updated}")
    print(f"  Active tasks: {len(active)}")
    print(f"  Completed:    {len(completed)}")
    print()

    if not active:
        print("  No active tasks.")
        return

    # Query herdr for live agent list
    herdr = os.environ.get("HERDR_BIN_PATH", "herdr")
    try:
        result = subprocess.run(
            [herdr, "agent", "list"],
            capture_output=True, text=True, timeout=5,
        )
        agent_list = json.loads(result.stdout) if result.stdout.strip() else {}
        agents = find_key(agent_list, "agents") or []
        agent_map = {}
        for a in agents:
            name = find_key(a, "name")
            if name:
                agent_map[name] = find_key(a, "agent_status") or "?"
    except Exception:
        agent_map = {}

    for task_id in active:
        task_path = Path(f".agents/tasks/{task_id}.json")
        if not task_path.exists():
            print(f"  ⚠️  {task_id}: task file missing")
            continue

        task = json.loads(task_path.read_text(encoding="utf-8"))
        agent_name = task.get("agent_name", "?")
        live_status = agent_map.get(agent_name, "not found")
        isolation = task.get("isolation", "none")
        wt = f" (worktree: {task.get('worktree_path')})" if task.get("worktree_path") else ""

        print(f"  ┌─ {task_id}")
        print(f"  │  Task status:  {task.get('status', '?')}")
        print(f"  │  Worker:       {agent_name} ({task.get('worker_kind', '?')})")
        print(f"  │  Live agent:   {live_status}")
        print(f"  │  Workspace:    {task.get('workspace', '?')}")
        print(f"  │  Isolation:    {isolation}{wt}")
        print(f"  │  Attempt:      {task.get('attempt', '?')}/{task.get('max_attempts', '?')}")
        v = task.get("verification", {})
        print(f"  │  Verification: files={v.get('files_exist','?')} tests={v.get('tests','?')} build={v.get('build','?')} review={v.get('review','?')}")
        print(f"  └─ Started: {task.get('started_at', '?')}")
        print()


if __name__ == "__main__":
    main()
