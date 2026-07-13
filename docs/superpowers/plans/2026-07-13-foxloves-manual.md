# foxloves_manual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static SvelteKit documentation manual for the foxloves LÖVE widget library, where all per-widget API content is parsed from the Lua source and all widget imagery is real LÖVE-rendered screenshots.

**Architecture:** Two build-time generators feed a prerendered SvelteKit site. `scripts/parse-widgets.ts` (run by Bun) parses `../foxloves` Lua source into `widgets.json` + `tokens.json`. `harness/` is a LÖVE app that renders each widget state to an offscreen Canvas and encodes PNGs + a manifest. The site reads those artifacts and prerenders every route via `adapter-static`.

**Tech Stack:** SvelteKit, TypeScript, Bun 1.3 (package manager + TS runtime + test runner), Vite, `@sveltejs/adapter-static`, `shiki`, LÖVE 11.5 (Lua) for the screenshot harness.

**Canonical widget set:** `../foxloves/foxloves/init.lua` is the source of truth for which widgets exist (24 exports, excluding `theme`, `util`, `Root`). Never hardcode the widget list.

---

## Conventions used throughout

- Repo root: `/home/romulo2/development/games/design_systems/foxloves_manual`.
- Library root: `../foxloves` (sibling). Read-only. Never modified.
- Path to library env override: `FOXLOVES_DIR` (defaults to `../foxloves`).
- Run TS directly with `bun run <file.ts>`; tests with `bun test`.
- Commit after every task. This repo has its own git history, independent of foxloves.

---

## Task 1: Scaffold project + git

**Files:**
- Create: `package.json`, `.gitignore`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/routes/+layout.ts`

- [ ] **Step 1: Init git + SvelteKit skeleton**

```bash
cd /home/romulo2/development/games/design_systems/foxloves_manual
git init
bun create svelte-kit-minimal@latest . 2>/dev/null || bunx sv create . --template minimal --types ts --no-add-ons --no-install
```

If `sv create` prompts or refuses a non-empty dir (the `.claude` and `docs` dirs exist), instead scaffold manually with the files in the following steps.

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "foxloves-manual",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "bun run generate && vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "generate": "bun run scripts/generate.ts",
    "parse": "bun run scripts/parse-widgets.ts",
    "shots": "bun run scripts/shoot.ts",
    "test": "bun test"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.5.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "svelte": "^4.2.0",
    "svelte-check": "^3.6.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0"
  },
  "dependencies": {
    "shiki": "^1.0.0"
  }
}
```

- [ ] **Step 3: Install deps**

Run: `bun install`
Expected: `bun.lockb` created, `node_modules/` populated.

- [ ] **Step 4: Write `svelte.config.js` (static adapter, prerender)**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    prerender: { entries: ['*'] }
  }
};
```

- [ ] **Step 5: Write `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/routes/+layout.ts`**

`vite.config.ts`:
```ts
import { sveltekit } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [sveltekit()] });
```

`tsconfig.json`:
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

`src/app.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

`src/routes/+layout.ts` (force full prerender, no SSR-at-runtime):
```ts
export const prerender = true;
export const ssr = true;
```

- [ ] **Step 6: Write `.gitignore`**

```
node_modules/
.svelte-kit/
build/
bun.lockb
# generated artifacts (rebuilt by `bun run generate`)
src/lib/data/*.json
static/shots/
```

- [ ] **Step 7: Verify dev server boots**

Run: `bun run dev &` then `sleep 3 && curl -sf http://localhost:5173/ >/dev/null && echo OK; kill %1`
Expected: `OK` (a blank minimal page is fine).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold sveltekit + bun + static adapter"
```

---

## Task 2: Parser — Lua value + token helpers (TDD)

**Files:**
- Create: `scripts/lua-parse.ts`
- Test: `scripts/lua-parse.test.ts`

These are the pure functions the widget parser builds on: reading the canonical widget list from `init.lua`, and parsing the theme color table.

- [ ] **Step 1: Write the failing test**

`scripts/lua-parse.test.ts`:
```ts
import { expect, test } from 'bun:test';
import { parseInitExports, parseTheme, luaColorToHex } from './lua-parse';

const INIT = `local M = {
  theme       = require("foxloves.theme"),
  util        = require("foxloves.util"),
  Root        = require("foxloves.root"),
  Button      = require("foxloves.widgets.button"),
  SegmentedControl = require("foxloves.widgets.segmentedcontrol"),
}
return M`;

test('parseInitExports returns only widgets under widgets.*', () => {
  const list = parseInitExports(INIT);
  expect(list).toEqual([
    { displayName: 'Button', module: 'button' },
    { displayName: 'SegmentedControl', module: 'segmentedcontrol' }
  ]);
});

const THEME = `local M = {
  color = {
    bg     = {0.16, 0.17, 0.20, 1.0},
    accent = {0.90, 0.55, 0.25, 1.0}, -- fox orange
  },
  radius  = 4,
  padding = 8,
}
return M`;

test('parseTheme extracts colors + metrics', () => {
  const t = parseTheme(THEME);
  expect(t.radius).toBe(4);
  expect(t.padding).toBe(8);
  expect(t.colors.find((c) => c.name === 'accent')).toMatchObject({
    rgba: [0.9, 0.55, 0.25, 1],
    note: 'fox orange'
  });
});

