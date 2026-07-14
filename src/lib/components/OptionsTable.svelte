<script lang="ts">
  import type { WidgetOption } from '$lib/types';
  export let options: WidgetOption[];
</script>

<table>
  <thead>
    <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    {#each options as o}
      <tr>
        <td><code>{o.name}</code>{#if o.isCallback}<span class="cb">fn</span>{/if}</td>
        <td>{o.type}</td>
        <td><code>{o.default ?? '—'}</code></td>
        <td>{o.description ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  th,
  td {
    text-align: left;
    padding: 6px 10px;
    border-bottom: 1px solid var(--fox-border);
    vertical-align: top;
  }
  th {
    color: var(--fox-text-muted);
    font-weight: 600;
  }
  .cb {
    margin-left: 6px;
    font-size: 11px;
    color: var(--fox-accent);
  }
</style>
