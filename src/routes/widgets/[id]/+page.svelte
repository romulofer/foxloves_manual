<script lang="ts">
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import CapabilityChips from '$lib/components/CapabilityChips.svelte';
  import OptionsTable from '$lib/components/OptionsTable.svelte';
  import WidgetGallery from '$lib/components/WidgetGallery.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { t } from '$lib/i18n';
  import type { WidgetDoc } from '$lib/types';
  export let data: { widget: WidgetDoc; shots: import('$lib/types').Shot[] };
  $: w = data.widget;

  // A minimal constructor snippet: bounds plus any notable text/value option.
  function example(widget: WidgetDoc): string {
    const notable = new Set(['label', 'text', 'placeholder', 'title', 'value']);
    const lines = ['  x = 40, y = 40,'];
    if (widget.options.some((o) => o.name === 'w')) lines.push('  w = 200,');
    for (const o of widget.options) {
      if (notable.has(o.name)) lines.push(`  ${o.name} = ${o.default ?? '""'},`);
    }
    return `local fox = require("foxloves")\nlocal ${widget.id} = fox.${widget.displayName}.new{\n${lines.join('\n')}\n}`;
  }
</script>

<svelte:head><title>{w.displayName} — foxloves</title></svelte:head>

<header>
  <h1>{w.displayName}</h1>
  <CategoryBadge category={w.category} />
</header>
<p class="summary">{w.summary}</p>

<h2>{$t('widget.appearance')}</h2>
<WidgetGallery shots={data.shots} />

<h2>{$t('widget.capabilities')}</h2>
<CapabilityChips capabilities={w.capabilities} />

<h2>{$t('widget.options')}</h2>
<OptionsTable options={w.options} />

<h2>{$t('widget.example')}</h2>
<CodeBlock code={example(w)} />

<h2>{$t('widget.source')}</h2>
<CodeBlock code={w.sourceExcerpt} />

<style>
  header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .summary {
    color: var(--fox-text-muted);
    font-size: 16px;
  }
  h2 {
    margin-top: 32px;
    border-bottom: 1px solid var(--fox-border);
    padding-bottom: 6px;
  }
</style>
