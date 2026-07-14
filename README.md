# foxloves_manual

Static documentation site for the [foxloves](../foxloves) LÖVE widget library.
Per-widget API is parsed from the Lua source; all widget imagery is real
LÖVE-rendered screenshots. Nothing is hand-copied, so the manual cannot drift
from the library.

## Develop

```bash
bun install
bun run generate   # parse source + render screenshots (needs LÖVE 11.x on PATH)
bun run dev
```

## Build

```bash
bun run build      # runs generate, then prerenders to build/
bun run preview
```

## How it works

- `scripts/parse-widgets.ts` — reads `../foxloves` Lua, writes `src/lib/data/*.json`.
- `harness/` — a LÖVE app that renders each widget state to PNGs + a manifest.
- `scripts/verify-shots.ts` — fails the build if screenshots and parsed widgets
  drift apart (a widget documented but not shot, or vice-versa).
- SvelteKit prerenders every route via `adapter-static`.

Set `FOXLOVES_DIR` to point at a library checkout other than `../foxloves`.

## Layout

```
scripts/    TypeScript generators (parser + pipeline), run by Bun
harness/    LÖVE screenshot app (conf.lua, main.lua, states.lua, json_encode.lua)
src/        SvelteKit site (routes, components, generated data)
docs/       design spec + implementation plan
```

## Tests

```bash
bun test           # parser + shot-verify tests
bun run check      # svelte-check type pass
```
