<script lang="ts">
  import '$lib/theme.css';
  import { widgetsByCategory } from '$lib/data';
  import { base } from '$app/paths';
  import { t } from '$lib/i18n';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';
  const cats = widgetsByCategory();
</script>

<div class="shell">
  <nav>
    <a class="brand" href="{base}/">foxloves</a>
    <LanguageToggle />
    <a href="{base}/foundations/theme">{$t('nav.theme')}</a>
    <a href="{base}/foundations/lifecycle">{$t('nav.lifecycle')}</a>
    <a href="{base}/foundations/building">{$t('nav.building')}</a>
    <a href="{base}/widgets">{$t('nav.allWidgets')}</a>
    <h4>{$t('nav.controls')}</h4>
    {#each cats.control as w}<a href="{base}/widgets/{w.id}">{w.displayName}</a>{/each}
    <h4>{$t('nav.containers')}</h4>
    {#each cats['container-overlay'] as w}<a href="{base}/widgets/{w.id}">{w.displayName}</a>{/each}
  </nav>
  <main><slot /></main>
</div>

<style>
  .shell {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }
  nav {
    background: var(--fox-fg);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-right: 1px solid var(--fox-border);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
  nav a {
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 14px;
  }
  nav a:hover {
    background: var(--fox-hover);
    text-decoration: none;
  }
  nav .brand {
    font-size: 20px;
    font-weight: 700;
    color: var(--fox-accent);
    margin-bottom: 8px;
  }
  nav h4 {
    margin: 14px 0 2px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--fox-text-muted);
  }
  main {
    padding: 32px 40px;
    max-width: 900px;
  }
</style>
