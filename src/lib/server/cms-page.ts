/**
 * The `load` behind Home, About and Contact: the page's sections fragment (see bcms.ts) and its
 * head metadata. Three routes, one function — the page's sections ARE the page, so three
 * near-identical loaders would only differ in a string.
 */
import type { ServerLoadEvent } from "@sveltejs/kit";
import { loadSections } from "./bcms";
import { getPage } from "./content";
import { seo } from "./seo";

export async function loadCmsPage(slug: string, fallbackTitle: string, { fetch, url }: Pick<ServerLoadEvent, "fetch" | "url">) {
  const page = getPage(slug);
  const sections = await loadSections(slug, fetch);
  const title = page?.title ?? fallbackTitle;
  return {
    title,
    sections: sections.state === "ready" ? sections.fragment : null,
    sectionsState: sections.state,
    seo: seo({ title, metaTitle: page?.metaTitle, metaDescription: page?.metaDescription }, url),
  };
}
