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
  /**
   * Label in front of the year a work was made ("Produced: 2024"), matching the
   * studio field it comes from, so it reads as the pair to `exhibitedYear`.
   * The colon belongs to the label, so the markup never has to add punctuation.
   */
  producedYear: { en: "Produced:", nb: "Produsert:" },
  /**
   * Label in front of the exhibition year ("Exhibited: 2025" / "Utstilt: 2025"),
   * so the two years are told apart.
   */
  exhibitedYear: { en: "Exhibited:", nb: "Utstilt:" },
  /** Label in front of a work's physical size ("Size: 97 × 233 × 86 cm"). */
  size: { en: "Size:", nb: "Mål:" },
  /** Accessible name of the button that scrolls the post's image strip back. */
  galleryScrollPrevious: { en: "Previous images", nb: "Forrige bilder" },
  /** Accessible name of the button that scrolls the post's image strip on. */
  galleryScrollNext: { en: "Next images", nb: "Neste bilder" },
  /** Headline of the 404 page. */
  notFoundTitle: { en: "This page isn’t here", nb: "Denne siden finnes ikke" },
  /** Body copy of the 404 page, under the headline. */
  notFoundMessage: {
    en: "The link may be out of date, or the page may have moved. Everything I’ve written is on the front page.",
    nb: "Lenken kan være utdatert, eller siden kan ha flyttet. Alt jeg har skrevet ligger på forsiden.",
  },
  /** Primary action on the 404 page: back to the front page. */
  notFoundHome: { en: "Front page", nb: "Forsiden" },
  /** Nav label of the contact page (a template-owned route, not CMS content). */
  contactNav: { en: "Contact", nb: "Kontakt" },
  /** Headline of the contact page. */
  contactTitle: { en: "Contact me", nb: "Kontakt meg" },
  /** Heading of the "other ways to get in touch" column; CMS value wins. */
  contactWaysTitle: {
    en: "Other ways to reach me",
    nb: "Andre måter å ta kontakt",
  },
  /** Body copy at the top of the contact page, above the form. */
  contactIntro: {
    en: "Questions about a piece, a commission or an order? Send a message below and I’ll reply as soon as I can.",
    nb: "Spørsmål om et verk, et oppdrag eller en bestilling? Send en melding nedenfor, så svarer jeg så fort jeg kan.",
  },
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
