<script lang="ts">
  import { onMount } from 'svelte';
  import { codeToHtml } from 'shiki';
  export let code: string;
  export let lang = 'lua';
  let html = '';
  onMount(async () => {
    html = await codeToHtml(code, { lang, theme: 'vitesse-dark' });
  });
</script>

{#if html}
  {@html html}
{:else}
  <pre class="fallback"><code>{code}</code></pre>
{/if}

<style>
  :global(pre.shiki) {
    padding: 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 13px;
  }
  pre.fallback {
    padding: 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 13px;
    background: #1b1e24;
    border: 1px solid var(--fox-border);
  }
</style>