test('luaColorToHex converts 0..1 floats', () => {
  expect(luaColorToHex([0.9, 0.55, 0.25, 1])).toBe('#e68c40');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test scripts/lua-parse.test.ts`
Expected: FAIL — `Cannot find module './lua-parse'`.

- [ ] **Step 3: Write `scripts/lua-parse.ts`**

```ts
export interface WidgetRef { displayName: string; module: string; }
export interface ThemeColor { name: string; rgba: [number, number, number, number]; hex: string; rgbaCss: string; note?: string; }
export interface ParsedTheme { colors: ThemeColor[]; radius: number; padding: number; }

/** Widgets exported from init.lua — only `require("foxloves.widgets.X")` entries. */
export function parseInitExports(src: string): WidgetRef[] {
  const re = /(\w+)\s*=\s*require\("foxloves\.widgets\.(\w+)"\)/g;
  const out: WidgetRef[] = [];
  for (const m of src.matchAll(re)) out.push({ displayName: m[1], module: m[2] });
  return out;
}

export function luaColorToHex(rgba: number[]): string {
  const to = (f: number) => Math.round(Math.max(0, Math.min(1, f)) * 255).toString(16).padStart(2, '0');
  return `#${to(rgba[0])}${to(rgba[1])}${to(rgba[2])}`;
}

function rgbaCss(rgba: number[]): string {
  const c = rgba.map((f, i) => (i < 3 ? Math.round(f * 255) : f));
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${rgba[3] ?? 1})`;
}

export function parseTheme(src: string): ParsedTheme {
  const colorBlock = src.match(/color\s*=\s*{([\s\S]*?)\n\s*},/);
  const colors: ThemeColor[] = [];
  if (colorBlock) {
    const re = /(\w+)\s*=\s*{([^}]*)}\s*,?\s*(?:--\s*(.*))?/g;
    for (const m of colorBlock[1].matchAll(re)) {
      const nums = m[2].split(',').map((s) => parseFloat(s.trim())).filter((n) => !Number.isNaN(n));
      const rgba = [nums[0], nums[1], nums[2], nums[3] ?? 1] as [number, number, number, number];
      colors.push({ name: m[1], rgba, hex: luaColorToHex(rgba), rgbaCss: rgbaCss(rgba), note: m[3]?.trim() || undefined });
    }
  }
  const radius = parseInt(src.match(/radius\s*=\s*(\d+)/)?.[1] ?? '0', 10);
  const padding = parseInt(src.match(/padding\s*=\s*(\d+)/)?.[1] ?? '0', 10);
  return { colors, radius, padding };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test scripts/lua-parse.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lua-parse.ts scripts/lua-parse.test.ts
git commit -m "feat(parser): lua init + theme parsing helpers"
```

---

## Task 3: Parser — per-widget extraction (TDD)

**Files:**
- Create: `scripts/widget-parse.ts`
- Test: `scripts/widget-parse.test.ts`

Extracts one widget's doc model from its Lua file text.

- [ ] **Step 1: Write the failing test**

`scripts/widget-parse.test.ts`:
```ts
import { expect, test } from 'bun:test';
import { parseWidget } from './widget-parse';

const BUTTON = `-- Button widget.
--
-- Button.new{
--   x, y, w, h,           -- bounds
--   label = "OK",          -- text drawn centered
--   onClick = function() end,
--   disabled = false,
--   theme = <theme table>,  -- optional, falls back to default
-- }
--
-- Fires onClick on mouserelease inside bounds when the press also began
-- inside bounds.

local Button = {}
Button.__index = Button

function Button.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Button)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 120
  self.h = opts.h or 32
  self.label = opts.label or "Button"
  self.onClick = opts.onClick
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.focusable = true
  return self
end

function Button:keypressed(key)
  if key == "space" or key == "return" or key == "kpenter" then return true end
  return false
end

return Button`;

test('parseWidget extracts title + summary prose', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  expect(w.displayName).toBe('Button');
  expect(w.summary).toContain('Fires onClick on mouserelease');
});

test('parseWidget extracts options with defaults + descriptions', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  const label = w.options.find((o) => o.name === 'label')!;
  expect(label).toMatchObject({ default: '"OK"', type: 'string', description: 'text drawn centered' });
  const onClick = w.options.find((o) => o.name === 'onClick')!;
  expect(onClick.isCallback).toBe(true);
  const disabled = w.options.find((o) => o.name === 'disabled')!;
  expect(disabled).toMatchObject({ default: 'false', type: 'boolean' });
});

test('parseWidget detects capabilities', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  expect(w.capabilities.focusable).toBe(true);
  expect(w.capabilities.keys).toEqual(['space', 'return', 'kpenter']);
});

test('parseWidget throws on malformed source', () => {
  expect(() => parseWidget('bad', 'Bad', '-- no new function here\nreturn {}')).toThrow(/Bad/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test scripts/widget-parse.test.ts`
Expected: FAIL — `Cannot find module './widget-parse'`.

- [ ] **Step 3: Write `scripts/widget-parse.ts`**

```ts
export interface WidgetOption {
  name: string;
  default: string | null;
  type: 'string' | 'number' | 'boolean' | 'function' | 'table' | 'any';
  description?: string;
  isCallback: boolean;
}
export interface WidgetCapabilities {
  focusable: boolean;
  keys: string[];
  wheel: boolean;
  mousemoved: boolean;
}
export interface WidgetDoc {
  id: string;
  displayName: string;
  title: string;
  summary: string;
  options: WidgetOption[];
  capabilities: WidgetCapabilities;
  sourceExcerpt: string;
}

/** Contiguous leading `--` comment block. */
function headerBlock(src: string): string {
  const lines = src.split('\n');
  const out: string[] = [];
  for (const l of lines) {
    if (l.startsWith('--')) out.push(l.replace(/^--\s?/, ''));
    else if (out.length) break;
    else if (l.trim() === '') continue;
    else break;
  }
  return out.join('\n');
}

/** Descriptions keyed by option name, from the `.new{ ... }` example in the header. */
function headerDescriptions(header: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /^\s*(\w+)[^,]*,?\s*--\s*(.*)$/;
  for (const line of header.split('\n')) {
    const m = line.match(re);
    if (m) map.set(m[1], m[2].trim());
  }
  return map;
}

function inferType(def: string | null, name: string): WidgetOption['type'] {
  if (def === 'false' || def === 'true') return 'boolean';
  if (def && /^-?\d+(\.\d+)?$/.test(def)) return 'number';
  if (def && /^".*"$/.test(def)) return 'string';
  if (def && /^function/.test(def)) return 'function';
  if (def && /^{.*}$/.test(def)) return 'table';
  if (/^on[A-Z]/.test(name) || /^format$/.test(name)) return 'function';
  return 'any';
}

export function parseWidget(id: string, displayName: string, src: string): WidgetDoc {
  const newMatch = src.match(/function\s+[\w.]+\.new\((\w+)\)([\s\S]*?)\nend/);
  if (!newMatch) throw new Error(`parseWidget: no .new(opts) in widget "${displayName}" (${id})`);
  const header = headerBlock(src);
  if (!header) throw new Error(`parseWidget: no header comment in widget "${displayName}" (${id})`);

  const descs = headerDescriptions(header);
  const body = newMatch[2];
  const optsVar = newMatch[1];
  const assignRe = new RegExp(`self\\.(\\w+)\\s*=\\s*${optsVar}\\.(\\w+)\\b(?:\\s+or\\s+([^\\n]+?))?\\s*$`, 'gm');
  const seen = new Set<string>();
  const options: WidgetOption[] = [];
  for (const m of body.matchAll(assignRe)) {
    const name = m[2];
    if (seen.has(name)) continue;
    seen.add(name);
    let def: string | null = m[3]?.trim() ?? null;
    if (def && /^default[Tt]heme$/.test(def)) def = '<default theme>';
    const type = inferType(def, name);
    options.push({
      name,
      default: def,
      type,
      description: descs.get(name),
      isCallback: type === 'function'
    });
  }

  // Summary = prose paragraphs of the header that are NOT the `.new{ ... }` block.
  const summary = header
    .replace(/[\w.]+\.new{[\s\S]*?}\n?/g, '')
    .split('\n')
    .filter((l) => l.trim() && !/^\s*\w+\s*[,=]/.test(l))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const title = header.split('\n')[0].replace(/\.$/, '');

  const keys = [...src.matchAll(/key\s*==\s*"([^"]+)"/g)].map((m) => m[1]);
  const capabilities: WidgetCapabilities = {
    focusable: /self\.focusable\s*=\s*true/.test(src),
    keys: [...new Set(keys)],
    wheel: /function\s+[\w.]+:wheelmoved\([^)]*\)\s*[\s\S]*?return\s+true/.test(src),
    mousemoved: /function\s+[\w.]+:mousemoved\(/.test(src)
  };

  return { id, displayName, title, summary, options, capabilities, sourceExcerpt: newMatch[0] };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test scripts/widget-parse.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/widget-parse.ts scripts/widget-parse.test.ts
git commit -m "feat(parser): per-widget doc extraction"
```

---

## Task 4: Parser — orchestrator that writes JSON

**Files:**
- Create: `scripts/parse-widgets.ts`
- Test: `scripts/parse-widgets.test.ts`

- [ ] **Step 1: Write the failing test (integration against real library)**

`scripts/parse-widgets.test.ts`:
```ts
import { expect, test } from 'bun:test';
import { buildWidgetData } from './parse-widgets';

test('buildWidgetData covers every init.lua widget', () => {
  const { widgets, tokens } = buildWidgetData(process.env.FOXLOVES_DIR ?? '../foxloves');
  // init.lua exports 24 widgets
  expect(widgets.length).toBe(24);
  const button = widgets.find((w) => w.id === 'button')!;
  expect(button.options.some((o) => o.name === 'label')).toBe(true);
  expect(tokens.colors.some((c) => c.name === 'accent')).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test scripts/parse-widgets.test.ts`
Expected: FAIL — `Cannot find module './parse-widgets'`.

- [ ] **Step 3: Write `scripts/parse-widgets.ts`**

```ts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseInitExports, parseTheme, type ParsedTheme } from './lua-parse';
import { parseWidget, type WidgetDoc } from './widget-parse';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export interface WidgetData { widgets: WidgetDoc[]; tokens: ParsedTheme; }

export function buildWidgetData(foxDir: string): WidgetData {
  const fox = join(REPO_ROOT, foxDir);
  const init = readFileSync(join(fox, 'foxloves/init.lua'), 'utf8');
  const refs = parseInitExports(init);
  const CONTAINER = new Set(['Panel', 'Modal', 'Dropdown', 'Tooltip', 'Tabs', 'ListBox', 'ContextMenu', 'ToastHost']);

  const widgets = refs.map((ref) => {
    const src = readFileSync(join(fox, `foxloves/widgets/${ref.module}.lua`), 'utf8');
    const doc = parseWidget(ref.module, ref.displayName, src);
    return { ...doc, category: CONTAINER.has(ref.displayName) ? 'container-overlay' : 'control' };
  });

  const tokens = parseTheme(readFileSync(join(fox, 'foxloves/theme.lua'), 'utf8'));
  return { widgets, tokens };
}

export function writeWidgetData(foxDir: string): void {
  const { widgets, tokens } = buildWidgetData(foxDir);
  const outDir = join(REPO_ROOT, 'src/lib/data');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'widgets.json'), JSON.stringify(widgets, null, 2));
  writeFileSync(join(outDir, 'tokens.json'), JSON.stringify(tokens, null, 2));
  console.log(`parsed ${widgets.length} widgets, ${tokens.colors.length} colors`);
}

if (import.meta.main) writeWidgetData(process.env.FOXLOVES_DIR ?? '../foxloves');
```

Note: `WidgetDoc` gains a `category` field via the spread. Add `category?: 'control' | 'container-overlay';` to the `WidgetDoc` interface in `scripts/widget-parse.ts`.

- [ ] **Step 4: Add `category` to `WidgetDoc`**

In `scripts/widget-parse.ts`, extend the interface:
```ts
export interface WidgetDoc {
  id: string;
  displayName: string;
  title: string;
  summary: string;
  options: WidgetOption[];
  capabilities: WidgetCapabilities;
  sourceExcerpt: string;
  category?: 'control' | 'container-overlay';
}
```

- [ ] **Step 5: Run tests + generate real data**

Run: `bun test scripts/parse-widgets.test.ts && bun run parse`
Expected: PASS, and console prints `parsed 24 widgets, N colors`. Files `src/lib/data/widgets.json` + `tokens.json` exist.

If the count is not 24 or a `parseWidget` throw fires, the failing widget name is in the error — inspect that Lua file and adjust the regexes in `widget-parse.ts` (this is the drift-catching behavior working as intended).

- [ ] **Step 6: Commit**

```bash
git add scripts/parse-widgets.ts scripts/parse-widgets.test.ts scripts/widget-parse.ts
git commit -m "feat(parser): orchestrate widgets.json + tokens.json"
```

---

## Task 5: Screenshot harness — LÖVE app

**Files:**
- Create: `harness/conf.lua`, `harness/main.lua`, `harness/states.lua`

The harness renders each widget's states to offscreen Canvases and writes PNGs + `manifest.json` into the LÖVE save directory.

- [ ] **Step 1: Write `harness/conf.lua`**

```lua
function love.conf(t)
  t.identity = "foxloves-manual-shots"   -- save dir name
  t.window.width = 64
  t.window.height = 64
  t.window.visible = false
  t.window.borderless = true
end
```

- [ ] **Step 2: Write `harness/states.lua`**

Generic states apply to all widgets; per-widget overrides add variants/values. `mutate(w)` forces the runtime flags a draw path reads.

```lua
-- Returns a list of { state=<string>, opts=<table>, mutate=<fn|nil> } for a
-- widget id. Generic states first, then per-widget extras.
local function focus(w) w.root = { focused = w } end

local base = { x = 8, y = 8, w = 160, h = 34 }

local generic = {
  { state = "default", opts = {} },
  { state = "hover",   opts = {}, mutate = function(w) w.hovered = true end },
  { state = "disabled",opts = { disabled = true } },
  { state = "focused", opts = {}, mutate = focus },
}

-- Per-widget extra shots (merged after generic). Keep opts minimal + valid.
local extra = {
  button      = { { state = "pressed", opts = {}, mutate = function(w) w.hovered = true; w.pressed = true end } },
  slider      = {
    { state = "mid",      opts = { value = 0.5, min = 0, max = 1 } },
    { state = "vertical", opts = { value = 0.5, w = 24, h = 140, vertical = true } },
  },
  progressbar = { { state = "half", opts = { value = 0.5 } }, { state = "full", opts = { value = 1 } } },
  toggle      = { { state = "on", opts = {}, mutate = function(w) w.value = true; w.on = true end } },
  checkbox    = { { state = "checked", opts = { checked = true } } },
  badge       = { { state = "default", opts = { label = "NEW" } } },
  label       = { { state = "default", opts = { text = "Label text" } } },
}

local M = {}
function M.for_widget(id, ctor_opts_base)
  local list = {}
  for _, s in ipairs(generic) do
    list[#list + 1] = { state = s.state, opts = s.opts, mutate = s.mutate }
  end
  for _, s in ipairs(extra[id] or {}) do
    list[#list + 1] = s
  end
  return list
end
M.base = base
return M
```

- [ ] **Step 3: Write `harness/main.lua`**

```lua
-- Renders every foxloves widget's states to PNGs + manifest.json in the save dir.
-- Run: love harness   (from the manual repo root; FOXLOVES_DIR via arg or default)
package.path = package.path .. ";../foxloves/?.lua;../foxloves/?/init.lua"

local fox = require("foxloves")
local states = require("states")

-- Widget ids come from init.lua's export table (the canonical set).
local IGNORE = { theme = true, util = true, Root = true }
local MODULE_OF = {} -- displayName -> lower id used for shot dirs
for name, mod in pairs(fox) do
  if type(mod) == "table" and mod.new and not IGNORE[name] then
    MODULE_OF[name] = name:lower()
  end
end

local manifest = {}
local errors = {}

local function shoot(id, factory, spec)
  local base = states.base
  local opts = {}
  for k, v in pairs(base) do opts[k] = v end
  for k, v in pairs(spec.opts) do opts[k] = v end
  opts.x, opts.y = base.x, base.y

  local ok, w = pcall(factory.new, opts)
  if not ok then errors[#errors + 1] = id .. "/" .. spec.state .. ": ctor " .. tostring(w); return end
  if spec.mutate then pcall(spec.mutate, w) end

  local cw = (opts.w or 160) + base.x * 2
  local ch = (opts.h or 34) + base.y * 2
  local canvas = love.graphics.newCanvas(cw, ch)
  love.graphics.setCanvas(canvas)
  love.graphics.clear(fox.theme.color.bg)
  local drew = pcall(function() w:draw() end)
  love.graphics.setCanvas()
  if not drew then errors[#errors + 1] = id .. "/" .. spec.state .. ": draw"; return end

  local rel = "shots/" .. id .. "/" .. spec.state .. ".png"
  canvas:newImageData():encode("png", rel)
  manifest[id] = manifest[id] or {}
  manifest[id][#manifest[id] + 1] = { state = spec.state, file = rel, w = cw, h = ch }
end

function love.load()
  love.filesystem.createDirectory("shots")
  for name, id in pairs(MODULE_OF) do
    love.filesystem.createDirectory("shots/" .. id)
    for _, spec in ipairs(states.for_widget(id)) do
      shoot(id, fox[name], spec)
    end
  end
  local json = require("json_encode")
  love.filesystem.write("shots/manifest.json", json.encode(manifest))
  if #errors > 0 then
    love.filesystem.write("shots/errors.txt", table.concat(errors, "\n"))
    print("HARNESS ERRORS:\n" .. table.concat(errors, "\n"))
  end
  print("shot " .. #(next(manifest) and manifest or {}) .. " widgets; save dir: " .. love.filesystem.getSaveDirectory())
  love.event.quit(#errors > 0 and 1 or 0)
end

function love.draw() end
```

- [ ] **Step 4: Add a tiny JSON encoder `harness/json_encode.lua`**

LÖVE has no built-in JSON. Minimal encoder for our nested table/array/string/number shape:
```lua
local M = {}
local function esc(s) return s:gsub('["\\]', '\\%0') end
local function enc(v)
  local t = type(v)
  if t == "string" then return '"' .. esc(v) .. '"' end
  if t == "number" then return tostring(v) end
  if t == "boolean" then return tostring(v) end
  if t == "table" then
    -- array if sequential 1..n
    local n = #v
    local isArr = n > 0
    for k in pairs(v) do if type(k) ~= "number" then isArr = false break end end
    if isArr then
      local parts = {}
      for i = 1, n do parts[i] = enc(v[i]) end
      return "[" .. table.concat(parts, ",") .. "]"
    end
    local parts = {}
    for k, val in pairs(v) do parts[#parts + 1] = '"' .. esc(tostring(k)) .. '":' .. enc(val) end
    return "{" .. table.concat(parts, ",") .. "}"
  end
  return "null"
end
function M.encode(v) return enc(v) end
return M
```

- [ ] **Step 5: Run the harness manually**

Run:
```bash
love harness
cat "$(ls -d ~/.local/share/love/foxloves-manual-shots 2>/dev/null || echo ~/.local/share/love/foxloves-manual-shots)/shots/manifest.json" | head -c 300; echo
```
Expected: manifest JSON prints; `shots/errors.txt` absent or lists only genuinely un-renderable widgets (containers needing a Root — acceptable, they'll get placeholder handling in Task 6). Note the save directory path printed.

- [ ] **Step 6: Commit**

```bash
git add harness/
git commit -m "feat(harness): love screenshot renderer + state specs"
```

---

## Task 6: Generate orchestration + guards

**Files:**
- Create: `scripts/shoot.ts`, `scripts/generate.ts`, `scripts/verify-shots.ts`
- Test: `scripts/verify-shots.test.ts`

- [ ] **Step 1: Write `scripts/shoot.ts` (run LÖVE, copy PNGs into static/)**

```ts
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SAVE_DIR = join(homedir(), '.local/share/love/foxloves-manual-shots');
const DEST = join(REPO_ROOT, 'static/shots');

const res = spawnSync('love', ['harness'], { cwd: REPO_ROOT, stdio: 'inherit' });
if (res.status !== 0) console.warn(`harness exited ${res.status} (some widgets failed; see errors.txt)`);

const src = join(SAVE_DIR, 'shots');
if (!existsSync(src)) throw new Error(`no shots produced at ${src}`);
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
cpSync(src, DEST, { recursive: true });
console.log(`copied shots -> ${DEST}`);
```

- [ ] **Step 2: Write `scripts/verify-shots.ts` (drift + missing-file guard)**

```ts
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function verifyShots(): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  const widgets = JSON.parse(readFileSync(join(REPO_ROOT, 'src/lib/data/widgets.json'), 'utf8')) as { id: string }[];
  const manifestPath = join(REPO_ROOT, 'static/shots/manifest.json');
  if (!existsSync(manifestPath)) return { ok: false, problems: ['manifest.json missing — run bun run shots'] };
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, { state: string; file: string }[]>;

  for (const w of widgets) {
    if (!manifest[w.id]) { problems.push(`no shots for widget "${w.id}"`); continue; }
    for (const shot of manifest[w.id]) {
      if (!existsSync(join(REPO_ROOT, 'static', shot.file))) problems.push(`missing PNG ${shot.file}`);
    }
  }
  for (const id of Object.keys(manifest)) {
    if (!widgets.find((w) => w.id === id)) problems.push(`manifest has "${id}" not in widgets.json (drift)`);
  }
  return { ok: problems.length === 0, problems };
}

if (import.meta.main) {
  const { ok, problems } = verifyShots();
  if (!ok) { console.error('SHOT VERIFY FAILED:\n' + problems.join('\n')); process.exit(1); }
  console.log('shots verified: all widgets covered, all PNGs present');
}
```

- [ ] **Step 3: Write `scripts/verify-shots.test.ts`**

```ts
import { expect, test } from 'bun:test';
import { verifyShots } from './verify-shots';

test('verifyShots passes after generate', () => {
  const { ok, problems } = verifyShots();
  if (!ok) console.error(problems.join('\n'));
  expect(ok).toBe(true);
});
```

- [ ] **Step 4: Write `scripts/generate.ts` (full pipeline)**

```ts
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
function run(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (${r.status})`);
}

