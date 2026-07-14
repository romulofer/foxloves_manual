<script lang="ts">
  import { tokens } from '$lib/data';
  import TokenSwatch from '$lib/components/TokenSwatch.svelte';
  import { t } from '$lib/i18n';
</script>

<svelte:head><title>{$t('theme.title')} — foxloves</title></svelte:head>

<h1>{$t('theme.title')}</h1>
<p>{$t('theme.intro')}</p>

<h2>{$t('theme.colors')}</h2>
<div class="swatches">
  {#each tokens.colors as c}<TokenSwatch color={c} />{/each}
</div>

<h2>{$t('theme.metrics')}</h2>
<ul>
  <li>{$t('theme.radius')}: <code>{tokens.radius}px</code></li>
  <li>{$t('theme.padding')}: <code>{tokens.padding}px</code></li>
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
