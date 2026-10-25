<script lang="ts">
  /**
   * A marketing route (Home, About, Contact): the page's sections as BetterCMS draws them.
   *
   * `sectionsMarkup` is the fragment's stylesheet, markup and runtime as one string, and
   * `use:bcmsSections` runs that runtime after a client-side navigation (where innerHTML never
   * runs a <script>), so Contact's form posts and sliders/tabs work on every page. Passing the
   * sections as the action's parameter re-runs it when a navigation swaps the page.
   *
   * No project configured for this build → the title only, and the build made no network call.
   */
  import { bcmsSections, sectionsMarkup, type SectionsFragment } from "@bettercms-ai/sveltekit";

  let {
    title,
    sections,
    sectionsState,
  }: { title: string; sections: SectionsFragment | null; sectionsState: "ready" | "unpublished" | "unconfigured" } = $props();
</script>

{#if sections}
  <main id="main" class="bcms-page">
    <div class="bcms-sections" use:bcmsSections={sections}>{@html sectionsMarkup(sections)}</div>
  </main>
{:else}
  <main id="main" class="page-body">
    <div>
      <h1>{title}</h1>
      <p class="empty-note">
        {#if sectionsState === "unconfigured"}
          Set PUBLIC_BCMS_PROJECT_ID to render this page’s sections from BetterCMS.
        {:else}
          This page has no published content yet — add sections to it in BetterCMS and publish.
        {/if}
      </p>
    </div>
  </main>
{/if}
