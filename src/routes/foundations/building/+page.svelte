<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const layout = `foxloves/
├── conf.lua              -- LÖVE window config
├── main.lua              -- demo / playground (love .)
├── foxloves/
│   ├── init.lua          -- module entry: require("foxloves")
│   ├── theme.lua         -- colors, radius, padding, font
│   ├── util.lua          -- shared helpers (contains, clamp, focus ring)
│   ├── container.lua     -- child management for Panel / Tabs
│   ├── root.lua          -- the UI manager (z-order, focus, overlays)
│   └── widgets/
│       ├── button.lua
│       └── …one file per widget
└── tests/
    ├── run.lua           -- registers + runs every case (luajit tests/run.lua)
    ├── harness.lua       -- installs the stub, exposes check()
    ├── love_stub.lua     -- headless mock of the LÖVE API
    └── cases/            -- one assertion file per widget`;

  const theme = `-- foxloves/theme.lua
local M = {
  color = {
    bg = {0.16, 0.17, 0.20, 1}, fg = {0.22, 0.24, 0.28, 1},
    accent = {0.90, 0.55, 0.25, 1},   -- fox orange
    border = {0.35, 0.37, 0.42, 1}, hover = {0.28, 0.30, 0.35, 1},
    focus = {0.98, 0.72, 0.40, 1},    -- keyboard focus ring
    text = {0.94, 0.95, 0.97, 1}, textMuted = {0.55, 0.57, 0.62, 1},
    disabled = {0.30, 0.31, 0.34, 1},
    -- status: info / success / warning / error …
  },
  radius = 4, padding = 8, font = nil,
}
function M.getFont(theme)
  return (theme and theme.font) or M.font or love.graphics.getFont()
end
return M`;

  const util = `-- foxloves/util.lua
local M = {}
function M.contains(px, py, x, y, w, h)
  return px >= x and px <= x + w and py >= y and py <= y + h
end
function M.clamp(v, lo, hi)
  if v < lo then return lo elseif v > hi then return hi else return v end
end
-- Focus ring just outside the widget bounds; caller restores its own color.
function M.focusRing(t, x, y, w, h)
  love.graphics.setColor(t.color.focus or t.color.accent)
  love.graphics.rectangle("line", x - 2, y - 2, w + 4, h + 4, t.radius, t.radius)
end
-- True when this widget holds keyboard focus in its Root.
function M.isFocused(widget)
  return widget.root ~= nil and widget.root.focused == widget
end
return M`;

  const button = `-- foxloves/widgets/button.lua
--
-- Button.new{ x, y, w, h, label = "OK", onClick = function() end, disabled = false }
--   Fires onClick on mouse release inside bounds when the press began inside too.

local defaultTheme = require("foxloves.theme")
local util = require("foxloves.util")

local Button = {}
Button.__index = Button

function Button.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Button)
  self.x, self.y = opts.x or 0, opts.y or 0
  self.w, self.h = opts.w or 120, opts.h or 32
  self.label   = opts.label or "Button"
  self.onClick = opts.onClick
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme   -- never hardcode colors
  self.hovered, self.pressed = false, false
  self.focusable = true                     -- opt into Tab traversal
  return self
end

function Button:contains(px, py)
  return util.contains(px, py, self.x, self.y, self.w, self.h)
end

function Button:update(dt) end

function Button:mousemoved(px, py)
  self.hovered = not self.disabled and self:contains(px, py)
end

function Button:draw()
  local t = self.theme
  local r, g, b, a = love.graphics.getColor()   -- save prior state
  local fill = self.disabled and t.color.disabled
    or (self.pressed and self.hovered and t.color.accent)
    or (self.hovered and t.color.hover) or t.color.bg
  love.graphics.setColor(fill)
  love.graphics.rectangle("fill", self.x, self.y, self.w, self.h, t.radius, t.radius)
  love.graphics.setColor(t.color.border)
  love.graphics.rectangle("line", self.x, self.y, self.w, self.h, t.radius, t.radius)
  if util.isFocused(self) then util.focusRing(t, self.x, self.y, self.w, self.h) end
  love.graphics.setColor(self.disabled and t.color.textMuted or t.color.text)
  love.graphics.printf(self.label, self.x, self.y + (self.h - 14) / 2, self.w, "center")
  love.graphics.setColor(r, g, b, a)            -- restore
end

function Button:mousepressed(px, py, btn)
  if self.disabled or btn ~= 1 then return false end
  if self:contains(px, py) then self.pressed = true; return true end
  return false
end

function Button:mousereleased(px, py, btn)
  if btn ~= 1 then return false end
  local was = self.pressed; self.pressed = false
  if self.disabled or not was then return false end
  if self:contains(px, py) then
    if self.onClick then self.onClick(self) end
    return true
  end
  return false
end

function Button:keypressed(key)
  if self.disabled or not util.isFocused(self) then return false end
  if key == "space" or key == "return" then
    if self.onClick then self.onClick(self) end; return true
  end
  return false
end
function Button:textinput(text) return false end

return Button`;

  const init = `-- foxloves/init.lua
return {
  theme  = require("foxloves.theme"),
  util   = require("foxloves.util"),
  Root   = require("foxloves.root"),
  Button = require("foxloves.widgets.button"),
  -- …register each new widget here
}`;

  const testcase = `-- tests/cases/button.lua
local check = require("tests.harness")   -- installs the LÖVE stub, returns check()
local fox = require("foxloves")

local fired = false
local b = fox.Button.new{ x = 0, y = 0, w = 100, h = 30,
  onClick = function() fired = true end }

-- press then release inside bounds fires onClick and consumes both events
check(b:mousepressed(10, 10, 1) == true, "press inside consumes")
check(b:mousereleased(10, 10, 1) == true, "release inside consumes")
check(fired == true, "onClick fired")

-- disabled ignores input; draw() must not error (smoke test)
b.disabled = true
check(b:mousepressed(10, 10, 1) == false, "disabled ignores press")
b:draw()`;
</script>

