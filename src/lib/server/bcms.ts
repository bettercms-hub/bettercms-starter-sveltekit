/**
 * Home, About and Contact as BetterCMS draws them: the SECTIONS FRAGMENT.
 *
 * Those pages are block trees built in the editor, so the build asks the platform for each one's
 * server-rendered sections (`bcms.sections(slug, fetch)` → markup, its scoped stylesheet, and the
 * runtime its forms, sliders and tabs need) and the page renders that inside
 * `use:bcmsSections`. One renderer for the hosted site, the editor canvas and this build, so a
 * form block on Contact is the real form, posting to the project's inbox.
 *
 * The platform sets PUBLIC_BCMS_API_URL / PUBLIC_BCMS_WORKSPACE / PUBLIC_BCMS_PROJECT_ID on its
 * builds. Without a project (a local build, CI, a fresh clone) there is nothing to ask: the page
 * renders its title only and the build makes NO network call for it.
 */
import { createBcms, type BcmsSite, type SectionsFragment } from "@bettercms-ai/sveltekit";
import { snapshotWorkspace } from "./content";
import { apiUrl, projectId, workspace } from "./env";

let site: BcmsSite | null | undefined;

/** The adapter's access, or null when this build has no project to read from. */
export function bcms(): BcmsSite | null {
  if (site !== undefined) return site;
  const project = projectId();
  // `createBcms` needs a workspace too; the snapshot the fetch step wrote names it.
  const ws = workspace() ?? snapshotWorkspace();
  site = project && ws ? createBcms({ apiUrl: apiUrl(), workspace: ws, projectId: project }) : null;
  return site;
}

export type SectionsResult =
  /** The published sections. */
  | { state: "ready"; fragment: SectionsFragment }
  /** The project has no published page at this slug. */
  | { state: "unpublished" }
  /** No project configured for this build (local / CI). */
  | { state: "unconfigured" };

/**
 * A page's sections for the prerender. A configured build that cannot reach the API FAILS
 * rather than ship a blank Home page that still answers 200: the error names the slug.
 */
export async function loadSections(slug: string, fetchImpl: typeof fetch): Promise<SectionsResult> {
  const client = bcms();
  if (!client) return { state: "unconfigured" };
  const fragment = await client.sections(slug, fetchImpl);
  return fragment ? { state: "ready", fragment } : { state: "unpublished" };
}
