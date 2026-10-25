<script lang="ts">
  /** Shared page shell: <head> meta + skip link + nav + footer.
   *
   *  Marketing pages render their sections into the slot; blog/case routes render their own
   *  markup. Every route OWNS its own landmark (<main>) — the shell only supplies chrome. */
  import "../styles/global.css";
  import { onMount, type Snippet } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/state";
  import { startBcmsLive } from "@bettercms-ai/sveltekit";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import type { LayoutData } from "./$types";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  // The editor canvas asks the page to re-render after a structural draft write and waits for
  // the ack; this answers it with `invalidateAll` (re-run every `load`). On a static site that
  // re-reads the prerendered data, which is harmless — and with PUBLIC_BCMS_LIVE_URL set, a
  // publish elsewhere does the same. The returned function stops both when the app unmounts.
  onMount(() => startBcmsLive({ refresh: invalidateAll, src: data.liveUrl ?? undefined }));
</script>

{#if page.data.seo}
  <Seo meta={page.data.seo} siteName={data.chrome.siteName} />
{/if}

<a class="skip-link" href="#main">Skip to content</a>
<Nav chrome={data.chrome} />
{@render children()}
<Footer chrome={data.chrome} newsletter={data.newsletter} />
