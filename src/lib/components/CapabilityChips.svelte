<script lang="ts">
  import type { WidgetCapabilities } from '$lib/types';
  import { t } from '$lib/i18n';
  export let capabilities: WidgetCapabilities;
</script>

<div class="chips">
  {#if capabilities.focusable}<span>{$t('cap.focusable')}</span>{/if}
  {#if capabilities.wheel}<span>{$t('cap.wheel')}</span>{/if}
  {#if capabilities.mousemoved}<span>{$t('cap.hover')}</span>{/if}
  {#each capabilities.keys as k}<span class="key">{k}</span>{/each}
  {#if !capabilities.focusable && !capabilities.wheel && !capabilities.mousemoved && capabilities.keys.length === 0}
    <span class="none">{$t('cap.displayOnly')}</span>
  {/if}
</div>

<style>
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chips span {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--fox-fg);
    border: 1px solid var(--fox-border);
  }
  .chips .key {
    font-family: ui-monospace, monospace;
    color: var(--fox-focus);
  }
  .chips .none {
    color: var(--fox-text-muted);
  }
</style>
