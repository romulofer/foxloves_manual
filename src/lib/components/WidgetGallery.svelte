<script lang="ts">
  import type { Shot } from '$lib/types';
  import ShotFigure from './ShotFigure.svelte';
  export let shots: Shot[];
</script>

<div class="gallery">
  {#each shots as s}<ShotFigure shot={s} />{/each}
</div>

<style>
  .gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
  }
</style>
