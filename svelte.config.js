import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/**
 * Fully static: every route is prerendered to its own `index.html` under `build/`, and BetterCMS
 * hosting serves those files. That matters beyond speed — the platform reads each route's HTML
 * for the publish-time static annotation, the sitemap and llms.txt. An SPA shell would hand all
 * three one empty document.
 *
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // No `fallback`: a fallback page is an SPA shell, which is exactly what this starter is not.
    // The 404 page is a real prerendered route (src/routes/404) written to build/404.html.
    adapter: adapter({ pages: "build", assets: "build", strict: true }),
    // Absolute `/_app/…` asset URLs. build/404.html is served at ANY unknown path
    // (`/blog/old/post`), where the default relative `./_app/…` would resolve to nothing and the
    // 404 page would load unstyled.
    paths: { relative: false },
    prerender: {
      // A nav link the CMS points at a page this site does not have (`/pricing`) must not fail
      // the build of every page: warn, and let the host's 404 page answer it. Any other status
      // is a real fault and still fails.
      handleHttpError: ({ status, path, referrer, message }) => {
        if (status === 404) {
          console.warn(`[prerender] 404 ${path}${referrer ? ` (linked from ${referrer})` : ""}`);
          return;
        }
        throw new Error(message);
      },
      // CMS rich text and sections may link to #anchors this build cannot see.
      handleMissingId: "warn",
      // `/blog/[slug]` and `/case-studies/[slug]` list their entries from the snapshot. With an
      // empty snapshot (a fresh clone, CI) there are none, and that is not an error.
      handleUnseenRoutes: "ignore",
    },
  },
};

export default config;
