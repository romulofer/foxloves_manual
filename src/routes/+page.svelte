<script lang="ts">
  import { widgets } from '$lib/data';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
  const quickstart = `local fox = require("foxloves")
local ui = fox.Root.new()
ui:add(fox.Button.new{ x = 40, y = 40, w = 120, h = 34, label = "Greet" })

function love.update(dt) ui:update(dt) end
function love.draw()    ui:draw() end`;
</script>

<svelte:head><title>foxloves — manual</title></svelte:head>

<h1>foxloves</h1>
<p class="lead">{$t('home.lead', { n: widgets.length })}</p>

<h2>{$t('home.install')}</h2>
<p>{$t('home.installText')}</p>
<CodeBlock code={'local fox = require("foxloves")'} />

<h2>{$t('home.quickstart')}</h2>
<CodeBlock code={quickstart} />

<p class="cta"><a href="{base}/widgets">{$t('home.browse', { n: widgets.length })}</a></p>

<style>
  .lead {
    font-size: 18px;
    color: var(--fox-text-muted);
    max-width: 640px;
  }
  h2 {
    margin-top: 28px;
  }
  .cta {
    margin-top: 28px;
    font-size: 16px;
  }
</style>
