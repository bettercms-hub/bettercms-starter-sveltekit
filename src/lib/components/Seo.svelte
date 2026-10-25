<script lang="ts">
  /** Head metadata for the current route, resolved server-side by `seo()` in its `load`
   *  (page over site, the SDK's `resolveSeo`). Empty values mean "omit the tag". */
  import type { ResolvedSeo } from "@bettercms-ai/sdk/seo";

  let { meta, siteName }: { meta: ResolvedSeo; siteName: string | null } = $props();

  /** Structured data — one <script> per schema node. `<` is escaped so a CMS value can never
   *  close the tag; the 50 KB cap guards against a runaway field inlined in every <head>. */
  const jsonLd = $derived(
    meta.jsonLd
      .filter(Boolean)
      .map((node) => JSON.stringify(node).replace(/</g, "\\u003c"))
      .filter((json) => json.length <= 50_000)
      .map((json) => `<script type="application/ld+json">${json}</` + `script>`),
  );
</script>

<svelte:head>
  <title>{meta.title}</title>
  {#if meta.description}<meta name="description" content={meta.description} />{/if}
  {#if meta.noindex}<meta name="robots" content="noindex" />{/if}
  {#if meta.canonical}<link rel="canonical" href={meta.canonical} />{/if}

  <meta property="og:title" content={meta.og.title} />
  {#if meta.og.description}<meta property="og:description" content={meta.og.description} />{/if}
  <meta property="og:type" content={meta.og.type} />
  {#if meta.og.image}<meta property="og:image" content={meta.og.image} />{/if}
  {#if meta.og.url}<meta property="og:url" content={meta.og.url} />{/if}
  {#if siteName}<meta property="og:site_name" content={siteName} />{/if}

  <meta name="twitter:card" content={meta.twitter.card} />
  <meta name="twitter:title" content={meta.twitter.title} />
  {#if meta.twitter.description}<meta name="twitter:description" content={meta.twitter.description} />{/if}
  {#if meta.twitter.image}<meta name="twitter:image" content={meta.twitter.image} />{/if}
  {#if meta.twitter.site}<meta name="twitter:site" content={meta.twitter.site} />{/if}

  {#each jsonLd as tag (tag)}{@html tag}{/each}
</svelte:head>
