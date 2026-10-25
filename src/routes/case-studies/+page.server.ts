import { cards } from "$lib/server/collections";
import type { CaseStudyFields } from "$lib/server/content";
import { brandName, seo } from "$lib/server/seo";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => {
  const brand = brandName();
  return {
    cards: cards<CaseStudyFields>("case-study", "client", "summary"),
    seo: seo({ title: `Case studies — ${brand}`, metaDescription: `Selected work from ${brand}.` }, url),
  };
};
