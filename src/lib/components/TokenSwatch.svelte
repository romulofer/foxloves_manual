<script lang="ts">
  import type { ThemeColor } from '$lib/types';
  export let color: ThemeColor;
</script>

<div class="swatch">
  <div class="chip" style="background: {color.rgbaCss}"></div>
  <div class="meta">
    <code>{color.name}</code>
    <span>{color.hex}</span>
    {#if color.note}<em>{color.note}</em>{/if}
  </div>
</div>

<style>
  .swatch {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .chip {
    width: 44px;
    height: 44px;
    flex: none;
    border-radius: 6px;
    border: 1px solid var(--fox-border);
  }
  .meta {
    display: flex;
    flex-direction: column;
    font-size: 13px;
  }
  .meta span {
    color: var(--fox-text-muted);
  }
  .meta em {
    color: var(--fox-text-muted);
    font-style: italic;
  }
</style>