run('bun', ['run', 'scripts/parse-widgets.ts']);
run('bun', ['run', 'scripts/shoot.ts']);
run('bun', ['run', 'scripts/verify-shots.ts']);
console.log('generate complete');
```

- [ ] **Step 5: Run full generate + verify**

Run: `bun run generate`
Expected: parser prints `24 widgets`, harness runs, shots copied, `shots verified` prints. If verify fails on container widgets that could not render standalone, add minimal valid opts (e.g. a `root`/items) to their `extra` entry in `harness/states.lua`, or add a `placeholder` state that renders the widget's empty panel — then re-run. Do not weaken the guard.

- [ ] **Step 6: Run the shot verify test**

Run: `bun test scripts/verify-shots.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/shoot.ts scripts/generate.ts scripts/verify-shots.ts scripts/verify-shots.test.ts
git commit -m "feat(pipeline): generate orchestration + drift/missing-shot guards"
```

---

## Task 7: Site data layer + types

**Files:**
- Create: `src/lib/types.ts`, `src/lib/data.ts`

- [ ] **Step 1: Write `src/lib/types.ts`**

Mirror the parser output shapes (re-declared here so the site has no build-time dep on `scripts/`):
```ts
export interface WidgetOption {
  name: string;
  default: string | null;
  type: string;
  description?: string;
  isCallback: boolean;
}
export interface WidgetCapabilities { focusable: boolean; keys: string[]; wheel: boolean; mousemoved: boolean; }
export interface WidgetDoc {
  id: string; displayName: string; title: string; summary: string;
  options: WidgetOption[]; capabilities: WidgetCapabilities;
  sourceExcerpt: string; category: 'control' | 'container-overlay';
}
export interface Shot { state: string; file: string; w: number; h: number; }
export interface ThemeColor { name: string; rgba: number[]; hex: string; rgbaCss: string; note?: string; }
export interface Tokens { colors: ThemeColor[]; radius: number; padding: number; }
```

- [ ] **Step 2: Write `src/lib/data.ts` (typed accessors over generated JSON)**

```ts
import widgetsJson from './data/widgets.json';
import tokensJson from './data/tokens.json';
import manifestJson from '../../static/shots/manifest.json';
import type { WidgetDoc, Tokens, Shot } from './types';

