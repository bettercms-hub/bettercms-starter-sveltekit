/**
 * A REAL /404 route, so the build writes build/404.html — the file BetterCMS hosting (and
 * nginx's error_page, Netlify, Cloudflare Pages) serves for an unmatched path. `never` here
 * makes it `404.html` rather than `404/index.html`.
 */
import { brandName, seo } from "$lib/server/seo";
import type { PageServerLoad } from "./$types";

export const trailingSlash = "never";

export const load: PageServerLoad = ({ url }) => {
  const meta = seo({ title: `Page not found — ${brandName()}`, metaDescription: "That page doesn’t exist." }, url);
  // Served at every unknown URL, so it names no canonical of its own and stays out of search.
  return { seo: { ...meta, canonical: "", og: { ...meta.og, url: "" }, noindex: true } };
};
