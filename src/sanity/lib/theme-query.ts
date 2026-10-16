import { loadQuery } from "@/sanity/lib/load-query";
import { THEME_QUERY } from "@/sanity/lib/queries";
import type { ThemeDocument } from "@/lib/theme";

/**
 * Loader for the `theme` singleton.
 *
 * Production build: the shared base layout runs once per page and the page count
 * is routes × locales, while the palette is language-neutral and identical for
 * every locale — so the GROQ round-trip is done once per build instead of once
 * per rendered page. The promise (not the result) is cached, so concurrent first
 * requests share a single in-flight fetch. Worth it at routes × locales × N.
 *
 * Dev (`astro dev`): the cache is deliberately bypassed. Module state survives
 * across requests for the life of the dev server, so a cached promise would pin
 * the palette fetched on the first request and a color published in the Studio
 * would only appear after restarting the server. Re-querying every request makes
 * a plain browser refresh pick up the change.
 */
let cached: Promise<{ data: ThemeDocument | null }> | null = null;

export const loadTheme = () =>
  import.meta.env.DEV
    ? loadQuery<ThemeDocument | null>({ query: THEME_QUERY })
    : (cached ??= loadQuery<ThemeDocument | null>({ query: THEME_QUERY }));