export const widgets = widgetsJson as WidgetDoc[];
export const tokens = tokensJson as Tokens;
const manifest = manifestJson as Record<string, Shot[]>;

export function getWidget(id: string): WidgetDoc | undefined {
  return widgets.find((w) => w.id === id);
}
export function shotsFor(id: string): Shot[] {
  return manifest[id] ?? [];
}
export function widgetsByCategory() {
  return {
    control: widgets.filter((w) => w.category === 'control'),
    'container-overlay': widgets.filter((w) => w.category === 'container-overlay')
  };
}
```

Note: importing `manifest.json` from `static/` requires it to exist (Task 6 must have run). Add `"resolveJsonModule": true` is already in tsconfig.

- [ ] **Step 3: Verify types compile**

Run: `bun run check`
Expected: 0 errors (data files exist from Task 6).

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/data.ts
git commit -m "feat(site): typed data layer over generated json"
```

---

## Task 8: Shared components + theme styling

**Files:**
- Create: `src/lib/theme.css`, `src/lib/components/{CategoryBadge,CapabilityChips,OptionsTable,ShotFigure,WidgetGallery,TokenSwatch,CodeBlock}.svelte`
- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Write `src/lib/theme.css` from foxloves tokens**

Use the real values from `tokens.json` (fox dark + orange). Static CSS vars:
```css
:root {
  --fox-bg: #292b33;
  --fox-fg: #383d47;
  --fox-accent: #e68c40;
  --fox-border: #595e6b;
  --fox-hover: #474d59;
  --fox-focus: #fab866;
  --fox-text: #f0f2f7;
  --fox-text-muted: #8c919e;
  --fox-radius: 4px;
  --fox-pad: 8px;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--fox-bg); color: var(--fox-text);
  font: 15px/1.55 system-ui, sans-serif; }
a { color: var(--fox-accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code, pre { font-family: ui-monospace, monospace; }
```

