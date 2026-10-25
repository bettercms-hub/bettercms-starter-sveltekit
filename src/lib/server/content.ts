import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { DeliveryForm } from "@bettercms-ai/sdk";

/**
 * Read the deploy Action's build snapshot (`bcms-content.json`): entries grouped under
 * `collections` by model slug (depth-1 hydrated), plus published pages and forms. A static
 * build resolves everything from here — no API key needed at build time. Absent file → empty
 * (e.g. before `npm run fetch-content` locally).
 *
 * Server-only (`$lib/server`): it runs while the build prerenders, never in the browser. Each
 * route's `load` hands its component exactly the slice it renders. Same field shapes and helper
 * names as the Astro and React starters, on purpose, so the four stay diffable.
 */
export interface SnapshotPage {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}
/**
 * One delivery entry. `id` is what the editor binds by (`entryAttrs` / `entryField`): every
 * snapshot the fetch script or the deploy Action writes carries it. An entry without one (a
 * hand-written or very old snapshot) renders unbound rather than failing the build.
 */
export type SnapshotEntry<T> = { id?: string; slug: string; data: T };
interface Snapshot {
  workspace?: string;
  collections?: Record<string, SnapshotEntry<unknown>[]>;
  pages?: SnapshotPage[];
  forms?: DeliveryForm[];
  turnstileSiteKey?: string | null;
}

let cache: Snapshot | null = null;
function snap(): Snapshot {
  if (cache) return cache;
  try {
    cache = JSON.parse(readFileSync(resolve(process.cwd(), "bcms-content.json"), "utf8")) as Snapshot;
  } catch {
    cache = {};
  }
  return cache;
}

export const snapshotWorkspace = (): string | undefined => snap().workspace;
export const getPage = (slug: string): SnapshotPage | undefined =>
  (snap().pages ?? []).find((p) => p.slug === slug);
export const getForms = (): { items: DeliveryForm[]; turnstileSiteKey: string | null } => ({
  items: snap().forms ?? [],
  turnstileSiteKey: snap().turnstileSiteKey ?? null,
});

export const listEntries = <T>(model: string): SnapshotEntry<T>[] =>
  (snap().collections?.[model] ?? []) as SnapshotEntry<T>[];
export const getEntry = <T>(model: string, slug: string): SnapshotEntry<T> | undefined =>
  listEntries<T>(model).find((e) => e.slug === slug);

/** Singleton models (site/home/…) have exactly one entry — return its data. */
export const getSingleton = <T>(model: string): T | undefined => listEntries<T>(model)[0]?.data;

// ── Site globals (the `site` singleton: brand/nav/footer chrome, editable in the CMS) ──────────
/** Repeatable/zoned-array fields arrive as `{ repeatable: [...] }` at delivery depth ≥ 1. */
export type Repeatable<T> = { repeatable?: T[] };
export type NavLink = { label: string; href: string };
export type Social = { label: string; href: string };
/** The `site` global — brand + chrome + SEO defaults, all editable in the CMS.
 *  Every field here is seeded by the template and rendered somewhere; if you add one,
 *  render it, and if you stop rendering one, drop it from the seed. */
export type Site = {
  brandName?: string;
  navLinks?: Repeatable<NavLink>;
  footerTagline?: string;
  socials?: Repeatable<Social>;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: Image;
  twitterHandle?: string;
};
/** Unwrap a repeatable field to a plain list. */
export const items = <T>(field?: Repeatable<T>): T[] => (Array.isArray(field?.repeatable) ? field.repeatable : []);

// Field shapes seeded by the Marketing Starter template.
export type Image = { url: string; alt?: string; altText?: string };
export type RichText = { html: string };
export type Author = { name: string; role?: string; bio?: string; avatar?: Image };
/** A depth-1 reference: the hydrated author entry (with its own `id`), or a bare id/slug. */
export type AuthorRef = { id?: string; slug: string; data?: Author } | string;
export type BlogPostFields = {
  title: string;
  excerpt?: string;
  coverImage?: Image;
  body?: RichText;
  author?: AuthorRef;
  publishedDate?: string;
};
export type CaseStudyFields = {
  title: string;
  client?: string;
  summary?: string;
  coverImage?: Image;
  body?: RichText;
};
export const authorData = (a: BlogPostFields["author"]): Author | null =>
  !a || typeof a === "string" ? null : a.data ?? null;
/** The hydrated author as an entry of its own, so its fields bind to the AUTHOR, not the post. */
export const authorEntry = (a: BlogPostFields["author"]): SnapshotEntry<Author> | null =>
  !a || typeof a === "string" || !a.data ? null : { id: a.id, slug: a.slug, data: a.data };
