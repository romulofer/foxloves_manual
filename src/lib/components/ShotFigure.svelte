<script lang="ts">
  import type { Shot } from '$lib/types';
  import { base } from '$app/paths';
  export let shot: Shot;
</script>

<figure>
  <img src="{base}/{shot.file}" alt={shot.state} width={shot.w} height={shot.h} />
  <figcaption>{shot.state}</figcaption>
</figure>

<style>
  figure {
    margin: 0;
  }
  img {
    display: block;
    max-width: 100%;
    height: auto;
    border: 1px solid var(--fox-border);
    border-radius: 4px;
  }
  figcaption {
    margin-top: 4px;
    font-size: 12px;
    color: var(--fox-text-muted);
  }
</style>