- [ ] **Step 2: Write `CategoryBadge.svelte` + `CapabilityChips.svelte`**

`CategoryBadge.svelte`:
```svelte
<script lang="ts">export let category: 'control' | 'container-overlay';</script>
<span class="badge">{category === 'control' ? 'Control' : 'Container / Overlay'}</span>
<style>
.badge { font-size: 12px; padding: 2px 8px; border-radius: 999px;
  border: 1px solid var(--fox-border); color: var(--fox-text-muted); }
</style>
```

`CapabilityChips.svelte`:
```svelte
<script lang="ts">
  import type { WidgetCapabilities } from '$lib/types';
  export let capabilities: WidgetCapabilities;
</script>
<div class="chips">
  {#if capabilities.focusable}<span>Focusable</span>{/if}
  {#if capabilities.wheel}<span>Scroll wheel</span>{/if}
  {#if capabilities.mousemoved}<span>Hover</span>{/if}
  {#each capabilities.keys as k}<span class="key">{k}</span>{/each}
</div>
<style>
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips span { font-size: 12px; padding: 2px 8px; border-radius: 4px;
  background: var(--fox-fg); border: 1px solid var(--fox-border); }
.chips .key { font-family: ui-monospace, monospace; color: var(--fox-focus); }
</style>
```

