import type { ResolvedSeo } from "@bettercms-ai/sdk/seo";

declare global {
  namespace App {
    /** Every route's `load` returns its resolved head metadata; the root layout renders it. */
    interface PageData {
      seo?: ResolvedSeo;
    }
  }
}

export {};
