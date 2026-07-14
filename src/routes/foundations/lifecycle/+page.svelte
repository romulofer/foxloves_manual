<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const loop = `function love.update(dt)            ui:update(dt) end
function love.draw()               ui:draw() end
function love.mousepressed(x,y,b)  ui:mousepressed(x,y,b) end
function love.mousereleased(x,y,b) ui:mousereleased(x,y,b) end
function love.textinput(t)         ui:textinput(t) end
function love.keypressed(k)        if ui:keypressed(k) then return end end`;
</script>

<svelte:head><title>Lifecycle — foxloves</title></svelte:head>

<h1>Widget lifecycle</h1>
<p>
  Every widget follows the same contract so a host can drive them uniformly. Input handlers return
  <code>true</code> when they consume an event, so callers can stop propagation.
</p>
<ul>
  <li><code>update(dt)</code> — per-frame logic (hover, caret blink).</li>
  <li><code>draw()</code> — renders via <code>love.graphics</code>; restores prior color state.</li>
  <li><code>mousepressed / mousereleased(x, y, btn)</code> — return <code>true</code> if consumed.</li>
  <li><code>keypressed(key)</code>, <code>textinput(text)</code> — keyboard input.</li>
  <li><code>wheelmoved(dx, dy)</code>, <code>mousemoved(x, y, dx, dy)</code> — optional hooks.</li>
</ul>

<h2>Driving with fox.Root</h2>
<p>
  <code>fox.Root</code> coordinates z-order, input capture, and keyboard focus. Tab / Shift-Tab move
  focus between focusable widgets; Space/Enter (or arrows) activate the focused one.
</p>
<CodeBlock code={loop} />

<style>
  h2 {
    margin-top: 28px;
  }
  li {
    margin: 4px 0;
  }
</style>
