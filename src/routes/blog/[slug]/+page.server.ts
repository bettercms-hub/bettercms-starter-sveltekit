import { authorEntry, getEntry, listEntries, type BlogPostFields } from "$lib/server/content";
import { blogPostingSchema, seo } from "$lib/server/seo";
import type { EntryGenerator, PageServerLoad } from "./$types";

/** Prerender one HTML file per post, listed from the snapshot. */
export const entries: EntryGenerator = () => listEntries<BlogPostFields>("blog-post").map((e) => ({ slug: e.slug }));

export const load: PageServerLoad = ({ params, url }) => {
  const post = getEntry<BlogPostFields>("blog-post", params.slug);
  // `entries` derives its list from this same snapshot, so a miss can only mean the snapshot
  // changed under the build. Fail the build rather than emit a blank page. A visitor's bad URL
  // never lands here — it never got built — and is served by the 404 page instead.
  if (!post) throw new Error(`blog post not found: ${params.slug}`);

  const f = post.data;
  return {
    post: { id: post.id, slug: post.slug, data: { ...f, author: undefined } },
    author: authorEntry(f.author),
    seo: seo({ title: f.title, metaDescription: f.excerpt, schema: blogPostingSchema(f) }, url),
  };
};
