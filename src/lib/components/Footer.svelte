<script lang="ts">
  /** Ft7 footer — newsletter-first.
   *
   *  Leads with the one thing the footer is actually for, and keeps the index as a single quiet
   *  row — which also stops Contact appearing a third time on every page. */
  import NewsletterForm from "./NewsletterForm.svelte";
  import type { LayoutData } from "../../routes/$types";

  let { chrome, newsletter }: { chrome: LayoutData["chrome"]; newsletter: LayoutData["newsletter"] } = $props();

  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="site-footer-inner">
    <div class="site-footer-say">
      <h2>{chrome.tagline}</h2>
    </div>
    {#if newsletter}
      <NewsletterForm form={newsletter} />
    {:else}
      <p class="newsletter-note">Add a Newsletter form in the CMS and it appears here.</p>
    {/if}
  </div>
  <div class="site-footer-meta">
    <a class="brand" href="/">{chrome.brand}<span class="dot">.</span></a>
    <nav aria-label="Footer">
      {#each chrome.footerLinks as l (l.href)}
        <a href={l.href}>{l.label}</a>
      {/each}
    </nav>
    {#if chrome.socials.length > 0}
      <div class="site-footer-socials">
        {#each chrome.socials as s (s.href)}
          <a href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>
        {/each}
      </div>
    {/if}
    <p class="site-footer-copy">© {year} {chrome.brand}</p>
  </div>
</footer>
