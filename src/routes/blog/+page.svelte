<script lang="ts">
  import CollectionIndex from "$lib/components/CollectionIndex.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<CollectionIndex
  base="/blog"
  heading="Blog"
  intro="Notes, updates, and what we’re thinking about."
  empty="No published posts yet."
  cards={data.cards}
/>
