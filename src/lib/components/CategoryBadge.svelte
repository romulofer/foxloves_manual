<script lang="ts">
  import { t } from '$lib/i18n';
  export let category: 'control' | 'container-overlay';
</script>

<span class="badge">{category === 'control' ? $t('cat.control') : $t('cat.container')}</span>

<style>
  .badge {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--fox-border);
    color: var(--fox-text-muted);
    white-space: nowrap;
  }
</style>
