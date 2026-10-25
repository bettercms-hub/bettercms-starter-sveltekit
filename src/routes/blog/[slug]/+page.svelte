<script lang="ts">
  /**
   * One blog post, rendered with the site's own markup. The article declares its entry
   * (`entryAttrs`) and every field element declares its field: `entryField` (the absolute
   * `entry:<id>:<path>` address) beside the page-relative `data-bcms-field` the Astro and React
   * starters emit, so the editor binds click-to-edit on every element. The byline's author
   * binds to the AUTHOR entry, so editing the name edits the author, not the post.
   */
  import { entryAttrs, entryField, rich } from "@bettercms-ai/sveltekit";
  import { img } from "$lib/bind";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const post = $derived(data.post);
  const f = $derived(data.post.data);
  const author = $derived(data.author);
</script>

<main id="main">
  <article class="article" {...entryAttrs(post)}>
    <a class="back-link" href="/blog/">← Back to blog</a>
    <h1 data-bcms-field="title" {...entryField(post, "title")}>{f.title}</h1>
    {#if author || f.publishedDate}
      <p class="byline">
        {#if author}By <span {...entryField(author, "name")}>{author.data.name}</span>{#if author.data.role}, <span
              {...entryField(author, "role")}>{author.data.role}</span
            >{/if}{/if}{#if author && f.publishedDate}{" · "}{/if}{#if f.publishedDate}<span
            data-bcms-field="publishedDate"
            {...entryField(post, "publishedDate")}>{f.publishedDate}</span
          >{/if}
      </p>
    {/if}
    {#if f.coverImage?.url}
      <img
        class="cover"
        {...img(f.coverImage, { sizes: "(min-width: 48rem) 46rem, 100vw", path: "coverImage", loading: "eager" })}
        {...entryField(post, "coverImage")}
      />
    {/if}
    {#if f.body?.html}
      <div class="prose" data-bcms-field="body" data-bcms-kind="richtext" {...entryField(post, "body")}>
        {@html rich(f.body)}
      </div>
    {/if}
  </article>
</main>
