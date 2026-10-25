/**
 * Build-time settings, read from `process.env` when a route prerenders.
 *
 * Not `$env/dynamic/*` (SvelteKit 2 refuses it during prerendering) and not `$env/static/*`
 * (importing a variable that is not set fails the build, and a fresh clone sets none).
 * vite.config.ts copies a local `.env` into `process.env`; on BetterCMS hosting the deploy sets
 * them. Read lazily, at call time, so nothing is frozen at import.
 */
const read = (name: string): string | undefined => {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
};

/** The API the browser posts forms to, and the build reads sections from. */
export const apiUrl = (): string => (read("PUBLIC_BCMS_API_URL") ?? "https://api.bettercms.ai").replace(/\/+$/, "");
export const workspace = (): string | undefined => read("PUBLIC_BCMS_WORKSPACE");
export const projectId = (): string | undefined => read("PUBLIC_BCMS_PROJECT_ID");
/** Absolute origin for canonical + og:url. */
export const siteUrl = (): string | undefined => read("PUBLIC_SITE_URL");
/** Optional live stream for `startBcmsLive({ src })` (a content:read key rides in it). */
export const liveUrl = (): string | undefined => read("PUBLIC_BCMS_LIVE_URL");
