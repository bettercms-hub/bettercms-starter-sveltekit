# BetterCMS Marketing Starter (SvelteKit)

The **SvelteKit** starter for the BetterCMS *Marketing Starter* template: a polished, fully static
marketing site rendered from a BetterCMS project. SvelteKit 2, Svelte 5, TypeScript, Tailwind v4.

- **Home / About / Contact** — CMS pages, rendered from the sections BetterCMS draws for them
  (the sections fragment). The Contact page carries a real **form block**, so submissions land
  in your project's inbox.
- **Blog** and **Case Studies** — content collections, listed and rendered as static pages with
  this site's own Svelte markup, every field bound for click-to-edit.

Create a site from this template in the BetterCMS dashboard (pick *Marketing Starter* →
*SvelteKit*) and it's deployed and wired automatically. Or run it locally below.

## The slug contract

This site reads these slugs from the CMS — they match the template's seeded content. Keep them in
sync if you rename models/pages (and mirror changes in `bettercms-starter`,
`bettercms-starter-astro` and `bettercms-starter-react`, the Next.js, Astro and React twins):

| Kind  | Slugs |
|-------|-------|
| Pages | `home`, `about`, `contact` |
| Models| `blog-post`, `case-study`, `author` |

## Run locally

```bash
cp .env.example .env            # set PUBLIC_BCMS_WORKSPACE + BCMS_API_KEY (content:read)
npm install
npm run fetch-content           # writes bcms-content.json (pages, forms, entries)
npm run dev                     # http://localhost:5173
```

`npm run fetch-content` reads its settings from the environment (`export` them, or
`node --env-file=.env scripts/fetch-content.mjs`). `npm run check` runs svelte-check.

## Prerendered, not an SPA

`npm run build` prerenders every route with `@sveltejs/adapter-static` to its own `index.html`
under `build/` (`build/about/index.html`, `build/blog/<slug>/index.html`, …) plus
`build/404.html`, and hydrates it in the browser. That matters beyond page speed: BetterCMS
reads the deployed HTML per route for the publish-time static annotation, the sitemap,
`llms.txt`, and AEO. An SPA shell gives all four one empty document.

Routes with dynamic segments (`/blog/[slug]`, `/case-studies/[slug]`) export an `entries()`
that lists their slugs from the content snapshot. A new post appears as a new HTML file on the
next build; publishing in the CMS triggers that build automatically.

## Where content comes from

- **Collections, chrome, SEO** — from `bcms-content.json`, the build snapshot: no API key at
  build time, no runtime fetch. It's gitignored and read with `readFileSync` in
  `src/lib/server/content.ts` (absent file → empty). Regenerate it with `npm run fetch-content`
  after editing content. On BetterCMS hosting the deploy Action writes it before each build,
  then serves the static `build/`.
- **Home / About / Contact** — the **sections fragment**: at build time each page's `load` asks
  the platform for its sections (`createBcms` + `bcms.sections(slug, fetch)` from
  `@bettercms-ai/sveltekit`) and renders them with `{@html sectionsMarkup(…)}` inside
  `use:bcmsSections`. That is the hosted renderer's own markup, scoped stylesheet and runtime,
  so forms, sliders and tabs behave exactly as on a BetterCMS-hosted site. It needs
  `PUBLIC_BCMS_PROJECT_ID` (the platform sets it, with `PUBLIC_BCMS_API_URL` and
  `PUBLIC_BCMS_WORKSPACE`). Without a project the page renders its title only and the build makes
  no network call; with one, an unreachable API fails the build rather than ship a blank page.

The sections run small inline scripts, so a Content-Security-Policy must allow inline scripts
(see `static/_headers`). Build-time settings are read from `process.env` in `src/lib/server`
(SvelteKit 2 forbids `$env/dynamic/*` while prerendering); `vite.config.ts` loads a local `.env`
into it.

## Visual editing

Collection markup is the site's own, bound with the adapter's helpers:

```svelte
<article class="article" {...entryAttrs(post)}>
  <h1 data-bcms-field="title" {...entryField(post, "title")}>{f.title}</h1>
  <img {...img(f.coverImage, { sizes: "100vw", path: "coverImage" })} {...entryField(post, "coverImage")} />
  <div class="prose" data-bcms-field="body" data-bcms-kind="richtext" {...entryField(post, "body")}>{@html rich(f.body)}</div>
</article>
```

`entryAttrs` declares the entry and `entryField` each field's absolute `entry:<id>:<path>`
address, so the editor binds every card and article without guessing from rendered text; on an
entry's own page the elements also carry the page-relative `data-bcms-field` the Astro and React
starters emit. `img()` (`src/lib/bind.ts`) wraps the adapter's `imageAttrs` (transform URL,
srcset, alt, focal point) for BetterCMS media. If you render a field's value, bind it.

The root layout starts `startBcmsLive({ refresh: invalidateAll })`, which answers the editor
canvas's re-render request (and, with `PUBLIC_BCMS_LIVE_URL`, re-renders on publish). The
`<meta name="generator" content="BetterCMS">` tag lives in `src/app.html`: a server app gets it
from `bcmsHandle`, which a static build never runs.