<svelte:head><title>Building foxloves — foxloves</title></svelte:head>

<h1>Building foxloves from scratch</h1>
<p class="lead">
  How the library is put together, in the order you would build it. foxloves is
  pure Lua for LÖVE 11.x with no dependencies: a shared theme, a set of widgets
  that all obey one lifecycle contract, and a <code>Root</code> that drives them.
</p>

<h2>1. Project skeleton</h2>
<p>Lay out the folders and a demo entry point. <code>love .</code> runs the demo.</p>
<CodeBlock code={layout} lang="text" />
<p>
  <code>conf.lua</code> sets the window; <code>main.lua</code> creates widgets in
  <code>love.load</code> and forwards LÖVE's callbacks (see step 6).
</p>

<h2>2. The theme</h2>
<p>
  Centralize every color and metric. Widgets read from a theme table and never
  hardcode literals, so a game can restyle the whole UI by swapping one table.
</p>
<CodeBlock code={theme} />

<h2>3. Shared helpers</h2>
<p>
  A tiny <code>util</code> module for the things every widget repeats: a
  point-in-rect test, a clamp, the keyboard focus ring, and a focus check.
</p>
<CodeBlock code={util} />

<h2>4. The widget contract</h2>
<p>Every widget is a module returning a factory <code>Widget.new(opts)</code>. All widgets implement the same six lifecycle methods so a host can drive them in a loop:</p>
<ul>
  <li><code>update(dt)</code>, <code>draw()</code></li>
  <li><code>mousepressed / mousereleased(x, y, btn)</code> — return <code>true</code> when consumed</li>
  <li><code>keypressed(key)</code>, <code>textinput(text)</code></li>
</ul>
<p>Five rules keep them composable:</p>
<ol>
  <li>Never call <code>setColor</code> without restoring prior state; read all colors/metrics from the theme.</li>
  <li>Widgets hold their own state — no globals.</li>
  <li>Input handlers return <code>true</code> when they consume the event.</li>
  <li>Callbacks (<code>onClick</code>, <code>onChange</code>) come from <code>opts</code> and are optional.</li>
  <li>Document the public API in a comment block above <code>new</code>.</li>
</ol>
<p>
  Optional additive hooks, only where they fit: <code>focusable = true</code>
  (Tab traversal + focus ring), <code>setFocused(bool)</code> (Root syncs focus,
  as Textbox uses), and <code>wheelmoved(dx, dy)</code> for scrollable widgets.
</p>

<h2>5. First widget: Button</h2>
<p>
  Put the contract to work. Note the saved/restored color state, theme-driven
  fills per state (normal / hover / pressed / disabled), the focus ring, and
  <code>true</code> returned only when an event is actually consumed.
</p>
<CodeBlock code={button} />

<h2>6. Register and demo it</h2>
<p><code>require("foxloves")</code> returns a table of every widget plus the theme and helpers.</p>
<CodeBlock code={init} />
<p>Then drive it from <code>main.lua</code> — create widgets in <code>love.load</code> and forward each callback, stopping propagation when a widget consumes the event.</p>

<h2>7. Test headless</h2>
<p>
  The suite mocks the LÖVE API so it runs with no window. Each case constructs a
  widget, mutates state, asserts callbacks fire and input is consumed/ignored,
  and draws once as a smoke test. Add a file under <code>tests/cases/</code> and
  list it in the <code>cases</code> table in <code>tests/run.lua</code>.
</p>
<CodeBlock code={testcase} />
<CodeBlock code={'luajit tests/run.lua'} lang="bash" />

<h2>8. Grow the system</h2>
<p>With the contract and tests in place, add widgets outward from simple to composite:</p>
<ul>
  <li><strong>Inputs:</strong> Textbox (textinput, caret, <code>setFocused</code>), then value widgets — Checkbox, Toggle, Slider, Stepper — each firing <code>onChange</code>.</li>
  <li><strong>fox.Root:</strong> the manager for z-order, keyboard focus (Tab / Shift-Tab), and an overlay stack with input capture.</li>
  <li><strong>Container:</strong> shared child management + relative coordinates, so Panel and Tabs can nest widgets that still hover and click correctly.</li>
  <li><strong>Overlays:</strong> Modal, Dropdown, Tooltip, ContextMenu, ToastHost — pushed via <code>{'root:openOverlay(widget, { modal = bool })'}</code>.</li>
</ul>
<p>
  Keep each widget file under ~200 lines; when logic repeats, lift it into
  <code>util.lua</code> or <code>container.lua</code>. The six lifecycle methods
  are stable — every new widget must fit them.
</p>

<style>
  .lead {
    font-size: 17px;
    color: var(--fox-text-muted);
    max-width: 680px;
  }
  h2 {
    margin-top: 32px;
    border-bottom: 1px solid var(--fox-border);
    padding-bottom: 6px;
  }
  li {
    margin: 4px 0;
  }
</style>
