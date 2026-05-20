# Demo-Recording Storyboard — Telos for Kalos

**Goal:** A 45–60 second silent screen recording that proves the prototype is real to any reviewer who reads the README without opening the live demo.

**Why:** WebFetch and most automated review tools see the SPA's empty HTML shell, not the rendered UI. Reviewers (and recruiters skimming on phones) close the tab if the README doesn't show what the product *does* in the first few seconds. Static screenshots help; a short clip is decisive.

---

## Recording specs

- **Format:** GIF or MP4. GIF auto-loops in GitHub readmes (best); MP4 if file size matters (host on Vercel or Cloudflare and embed via `<video>`).
- **Length:** 45–60 seconds. Hard cap 90.
- **Dimensions:** 1280×720 or 1440×900. Trim browser chrome if possible.
- **Frame rate:** 15–24 fps for GIF (smaller file), 30 fps for MP4.
- **Audio:** None. Reviewers skim with sound off.
- **File size target:** GIF ≤ 8 MB (GitHub renders inline up to 10 MB), MP4 ≤ 4 MB.
- **Tooling on Windows:** ScreenToGif (free, lets you trim and optimize); OBS Studio if you need MP4.

---

## Storyboard (60 seconds)

Each beat is timestamped and labels what should be visually obvious. Pace fast — reviewers click away in 10 seconds if nothing moves.

| 0:00 – 0:05 | Open on Overview page. Scroll once to the "Performance Analysts · The Human Edge" section. Stop. | Frames the positioning. |
| 0:05 – 0:10 | Click into Member → Telos tab. Maya's chat is visible. | Establishes the member surface exists and is populated. |
| 0:10 – 0:18 | Type "I'm struggling with protein this week" in the chat. Press send. Wait for the contextual response. | **Single best beat.** Shows live interaction with state-aware replies. |
| 0:18 – 0:25 | Click Member → DEXA Report. Click Scan #1 → Scan #6 in the picker. The body SVG and segment values update. | Proves the multi-scan picker is real, not a static image. |
| 0:25 – 0:35 | Switch to Performance → AI Inbox. Click **✨ Generate Live Draft**. Pause on the spinner; the new draft appears with LIVE · CLAUDE chip. | **The strongest engineering beat.** This is a real Claude API call. |
| 0:35 – 0:42 | Click **Approve & Send** on one draft. The state transitions visually (color change / icon swap / move from inbox to history). | Proves the state machine works end-to-end. |
| 0:42 – 0:55 | Click CAMA Proof tab. Click any pattern chip on the analyst insight. The underlying memory records highlight; non-contributors dim. | Proves the provenance chain is interactive and auditable. |
| 0:55 – 0:60 | Click the theme dropdown in the header. Switch to *Galaxy* or *Aurora*. End on the visibly different palette. | A small flourish — shows the design system depth. |

---

## Pre-recording checklist

Before you hit record:
- [ ] `npm run dev` — confirm the dev server is at http://localhost:5181
- [ ] `.env.local` has a valid `ANTHROPIC_API_KEY` so the **Generate Live Draft** call actually fires (otherwise the beat at 0:25 fails)
- [ ] Use a fresh browser profile or incognito so no devtools/extensions appear
- [ ] Close other tabs; resize browser to ~1280×800
- [ ] Pre-navigate to the Overview page so 0:00 is clean
- [ ] If your cursor color/size is unusual, switch to a default cursor for the recording

---

## Post-recording checklist

- [ ] Trim dead frames at start and end
- [ ] Reduce frame rate to 15–20 fps if GIF size > 8 MB
- [ ] Save as `docs/telos-tour.gif` (or `docs/telos-tour.mp4`) in the repo

---

## README block to add

Once recorded, replace the existing "Tour in under 2 minutes" section header with this block at the top of the README (just under the live-demo / build-plan links):

```markdown
---

## Watch the tour (60 seconds)

![Telos tour — Maya's chat, live AI draft generation, CAMA Proof, theme switching](docs/telos-tour.gif)

*Or [open the live demo](https://telos-kalos.vercel.app) — full interactivity in your browser.*

---
```

Keep the existing "Tour in under 2 minutes" *numbered* section directly below it — the GIF gives the visual proof, the numbered tour gives the deep-evaluator path. Reviewers self-select.

---

## Fallback if the live-draft API isn't configured at recording time

The Generate Live Draft beat (0:25–0:35) is the strongest moment because it proves a real API call. If you record without an API key configured, the UI shows the "not configured on this deployment" error state — that's still honest and demonstrates the discriminated-union error handling, but it's a weaker beat. **Configure the key before recording if at all possible.**
