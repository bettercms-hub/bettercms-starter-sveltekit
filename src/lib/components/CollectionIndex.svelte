<script lang="ts">
  /**
   * A collection as cards. Each card declares its entry (`entryAttrs`) and every value on it
   * declares its field (`entryField`), so the editor binds the card to the right entry even
   * with many on one page — no guessing from the rendered text.
   */
  import { entryAttrs, entryField } from "@bettercms-ai/sveltekit";
  import { img } from "$lib/bind";
  import type { Card } from "$lib/types";

  let {
    base,
    heading,
    intro,
    empty,
    cards,
  }: { base: string; heading: string; intro: string; empty: string; cards: Card[] } = $props();
</script>

<main id="main" class="container">
  <header class="page-head">
    <h1>{heading}</h1>
    <p>{intro}</p>
  </header>
  {#if cards.length === 0}
    <p class="empty-note">{empty}</p>
  {:else}
    <div class="card-grid">
      {#each cards as card (card.slug)}
        <article class="card" {...entryAttrs(card)}>
          <a href={`${base}/${card.slug}/`}>
            {#if card.coverImage}
              <img
                class="thumb"
                {...img(card.coverImage, { sizes: "(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 100vw" })}
                {...entryField(card, "coverImage")}
              />
            {/if}
            <div class="body">
              {#if card.eyebrow}
                <span class="eyebrow" {...entryField(card, card.eyebrow.path)}>{card.eyebrow.value}</span>
              {/if}
              <h3 {...entryField(card, "title")}>{card.title}</h3>
              {#if card.blurb}
                <p {...entryField(card, card.blurb.path)}>{card.blurb.value}</p>
              {/if}
            </div>
          </a>
        </article>
      {/each}
    </div>
  {/if}
</main>
