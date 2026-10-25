<script lang="ts">
  import CmsPage from "$lib/components/CmsPage.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<CmsPage title={data.title} sections={data.sections} sectionsState={data.sectionsState} />
