<script lang="ts">
  /** N1b nav — three sections: wordmark · links · one CTA.
   *
   *  Everything comes from the `site` global (resolved in +layout.server.ts), so rebranding
   *  happens in the CMS, not here. The CTA is DERIVED from navLinks (the last entry) rather
   *  than appended to them, so Contact never renders twice. */
  import { page } from "$app/state";
  import type { LayoutData } from "../../routes/$types";

  let { chrome }: { chrome: LayoutData["chrome"] } = $props();

  const norm = (p: string) => p.replace(/\/+$/, "") || "/";
  const current = (href: string) => norm(href) === norm(page.url.pathname);
</script>

<nav class="site-nav" aria-label="Primary">
  <a class="brand" href="/">{chrome.brand}<span class="dot">.</span></a>
  <div class="links">
    {#each chrome.links as l (l.href)}
      <a href={l.href} aria-current={current(l.href) ? "page" : undefined}>{l.label}</a>
    {/each}
    {#if chrome.cta}
      <a class="bcms-btn bcms-btn-primary nav-cta" href={chrome.cta.href}>{chrome.cta.label}</a>
    {/if}
  </div>
</nav>
