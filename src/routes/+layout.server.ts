/**
 * The site chrome every page shares — brand, nav, footer, the newsletter form — from the `site`
 * global in the snapshot, so rebranding happens in the CMS, not here.
 */
import { getForms, getSingleton, items, type NavLink, type Site } from "$lib/server/content";
import { brandName } from "$lib/server/seo";
import { apiUrl, liveUrl } from "$lib/server/env";
import type { LayoutServerLoad } from "./$types";

/** Every route is prerendered to static HTML: nothing here runs on a server after the build. */
export const prerender = true;
/** `/about/` → build/about/index.html: one directory per route, like the other starters. */
export const trailingSlash = "always";

const FALLBACK_NAV: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export const load: LayoutServerLoad = () => {
  const site = getSingleton<Site>("site");
  const navLinks = items(site?.navLinks);
  const nav = navLinks.length ? navLinks : FALLBACK_NAV;

  /** The seeded Newsletter form. Absent (or renamed) → the footer just drops the block. */
  const form = getForms().items.find((f) => /newsletter/i.test(f.name ?? ""));
  const email = form?.fields?.find((f) => f.type === "email");

  return {
    chrome: {
      brand: brandName(),
      /** The last link is the CTA — one button, never a duplicate of a link beside it. */
      links: nav.slice(0, -1),
      cta: nav.at(-1) ?? null,
      footerLinks: navLinks,
      tagline: site?.footerTagline ?? "A marketing starter powered by BetterCMS.",
      socials: items(site?.socials),
      siteName: site?.brandName ?? null,
    },
    // Only what the footer form renders — never the whole form definition.
    newsletter: form
      ? {
          action: `${apiUrl()}/api/v1/forms/public/${encodeURIComponent(form.id)}/submissions`,
          emailKey: email?.key ?? "email",
          label: email?.label ?? "Subscribe",
          placeholder: email?.placeholder ?? "you@company.com",
          submitLabel: form.submitLabel || "Subscribe",
          successMessage: form.successMessage ?? "Thanks — you're subscribed.",
          honeypotField: form.honeypotField ?? null,
        }
      : null,
    liveUrl: liveUrl() ?? null,
  };
};
