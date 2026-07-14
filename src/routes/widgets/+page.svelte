<script lang="ts">
  import { widgets, shotsFor } from '$lib/data';
  import { base } from '$app/paths';
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import { t } from '$lib/i18n';
  let q = '';
  $: filtered = widgets.filter((w) => w.displayName.toLowerCase().includes(q.toLowerCase()));
</script>

<h1>{$t('widgets.title')}</h1>
<input placeholder={$t('widgets.filter')} bind:value={q} />
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
  input {
    width: 100%;
    max-width: 320px;
    padding: 8px 10px;
    margin: 10px 0 20px;
    background: var(--fox-fg);
    border: 1px solid var(--fox-border);
    border-radius: 6px;
    color: var(--fox-text);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  .card {
    display: block;
    padding: 12px;
    border: 1px solid var(--fox-border);
    border-radius: 8px;
    background: var(--fox-fg);
  }
  .card:hover {
    border-color: var(--fox-accent);
    text-decoration: none;
  }
  .card img {
    display: block;
    max-width: 100%;
    height: auto;
    margin-bottom: 8px;
    border-radius: 4px;
  }
  .card .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .card p {
    color: var(--fox-text-muted);
    font-size: 13px;
    margin: 6px 0 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
