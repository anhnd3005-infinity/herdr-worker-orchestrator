#!/usr/bin/env python3
"""Event handler for agent status changes.

Herdr plugin event: agent.status_changed
Auto-updates task state in .agents/tasks/ when a tracked worker agent's
status changes (idle/working/blocked/done).

Herdr passes event context via environment variables.
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def main():
    # Herdr injects event context as env vars
    agent_name = os.environ.get("HERDR_EVENT_AGENT_NAME", "")
    new_status = os.environ.get("HERDR_EVENT_AGENT_STATUS", "")

    if not agent_name or not new_status:
        # No event context — nothing to do
        return

    tasks_dir = Path(".agents/tasks")
    if not tasks_dir.exists():
        return

    # Find task files that reference this agent
    for task_file in tasks_dir.glob("TASK-*.json"):
        try:
            task = json.loads(task_file.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, ValueError):
            continue

        if task.get("agent_name") != agent_name:
            continue

        old_status = task.get("status", "")

        # Only update if task is in an active state
        if old_status not in ("dispatching", "working", "blocked"):
            continue

        # Map agent status to task status
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        if new_status in ("idle", "done"):
            task["status"] = "verifying"
        elif new_status == "working":
            task["status"] = "working"
        elif new_status == "blocked":
            task["status"] = "blocked"

        task["updated_at"] = ts
        task_file.write_text(
            json.dumps(task, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        print(
            f"Task {task['id']}: {old_status} → {task['status']} "
            f"(agent {agent_name} → {new_status})",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
