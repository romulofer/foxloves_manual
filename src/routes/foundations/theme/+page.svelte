<script lang="ts">
  import { tokens } from '$lib/data';
  import TokenSwatch from '$lib/components/TokenSwatch.svelte';
</script>

<svelte:head><title>Theme — foxloves</title></svelte:head>

<h1>Theme</h1>
<p>
  Every widget reads colors and metrics from a shared theme table. Override per widget via the
  <code>theme</code> option, or replace the default in <code>foxloves/theme.lua</code>.
</p>

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
  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin: 12px 0;
  }
  h2 {
    margin-top: 28px;
  }
</style>
