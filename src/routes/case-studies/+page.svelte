<script lang="ts">
  import CollectionIndex from "$lib/components/CollectionIndex.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<CollectionIndex
  base="/case-studies"
  heading="Case studies"
  intro="A closer look at what we’ve shipped, and how."
  empty="No published case studies yet."
  cards={data.cards}
/>