- [ ] **Step 3: Write `OptionsTable.svelte`**

```svelte
<script lang="ts">
  import type { WidgetOption } from '$lib/types';
  export let options: WidgetOption[];
</script>
<table>
  <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
  <tbody>
    {#each options as o}
      <tr>
        <td><code>{o.name}</code>{#if o.isCallback}<span class="cb">fn</span>{/if}</td>
        <td>{o.type}</td>
        <td><code>{o.default ?? '—'}</code></td>
        <td>{o.description ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>
<style>
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid var(--fox-border); vertical-align: top; }
th { color: var(--fox-text-muted); font-weight: 600; }
.cb { margin-left: 6px; font-size: 11px; color: var(--fox-accent); }
</style>
```

- [ ] **Step 4: Write `ShotFigure.svelte` + `WidgetGallery.svelte`**

`ShotFigure.svelte`:
```svelte
<script lang="ts">
  import type { Shot } from '$lib/types';
  import { base } from '$app/paths';
  export let shot: Shot;
</script>
<figure>
  <img src="{base}/{shot.file}" alt={shot.state} width={shot.w} height={shot.h} />
  <figcaption>{shot.state}</figcaption>
</figure>
<style>
figure { margin: 0; }
img { display: block; border: 1px solid var(--fox-border); border-radius: 4px; image-rendering: pixelated; }
figcaption { margin-top: 4px; font-size: 12px; color: var(--fox-text-muted); }
</style>
```

`WidgetGallery.svelte`:
```svelte
<script lang="ts">
  import type { Shot } from '$lib/types';
  import ShotFigure from './ShotFigure.svelte';
  export let shots: Shot[];
</script>
<div class="gallery">
  {#each shots as s}<ShotFigure shot={s} />{/each}
</div>
<style>
.gallery { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
```

- [ ] **Step 5: Write `TokenSwatch.svelte`**

```svelte
<script lang="ts">
  import type { ThemeColor } from '$lib/types';
  export let color: ThemeColor;
</script>
<div class="swatch">
  <div class="chip" style="background: {color.rgbaCss}"></div>
  <div class="meta">
    <code>{color.name}</code>
    <span>{color.hex}</span>
    {#if color.note}<em>{color.note}</em>{/if}
  </div>
</div>
<style>
.swatch { display: flex; gap: 10px; align-items: center; }
.chip { width: 44px; height: 44px; border-radius: 6px; border: 1px solid var(--fox-border); }
.meta { display: flex; flex-direction: column; font-size: 13px; }
.meta span { color: var(--fox-text-muted); }
.meta em { color: var(--fox-text-muted); font-style: italic; }
</style>
```

- [ ] **Step 6: Write `CodeBlock.svelte` (shiki, build-time highlight)**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { codeToHtml } from 'shiki';
  export let code: string;
  export let lang = 'lua';
  let html = '';
  onMount(async () => {
    html = await codeToHtml(code, { lang, theme: 'vitesse-dark' });
  });
