/**
 * Image attributes for an entry's image field, spread beside `entryField(entry, path)`:
 *
 *   <img {...img(f.coverImage, { sizes: "100vw", path: "coverImage" })} {...entryField(entry, "coverImage")} />
 *
 * A BetterCMS media URL (`…/media/<id>/…`) goes through the adapter's `imageAttrs` — transform
 * URL, a srcset for `sizes`, alt text, focal point, and (given `path`) the page-relative
 * `data-bcms-field` + `data-bcms-kind="image"` the Astro and React starters put on their <img>.
 * Any other URL (an image pasted from elsewhere) is not a BetterCMS asset, so the transform
 * service cannot serve it: it renders as given, with the same binding attributes.
 */
import { imageAttrs } from "@bettercms-ai/sveltekit";

export type ImageValue = { url: string; alt?: string; altText?: string };

export function img(
  value: ImageValue,
  opts: { sizes: string; path?: string; loading?: "lazy" | "eager" },
): Record<string, string | number> {
  const alt = value.altText ?? value.alt ?? "";
  const loading = opts.loading ?? "lazy";
  if (/\/media\/[^/?#]+/.test(value.url)) return { ...imageAttrs(value, { sizes: opts.sizes, loading, alt, path: opts.path }) };
  return { src: value.url, alt, loading, ...(opts.path ? { "data-bcms-field": opts.path, "data-bcms-kind": "image" } : {}) };
}
