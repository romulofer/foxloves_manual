<script lang="ts">
  import { codeToHtml } from 'shiki';
  export let code: string;
  export let lang = 'lua';
  let html = '';
  // Recompute whenever code/lang change (the component instance is reused across
  // client-side navigation between widgets). Guard against out-of-order async
  // results so a slow highlight can't overwrite a newer one.
  let reqId = 0;
  $: {
    const id = ++reqId;
    codeToHtml(code, { lang, theme: 'vitesse-dark' }).then((h) => {
      if (id === reqId) html = h;
    });
  }
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