</script>
{#if html}{@html html}{:else}<pre><code>{code}</code></pre>{/if}
<style>
:global(pre.shiki) { padding: 14px; border-radius: 6px; overflow-x: auto; font-size: 13px; }
</style>
```

- [ ] **Step 7: Write `src/routes/+layout.svelte` (sidebar + theme import)**

```svelte
<script lang="ts">
  import '$lib/theme.css';
  import { widgetsByCategory } from '$lib/data';
  import { base } from '$app/paths';
  const cats = widgetsByCategory();
</script>
<div class="shell">
  <nav>
    <a class="brand" href="{base}/">foxloves</a>
    <a href="{base}/foundations/theme">Theme</a>
    <a href="{base}/foundations/lifecycle">Lifecycle</a>
    <h4>Controls</h4>
    {#each cats.control as w}<a href="{base}/widgets/{w.id}">{w.displayName}</a>{/each}
    <h4>Containers / Overlays</h4>
    {#each cats['container-overlay'] as w}<a href="{base}/widgets/{w.id}">{w.displayName}</a>{/each}
  </nav>
  <main><slot /></main>
</div>
<style>
.shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
nav { background: var(--fox-fg); padding: 16px; display: flex; flex-direction: column; gap: 4px;
  border-right: 1px solid var(--fox-border); position: sticky; top: 0; height: 100vh; overflow-y: auto; }
nav a { padding: 3px 6px; border-radius: 4px; font-size: 14px; }
nav a:hover { background: var(--fox-hover); text-decoration: none; }
nav .brand { font-size: 20px; font-weight: 700; color: var(--fox-accent); margin-bottom: 8px; }
nav h4 { margin: 14px 0 2px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--fox-text-muted); }
main { padding: 32px 40px; max-width: 900px; }
</style>
```

- [ ] **Step 8: Verify build compiles**

Run: `bun run check`
Expected: 0 errors.

- [ ] **Step 9: Commit**

```bash
git add src/lib/theme.css src/lib/components src/routes/+layout.svelte
git commit -m "feat(site): shared components + fox theme + sidebar layout"
```

---

## Task 9: Widget pages (index + detail)

**Files:**
- Create: `src/routes/widgets/+page.svelte`, `src/routes/widgets/[id]/+page.ts`, `src/routes/widgets/[id]/+page.svelte`

- [ ] **Step 1: Write `src/routes/widgets/+page.svelte` (filterable grid)**

```svelte
<script lang="ts">
  import { widgets } from '$lib/data';
  import { shotsFor } from '$lib/data';
  import { base } from '$app/paths';
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  let q = '';
  $: filtered = widgets.filter((w) => w.displayName.toLowerCase().includes(q.toLowerCase()));
</script>
<h1>Widgets</h1>
<input placeholder="Filter widgets…" bind:value={q} />
<div class="grid">
  {#each filtered as w}
    {@const shot = shotsFor(w.id)[0]}
    <a class="card" href="{base}/widgets/{w.id}">
      {#if shot}<img src="{base}/{shot.file}" alt={w.displayName} />{/if}
      <div class="row"><strong>{w.displayName}</strong><CategoryBadge category={w.category} /></div>
      <p>{w.summary}</p>
    </a>
  {/each}
</div>
<style>
input { width: 100%; max-width: 320px; padding: 8px 10px; margin: 10px 0 20px;
  background: var(--fox-fg); border: 1px solid var(--fox-border); border-radius: 6px; color: var(--fox-text); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.card { display: block; padding: 12px; border: 1px solid var(--fox-border); border-radius: 8px; background: var(--fox-fg); }
.card:hover { border-color: var(--fox-accent); text-decoration: none; }
.card img { display: block; margin-bottom: 8px; image-rendering: pixelated; }
.card .row { display: flex; justify-content: space-between; align-items: center; }
.card p { color: var(--fox-text-muted); font-size: 13px; margin: 6px 0 0; }
</style>
```

- [ ] **Step 2: Write `src/routes/widgets/[id]/+page.ts` (prerender entries + load)**

```ts
import { error } from '@sveltejs/kit';
import { widgets, getWidget, shotsFor } from '$lib/data';
import type { EntryGenerator } from './$types';

export const prerender = true;
export const entries: EntryGenerator = () => widgets.map((w) => ({ id: w.id }));

export function load({ params }: { params: { id: string } }) {
  const widget = getWidget(params.id);
  if (!widget) throw error(404, `Unknown widget ${params.id}`);
  return { widget, shots: shotsFor(params.id) };
}
```

- [ ] **Step 3: Write `src/routes/widgets/[id]/+page.svelte`**

```svelte
<script lang="ts">
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import CapabilityChips from '$lib/components/CapabilityChips.svelte';
  import OptionsTable from '$lib/components/OptionsTable.svelte';
  import WidgetGallery from '$lib/components/WidgetGallery.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  export let data;
  $: w = data.widget;
  $: example = `local fox = require("foxloves")\nlocal ${w.id} = fox.${w.displayName}.new{\n  x = 40, y = 40,${w.options.find((o)=>o.name==='w') ? ' w = 200,' : ''}\n${w.options.filter((o)=>['label','text','placeholder'].includes(o.name)).map((o)=>`  ${o.name} = ${o.default ?? '""'},`).join('\n')}\n}`;
</script>
<header>
  <h1>{w.displayName}</h1>
  <CategoryBadge category={w.category} />
</header>
<p class="summary">{w.summary}</p>

<h2>Appearance</h2>
<WidgetGallery shots={data.shots} />

<h2>Capabilities</h2>
<CapabilityChips capabilities={w.capabilities} />

<h2>Options</h2>
<OptionsTable options={w.options} />

<h2>Example</h2>
<CodeBlock code={example} />

<h2>Source</h2>
<CodeBlock code={w.sourceExcerpt} />

<style>
header { display: flex; align-items: center; gap: 12px; }
.summary { color: var(--fox-text-muted); font-size: 16px; }
h2 { margin-top: 32px; border-bottom: 1px solid var(--fox-border); padding-bottom: 6px; }
</style>
```

- [ ] **Step 4: Verify pages render in dev**

Run: `bun run dev &` then `sleep 3 && curl -sf http://localhost:5173/widgets/button | grep -q "Options" && echo OK; kill %1`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add src/routes/widgets
git commit -m "feat(site): widget index + data-driven detail pages"
```

---

## Task 10: Foundations pages + landing

**Files:**
- Create: `src/routes/+page.svelte`, `src/routes/foundations/theme/+page.svelte`, `src/routes/foundations/lifecycle/+page.svelte`

- [ ] **Step 1: Write landing `src/routes/+page.svelte`**

```svelte
<script lang="ts">
  import { widgets } from '$lib/data';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { base } from '$app/paths';
  const quickstart = `local fox = require("foxloves")\nlocal ui = fox.Root.new()\nui:add(fox.Button.new{ x=40, y=40, w=120, h=34, label="Greet" })`;
</script>
<h1>foxloves</h1>
<p class="lead">A dependency-free, themeable UI widget library for LÖVE (love2d).
{widgets.length} widgets sharing one input + drawing lifecycle.</p>
<h2>Install</h2>
<p>Copy the <code>foxloves/</code> folder onto your require path, then:</p>
<CodeBlock code={'local fox = require("foxloves")'} />
<h2>Quick start</h2>
<CodeBlock code={quickstart} />
<p><a href="{base}/widgets">Browse all widgets →</a></p>
<style>
.lead { font-size: 18px; color: var(--fox-text-muted); max-width: 640px; }
h2 { margin-top: 28px; }
</style>
```

- [ ] **Step 2: Write `src/routes/foundations/theme/+page.svelte`**

```svelte
<script lang="ts">
  import { tokens } from '$lib/data';
  import TokenSwatch from '$lib/components/TokenSwatch.svelte';
</script>
<h1>Theme</h1>
<p>Every widget reads colors + metrics from a shared theme table. Override per widget via the <code>theme</code> option.</p>
<h2>Colors</h2>
<div class="swatches">
  {#each tokens.colors as c}<TokenSwatch color={c} />{/each}
</div>
<h2>Metrics</h2>
<ul>
  <li>Corner radius: <code>{tokens.radius}px</code></li>
  <li>Padding: <code>{tokens.padding}px</code></li>
</ul>
<style>
.swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin: 12px 0; }
h2 { margin-top: 28px; }
</style>
```

- [ ] **Step 3: Write `src/routes/foundations/lifecycle/+page.svelte`**

Authored conceptual prose (allowed — not per-widget API). Content drawn from the library's lifecycle contract:
```svelte
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const loop = `function love.update(dt)            ui:update(dt) end\nfunction love.draw()               ui:draw() end\nfunction love.mousepressed(x,y,b)  ui:mousepressed(x,y,b) end\nfunction love.mousereleased(x,y,b) ui:mousereleased(x,y,b) end\nfunction love.textinput(t)         ui:textinput(t) end\nfunction love.keypressed(k)        if ui:keypressed(k) then return end end`;
</script>
<h1>Widget lifecycle</h1>
<p>Every widget follows the same contract so a host can drive them uniformly.
Input handlers return <code>true</code> when they consume an event, so callers can stop propagation.</p>
<ul>
  <li><code>update(dt)</code> — per-frame logic (hover, caret blink).</li>
  <li><code>draw()</code> — renders via <code>love.graphics</code>; restores prior color state.</li>
  <li><code>mousepressed / mousereleased(x, y, btn)</code> — return <code>true</code> if consumed.</li>
  <li><code>keypressed(key)</code>, <code>textinput(text)</code> — keyboard input.</li>
  <li><code>wheelmoved(dx, dy)</code>, <code>mousemoved(x, y, dx, dy)</code> — optional hooks.</li>
</ul>
<h2>Driving with fox.Root</h2>
<p><code>fox.Root</code> coordinates z-order, input capture, and keyboard focus.
Tab / Shift-Tab move focus between focusable widgets; Space/Enter (or arrows) activate the focused one.</p>
<CodeBlock code={loop} />
<style>h2 { margin-top: 28px; } li { margin: 4px 0; }</style>
```

- [ ] **Step 4: Verify all routes prerender**

Run: `bun run build`
Expected: build succeeds; `build/` contains `index.html`, `widgets/button/index.html`, `foundations/theme/index.html`, etc. If prerender errors on a widget route, the error names the id — fix the offending component/data.

- [ ] **Step 5: Preview the static build**

Run: `bun run preview &` then `sleep 3 && curl -sf http://localhost:4173/ | grep -q foxloves && echo OK; kill %1`
Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add src/routes/+page.svelte src/routes/foundations
git commit -m "feat(site): landing + theme + lifecycle foundations pages"
```

---

## Task 11: End-to-end verification + README

**Files:**
- Create: `README.md`
- Modify: none

- [ ] **Step 1: Clean regenerate from scratch**

Run:
```bash
rm -rf src/lib/data static/shots build
bun run generate && bun run build
```
Expected: parser reports 24 widgets, shots verified, build succeeds. This proves the whole pipeline is reproducible from source.

- [ ] **Step 2: Run the full test suite**

Run: `bun test`
Expected: all tests pass (lua-parse, widget-parse, parse-widgets, verify-shots).

- [ ] **Step 3: Type-check**

Run: `bun run check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Write `README.md`**

```markdown
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
- `scripts/verify-shots.ts` — fails the build if screenshots and parsed widgets drift apart.
- SvelteKit prerenders every route via `adapter-static`.

Set `FOXLOVES_DIR` to point at a library checkout other than `../foxloves`.
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: project readme"
```

---

## Self-review notes (addressed)

- **Spec coverage:** screenshots (Tasks 5–6), parse-only per-widget content (Tasks 2–4), static prerender (Tasks 1, 8–10), theme tokens page (Task 10), lifecycle page (Task 10), drift + missing-shot guards (Task 6), tests (Tasks 2–4, 6, 11), filterable widget index (Task 9), YAGNI cuts respected (no search/interactive/versioning).
- **Widget count corrected** to 24 (from init.lua), not 28; the count is asserted, not hardcoded in logic.
- **Container widgets** (Panel/Modal/etc.) may not render standalone in the harness — Task 6 Step 5 handles this explicitly by adding valid opts or a placeholder state without weakening the guard.
- **Type consistency:** `WidgetDoc`/`WidgetOption`/`Shot`/`Tokens` shapes match between parser output (`scripts/`) and site types (`src/lib/types.ts`), kept as parallel declarations to avoid a site→scripts build dependency.
```
