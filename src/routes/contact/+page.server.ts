import { loadCmsPage } from "$lib/server/cms-page";
import { brandName } from "$lib/server/seo";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (event) => loadCmsPage("contact", `Contact — ${brandName()}`, event);
