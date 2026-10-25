<script lang="ts">
  /** One case study. Same shape as a blog post — see its note on why every field is bound. */
  import { entryAttrs, entryField, rich } from "@bettercms-ai/sveltekit";
  import { img } from "$lib/bind";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const cs = $derived(data.cs);
  const f = $derived(data.cs.data);
</script>

<main id="main">
  <article class="article" {...entryAttrs(cs)}>
    <a class="back-link" href="/case-studies/">← Back to case studies</a>
    <h1 data-bcms-field="title" {...entryField(cs, "title")}>{f.title}</h1>
    {#if f.client}
      <p class="byline" data-bcms-field="client" {...entryField(cs, "client")}>{f.client}</p>
    {/if}
    {#if f.coverImage?.url}
      <img
        class="cover"
        {...img(f.coverImage, { sizes: "(min-width: 48rem) 46rem, 100vw", path: "coverImage", loading: "eager" })}
        {...entryField(cs, "coverImage")}
      />
    {/if}
    {#if f.summary}
      <p class="prose summary" data-bcms-field="summary" {...entryField(cs, "summary")}>{f.summary}</p>
    {/if}
    {#if f.body?.html}
      <div class="prose" data-bcms-field="body" data-bcms-kind="richtext" {...entryField(cs, "body")}>
        {@html rich(f.body)}
      </div>
    {/if}
  </article>
</main>
