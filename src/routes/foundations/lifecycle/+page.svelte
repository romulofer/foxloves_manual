<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { t } from '$lib/i18n';
  const loop = `function love.update(dt)            ui:update(dt) end
function love.draw()               ui:draw() end
function love.mousepressed(x,y,b)  ui:mousepressed(x,y,b) end
function love.mousereleased(x,y,b) ui:mousereleased(x,y,b) end
function love.textinput(t)         ui:textinput(t) end
function love.keypressed(k)        if ui:keypressed(k) then return end end`;
</script>

<svelte:head><title>{$t('lc.title')} — foxloves</title></svelte:head>

<h1>{$t('lc.title')}</h1>
<p>{$t('lc.intro')}</p>
<ul>
  <li><code>update(dt)</code> — {$t('lc.item.update')}</li>
  <li><code>draw()</code> — {$t('lc.item.draw')}</li>
  <li><code>mousepressed / mousereleased(x, y, btn)</code> — {$t('lc.item.mouse')}</li>
  <li><code>keypressed(key)</code>, <code>textinput(text)</code> — {$t('lc.item.keyboard')}</li>
  <li><code>wheelmoved(dx, dy)</code>, <code>mousemoved(x, y, dx, dy)</code> — {$t('lc.item.optional')}</li>
</ul>

<h2>{$t('lc.rootTitle')}</h2>
<p>{$t('lc.rootText')}</p>
<CodeBlock code={loop} />

<style>
  h2 {
    margin-top: 28px;
  }
  li {
    margin: 4px 0;
  }
</style>
