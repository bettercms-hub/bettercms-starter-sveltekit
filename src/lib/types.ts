/** Shapes the server loads hand to components (shared, so no component imports `$lib/server`). */
import type { ImageValue } from "./bind";

export interface CardField {
  path: string;
  value: string;
}

/** One collection card: only what it renders (never the body), each value with its field path. */
export interface Card {
  id?: string;
  slug: string;
  title: string;
  coverImage: ImageValue | null;
  /** Small line above the card title — a date for posts, the client for case studies. */
  eyebrow: CardField | null;
  blurb: CardField | null;
}
