import { DEFAULT_LOCALE, type Locale } from "@/sanity/lib/locale";

// UI chrome strings (labels and messages the templates render themselves, as
// opposed to CMS content). Every locale in `LOCALES` must have an entry for
// every key — TypeScript enforces it, so adding a locale cannot silently ship
// English text on the new language's pages.
//
// Use this instead of hardcoding a visible label, and add a key here as soon as
// a component needs a new one.
const UI_STRINGS = {
  /** Label of the link to the previous post (newer) at the bottom of a post. */
  previousPost: { en: "Previous post", nb: "Forrige innlegg" },
  /** Label of the link to the next post (older) at the bottom of a post. */
  nextPost: { en: "Next post", nb: "Neste innlegg" },
  /** Shown in the previous-post slot when the post is the first in the list. */
  allPosts: { en: "All posts", nb: "Alle innlegg" },
  /** Accessible name of the previous/next link row at the bottom of a post. */
  postNavigation: { en: "Post navigation", nb: "Innleggsnavigasjon" },
  /** Accessible name of the button that scrolls the post's image strip back. */
  galleryScrollPrevious: { en: "Previous images", nb: "Forrige bilder" },
  /** Accessible name of the button that scrolls the post's image strip on. */
  galleryScrollNext: { en: "Next images", nb: "Neste bilder" },
} as const satisfies Record<string, Record<Locale, string>>;

export type UIStringKey = keyof typeof UI_STRINGS;

/**
 * Resolve a UI string for a locale, falling back to the default locale for an
 * unknown one (e.g. a stray "en-US").
 */
export function uiText(key: UIStringKey, locale: Locale | string): string {
  const entry: Record<string, string> = UI_STRINGS[key];
  return entry[locale] ?? entry[DEFAULT_LOCALE];
}
