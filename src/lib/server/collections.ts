/**
 * The Blog and Case-studies indexes: "list a collection as cards", differing only in the model,
 * the copy, and which fields supply the eyebrow and blurb — so they are parameters, not two
 * loaders. A card carries only what it renders (never the body), and each value travels with its
 * field path so the card binds it.
 */
import type { ImageValue } from "$lib/bind";
import type { Card, CardField } from "$lib/types";
import { listEntries } from "./content";

export function cards<T extends { title: string; coverImage?: ImageValue }>(
  model: string,
  eyebrow: keyof T & string,
  blurb: keyof T & string,
): Card[] {
  const pick = (data: T, path: keyof T & string): CardField | null => {
    const value = data[path];
    return typeof value === "string" && value ? { path, value } : null;
  };
  return listEntries<T>(model).map(({ id, slug, data }) => ({
    id,
    slug,
    title: data.title,
    coverImage: data.coverImage?.url ? data.coverImage : null,
    eyebrow: pick(data, eyebrow),
    blurb: pick(data, blurb),
  }));
}
