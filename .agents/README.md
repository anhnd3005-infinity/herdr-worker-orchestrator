# .agents/ orchestration — quy ước (v0.5.0)

Pattern này dựng theo cùng convention đã dùng ở
`~/teamwork_projects/senior_product_designer_agent/.agents/`: một orchestrator
điều phối một nhóm agent bằng file, không cần API/state ẩn.

## Kiến trúc

```
Claude (orchestrator)
   ↓
Herdr (pane/agent layer)
   ↓
Worker (isolated hoặc shared)
 ├── agy
 ├── codex
 └── ... (bất kỳ kind nào Herdr hỗ trợ)
```

## Vai trò trong team này

- **orchestrator** — Claude Code (tôi), chạy trực tiếp trong phiên chat này,
  bên trong một phiên **Herdr** (yêu cầu `HERDR_ENV=1`). Đọc
  `ORIGINAL_REQUEST.md`, chia task, viết `BRIEFING.md` cho từng agent, tổng
  hợp `handoff.md` của tất cả agent vào `orchestrator/plan.md` +
  `orchestrator/GATE_STATUS.md`.
- **worker_<kind>_*** (VD `worker_agy_1`, `worker_codex_2`) — một agent
  CLI kind bất kỳ Herdr hỗ trợ (agy, codex, ...) chạy tương tác bên trong 1
  pane do **Herdr** quản lý, đóng vai trò thực thi/coder. Được orchestrator
  điều khiển qua `herdr agent start/prompt/read/send-keys/wait` — pane sống
  nên có thể theo dõi trạng thái (`idle`/`working`/`blocked`/`done`) và gửi
  tiếp prompt mà không cần relaunch.
- **reviewer_*** — một Claude subagent (qua Agent tool), đóng vai trò kiểm
  tra độc lập kết quả của worker. **Chỉ review diff thực tế và file thật**
  — không tin worker report. Không tự sửa code — chỉ chấm & báo cáo.
- **challenger_*** (thêm khi cần) — Claude subagent cố tình tìm cách bẻ/phản
  biện kết quả trước khi orchestrator chốt.

## Cấu trúc thư mục (v0.5.0)

```
.agents/
├── state.json                 # trạng thái global orchestrator
├── tasks/                     # task definitions + state machine
│   ├── TASK-001.json
│   └── TASK-002.json
├── runs/                      # execution logs per run
│   └── RUN-001.json
├── ORIGINAL_REQUEST.md        # mục tiêu gốc
├── orchestrator/
│   ├── plan.md
│   └── GATE_STATUS.md
├── worker_<kind>_N/           # VD worker_agy_1, worker_codex_2
│   ├── BRIEFING.md
│   ├── DISPATCH.md
│   ├── herdr_pane_split.json
│   ├── herdr_agent_start.json
│   ├── herdr_agent_prompt.json
│   ├── herdr_agent_get.json
│   ├── agent_output.txt
│   ├── progress.md
│   └── handoff.md
└── reviewer_N/
    ├── BRIEFING.md
    ├── review.md
    └── handoff.md
```

## Task JSON schema

Mỗi task trong `tasks/TASK-xxx.json` theo schema:

```json
{
  "id": "TASK-001",
  "status": "pending|dispatching|working|blocked|verifying|passed|failed",
  "worker_kind": "agy",
  "worker_name": "worker_agy_1",
  "workspace": "/abs/path/to/workspace",
  "pane_id": "w1H:p1",
  "agent_name": "worker_agy_1",
  "attempt": 1,
  "max_attempts": 3,
  "isolation": "none|worktree",
  "worktree_path": null,
  "worktree_branch": null,
  "started_at": "2026-08-24T00:00:00Z",
  "updated_at": "2026-08-24T00:00:00Z",
  "prompt": "task description...",
  "verification": {
    "files_exist": "pending|pass|fail",
    "tests": "pending|pass|fail|skipped",
    "build": "pending|pass|fail|skipped",
    "review": "pending|pass|fail|skipped"
  },
  "error": null
}
```

### State transitions

```
pending → dispatching → working → verifying → passed
              ↓           ↓         ↓
            failed     blocked    failed
                         ↓
                      resolved → verifying → ...
```

## Resume khi Claude restart

```
Claude restart
     ↓
read .agents/state.json
     ↓
find tasks with status = working | dispatching | blocked
     ↓
herdr agent get <name> cho mỗi task
     ↓
resume/retry dựa trên trạng thái thực tế
```

Điều này đảm bảo không mất state khi compaction, session restart, hoặc
máy khác tiếp tục.

## Quy ước file trong mỗi thư mục agent

| File           | Ai viết       | Nội dung                                              |
|----------------|---------------|--------------------------------------------------------|
| `BRIEFING.md`  | orchestrator  | Vai trò, ngữ cảnh, ràng buộc — viết trước khi dispatch |
| `DISPATCH.md`  | orchestrator  | Lệnh/prompt chính xác đã dùng để launch agent, timestamp |
| `progress.md`  | agent đó      | Log tiến trình khi agent chạy (worker_<kind>: log worker trả về) |
| `handoff.md`   | agent đó      | Tóm tắt kết quả cuối, để orchestrator đọc và quyết định bước kế |

## Worker isolation

Hai chế độ:
- **`none`** (mặc định) — worker chạy cùng cwd, giống v0.4.x
- **`worktree`** — tạo `git worktree` riêng cho worker:
  ```
  Project/
  ├── main worktree      ← Claude
  ├── .worktrees/TASK-001 ← Worker 1
  └── .worktrees/TASK-002 ← Worker 2
  ```

Dùng `worktree` cho task quan trọng hoặc khi cần parallel dispatch.

## Cách dispatch một worker

```bash
skills/dispatching-to-herdr-workers/scripts/dispatch-herdr-worker.sh \
  /Users/ducanh/Project/Infinity/agy-orchestrator-demo/workspace \
  .agents/worker_agy_N \
  "<task>" \
  worker_agy_N \
  agy \
  300000 \
  [--isolation none|worktree] \
  [--task-id TASK-001]
```

(Đổi `agy` thành `codex` hoặc kind khác ở tham số thứ 5 nếu cần.)

## Review policy

Reviewer **BẮT BUỘC** review dựa trên evidence thực tế:
1. ❌ KHÔNG đọc hoặc tin worker report/progress.md
2. ✅ `git diff` để xem thay đổi thực tế
3. ✅ `cat`/inspect actual files
4. ✅ Chạy tests nếu có
5. ✅ Chạy build nếu có
6. ✅ VERDICT dựa trên evidence từ bước 2-5

## Ghi chú: agent_prompt_stalled = UNKNOWN

`agent_prompt_stalled` KHÔNG phải FAIL. Đây là trạng thái UNKNOWN:
```
agent_prompt_stalled → UNKNOWN → inspect transcript → YES (wait) / NO (retry)
```
Script đã implement logic này (retry + marker check).
