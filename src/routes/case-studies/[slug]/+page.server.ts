import { getEntry, listEntries, type CaseStudyFields } from "$lib/server/content";
import { caseStudySchema, seo } from "$lib/server/seo";
import type { EntryGenerator, PageServerLoad } from "./$types";

/** Prerender one HTML file per case study, listed from the snapshot. */
export const entries: EntryGenerator = () => listEntries<CaseStudyFields>("case-study").map((e) => ({ slug: e.slug }));

export const load: PageServerLoad = ({ params, url }) => {
  const cs = getEntry<CaseStudyFields>("case-study", params.slug);
  // See blog/[slug] — a miss is a corrupt snapshot, not a visitor's bad URL.
  if (!cs) throw new Error(`case study not found: ${params.slug}`);

  const f = cs.data;
  return {
    cs: { id: cs.id, slug: cs.slug, data: f },
    seo: seo({ title: f.title, metaDescription: f.summary, schema: caseStudySchema(f) }, url),
  };
};
