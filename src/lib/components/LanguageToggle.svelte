<script lang="ts">
  import { locale, LOCALES, t } from '$lib/i18n';
</script>

<div class="lang" role="group" aria-label={$t('nav.language')}>
  {#each LOCALES as l}
    <button
      class:active={$locale === l.id}
      aria-pressed={$locale === l.id}
      on:click={() => locale.set(l.id)}
    >
      {l.label}
    </button>
  {/each}
</div>

<style>
  .lang {
    display: flex;
    gap: 4px;
    margin: 8px 0 6px;
  }
  button {
    flex: 1;
    padding: 4px 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--fox-text-muted);
    background: var(--fox-bg);
    border: 1px solid var(--fox-border);
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    color: var(--fox-text);
  }
  button.active {
    color: var(--fox-bg);
    background: var(--fox-accent);
    border-color: var(--fox-accent);
  }
</style>
