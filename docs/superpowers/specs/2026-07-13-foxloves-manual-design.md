# foxloves_manual — Design Spec

**Date:** 2026-07-13
**Status:** Approved (pending spec review)

## Goal

A detailed, browseable documentation manual for **foxloves** — a
dependency-free UI widget library (28 widgets) for LÖVE (love2d), written in
Lua. The manual is a static web site that documents every widget's API, states,
and appearance, plus the shared theme and lifecycle model.

The manual lives in `foxloves_manual/` and reads the sibling library at
`../foxloves/` at build time. It never modifies the foxloves repo.

## Key decisions

1. **Widget visuals = real LÖVE screenshots.** A Lua harness renders each widget
   and each state to an offscreen Canvas and encodes PNGs. Pixel-accurate to the
   real library; single source of truth. (Rejected: re-implementing widgets in
   web — drift risk, double maintenance.)
2. **Per-widget content = parsed from source.** A TypeScript generator extracts
   API/prose from the existing Lua source. The source is already highly
   structured (a header doc-comment block per widget + `self.k = opts.k or
   DEFAULT` bodies, enforced by foxloves' AGENTS.md), so **no changes to
   foxloves are required.** (Rejected: hand-authored MDX — drifts from source.)
3. **Build-time generation, fully static site.** Generators run as a prebuild
   step; SvelteKit prerenders every route (`adapter-static`). Reproducible,
   CI-able, no server. (Rejected: runtime server reads; commit-once artifacts.)

## Stack

- SvelteKit + TypeScript, **Node 22** semantics, **Bun 1.3** as package manager
  and script runtime (runs `.ts` generators directly, no build step).
- Vite, `@sveltejs/adapter-static` (full prerender).
- `shiki` for Lua/Lua-ish code highlighting.
- Test runner: `bun test`.
- The manual styles itself with foxloves' own dark / fox-orange theme tokens
  (dogfooding).

Tooling verified present: LÖVE 11.5, Node 22.21, Bun 1.3.11, luajit.

## Data flow

```
../foxloves/**/*.lua ─ parse-widgets.ts ─→ src/lib/data/{widgets,tokens}.json ┐
../foxloves/**/*.lua ─ harness (LÖVE)   ─→ static/shots/**.png + manifest.json ┼→ prerender → static site
```

Regenerate with `bun run generate` (parser + harness + copy). Generated
artifacts (`src/lib/data/*.json`, `static/shots/`) are gitignored and rebuilt.

## Component 1 — Parser (`scripts/parse-widgets.ts`)

**Input:** `../foxloves/foxloves/widgets/*.lua`, `theme.lua`, `init.lua`,
`README.md` (widget grouping).

**Per widget, extract:**
- `id`, `displayName`, `category` (`control` vs `container-overlay`, from README
  grouping).
- `summary` + behavior prose — from the header doc-comment block.
- `options[]`: `name`, `default` (literal from `opts.k or DEFAULT`), inferred
  `type`, `description` (from header comment), `isCallback` + signature.
- `capabilities`: `focusable`, keyboard keys handled, wheel / mousemoved support
  (detected from method presence and non-noop bodies).
- `sourceExcerpt`: the `.new` block, for a "Source" view.

**Theme:** `theme.lua` → `tokens.json`: colors (name → rgba array → hex + rgba
string), `radius`, `padding`, semantic roles (accent, focus, info/success/
warning/error, etc.).

**Output:** `src/lib/data/widgets.json`, `src/lib/data/tokens.json`.

**Error handling:** if a widget file does not match the expected pattern (no
`X.new(opts)`, no header block), **fail loud** and name the file — this signals
drift in foxloves that the manual must catch, not silently drop.

## Component 2 — Screenshot harness (`harness/main.lua` + `harness/conf.lua`)

A LÖVE app (`love harness`) that renders shots headlessly-enough (opens a window,
draws to offscreen Canvases, quits after one pass).

- **State-spec table** (`harness/states.lua`): per widget, a list of
  `{ state, opts, mutate }` entries. `mutate(w)` forces runtime flags the render
  depends on: `w.hovered`, `w.pressed`, `w.disabled`, focus (via `foxloves.util`
  focus mechanism), `w.value`, and variants (slider `vertical`, toggle on/off,
  checkbox checked, badge variants, progressbar values, etc.).
- For each entry: create widget at origin, size a Canvas to `w`×`h` (+ padding
  for focus rings / value bubbles), `love.graphics.setCanvas`, `w:draw()`,
  `canvas:newImageData():encode("png", relPath)`.
- Each widget wrapped in `pcall`; a failure is logged and recorded in the
  manifest as `failed`, and does not abort the run.

**Output:** PNGs + `manifest.json` (`widget → [{ state, file, w, h, caption }]`)
written to the LÖVE save directory; the `generate` step copies them into
`static/shots/`.

## Component 3 — Site (SvelteKit, prerendered)

**Routes**
- `/` — what foxloves is, install, quick-start snippet, widget grid.
- `/foundations/theme` — token reference: color swatches, radius, padding, focus
  ring, typography. *(Authored site chrome, driven by `tokens.json`.)*
- `/foundations/lifecycle` — widget contract, input/consume model, keyboard
  focus, `fox.Root` + containers. *(Authored conceptual chrome — not per-widget
  API, so hand-written prose is allowed here.)*
- `/widgets` — filterable grid (client-side text filter only).
- `/widgets/[id]` — data-driven per widget: title, category badge, summary,
  screenshot gallery (states/variants with captions), options table, capability
  chips (focusable / keys / wheel), generated minimal code example, source
  excerpt.

**Components:** `Sidebar`, `WidgetGallery`, `ShotFigure`, `OptionsTable`,
`TokenSwatch`, `CodeBlock` (shiki), `CategoryBadge`, `CapabilityChips`.

## Cross-cutting guards

- **Drift guard:** build fails if the harness widget-set ≠ parser widget-set
  (a widget documented but not shot, or vice-versa).
- **Missing-shot guard:** a node/bun check asserts every manifest-referenced PNG
  exists on disk and all 28 widgets are covered.

## Testing

- **Parser:** `bun test` against small Lua fixtures — assert extracted option
  names, defaults, callback detection, and loud failure on a malformed fixture.
- **Pipeline:** bun check that every manifest PNG exists and all widgets covered.
- **Site:** `vite build` (prerender) + `svelte-check` as a smoke test that every
  widget route renders without error.

## Scope cuts (YAGNI, v1)

- No full-text search (client-side filter on `/widgets` only).
- No interactive in-browser widget demos (screenshots only).
- No multi-version / changelog docs.

## Directory layout (target)

```
foxloves_manual/
├── package.json            -- bun, sveltekit
├── svelte.config.js        -- adapter-static
├── vite.config.ts
├── scripts/
│   └── parse-widgets.ts    -- Lua source → widgets.json / tokens.json
├── harness/
│   ├── conf.lua
│   ├── main.lua            -- render states → PNG + manifest
│   └── states.lua          -- per-widget state spec
├── static/
│   └── shots/              -- generated PNGs + manifest.json (gitignored)
└── src/
    ├── lib/
    │   ├── data/           -- widgets.json, tokens.json (gitignored)
    │   └── components/
    └── routes/
        ├── +page.svelte
        ├── foundations/{theme,lifecycle}/+page.svelte
        └── widgets/{+page.svelte,[id]/+page.svelte}
```
