# 🎬 Herdr Worker Orchestrator — Motion Graphics Video (Remotion)

This directory contains the programmatic **Remotion** video project for creating high-framerate 4K/1080p promotional and tutorial videos for **Herdr Worker Orchestrator**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd remotion
npm install
```

### 2. Live Preview (Remotion Studio)
Launch the interactive web player with hot-reloading:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to scrub through the timeline, tweak timings, and inspect each scene.

### 3. Render 1080p / 4K Video (MP4)
```bash
npm run build
```
The output video will be generated at `remotion/out/video.mp4`.

### 4. Generate High-Res Thumbnail
```bash
npm run thumbnail
```
Generates a crisp PNG snapshot from the video timeline at `remotion/out/thumbnail.png`.

---

## 🎨 Video Structure (30 Seconds @ 30fps)

* **Scene 1 (0s - 7s)**: *The Hook* — Kinetic typography highlighting common AI agent failure modes (hallucinated success, lost state).
* **Scene 2 (7s - 15s)**: *The 3-Layer Architecture* — Visualizing Claude Code (Brain) ➔ Herdr (Process Multiplexer) ➔ Isolated Workers (agy / codex).
* **Scene 3 (15s - 23s)**: *4 Safety Superpowers* — Git Worktree Isolation, Stateful Task Ledger, Diff-based Review, and Stalled=UNKNOWN protocol.
* **Scene 4 (23s - 30s)**: *Outro & CTA* — Creator spotlight (**Đức Anh @ Infinity Tech**), 1-click install command, and GitHub star CTA.

---

## 🛠️ Customization

Edit any scene in `src/`:
* `src/Scene1_Intro.tsx`
* `src/Scene2_Architecture.tsx`
* `src/Scene3_Superpowers.tsx`
* `src/Scene4_Outro.tsx`
