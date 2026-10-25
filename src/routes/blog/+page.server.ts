import { cards } from "$lib/server/collections";
import type { BlogPostFields } from "$lib/server/content";
import { brandName, seo } from "$lib/server/seo";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => {
  const brand = brandName();
  return {
    cards: cards<BlogPostFields>("blog-post", "publishedDate", "excerpt"),
    seo: seo({ title: `Blog — ${brand}`, metaDescription: `Writing from the ${brand} team.` }, url),
  };
};
