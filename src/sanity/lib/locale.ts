// Central place for locale config. Adding a new locale requires updating:
//   1. astro.config.mjs `i18n.locales`
//   2. sanity.config.ts internationalizedArray `languages`
//   3. LOCALES below
export const LOCALES = ["en", "nb"] as const;
export const DEFAULT_LOCALE = "en" as const;

export type Locale = (typeof LOCALES)[number];

export const NON_DEFAULT_LOCALES = LOCALES.filter(
  (l) => l !== DEFAULT_LOCALE
) as Exclude<Locale, typeof DEFAULT_LOCALE>[];

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(input: string | undefined): Locale {
  return isLocale(input) ? input : DEFAULT_LOCALE;
}

// Build a path like:
//   default locale + "/foo/bar"   → "/foo/bar"
//   non-default + "/foo/bar"      → "/nb/foo/bar"
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === "/" ? "/" : clean;
  return clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
}
