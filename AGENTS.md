# AGENTS.md — Tale-Bot Challenge (TaleBot Studio)

> From `C:\Users\migue\.claude\templates\AGENTS.template.md`. Max 60 lines; keep it true.

## Purpose
Open-source web app to create, preview and print programming/drawing challenges for the TaleBot Pro educational robot (MatataStudio): 5x4 board, BFS challenge generator, A4 double-sided print (cards + solutions). Tier L1, default branch `main`. UI and README are in Spanish.

## Stack
React 19, Vite 8, `lucide-react`, `canvas-confetti`, oxlint. Static site on GitHub Pages (`gh-pages`, remote `miguelpicado/tale-bot-challenge`). Code in `src/` (`App.jsx`, `components/`, `utils/`).

## Commands
| Task | Command |
|---|---|
| Install | `npm install` |
| Run / dev | `npm run dev` |
| Test | none |
| Lint / typecheck | `npm run lint` (oxlint) |
| Build | `npm run build` |
| Deploy | `npm run deploy` (builds, then publishes `dist/` to `gh-pages`) |

## Do
- Run `npm run lint` and `npm run build` before pushing.
- Keep the print layout (A4, page 1 challenges, page 2 aligned solutions on the back) intact when touching components or CSS.
- Keep the on-screen controller faithful to the physical robot (colors, buttons, keyboard shortcuts).

## Don't
- Never commit secrets (`.env`, keys). The app has none; keep it that way (static, no backend).
- Don't commit `dist/` or `node_modules/`; `npm run deploy` publishes `dist/` itself.
- Don't run `npm run deploy` unless the owner asks: it publishes the live site.
- No `--no-verify`, no force-push.

## Global rules
`C:\Users\migue\.claude\rules\`: `code-intelligence.md`, `code-tooling.md`, `memory-governance.md`. Repo rules win.
