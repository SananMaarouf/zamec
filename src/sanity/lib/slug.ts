/**
 * Slug helpers shared by the schema `source` option and the auto-filling
 * slug input. Slugs are always derived from the English title so a Norwegian
 * title never produces a URL with `æ`/`ø`/`å` in it.
 */

/** A member of a `sanity-plugin-internationalized-array` value. */
export type I18nStringItem = {
  _key?: string;
  language?: string;
  value?: string | null;
};

const isFilled = (item?: I18nStringItem): boolean =>
  Boolean(item?.value && item.value.trim());

/** English value, or the first filled language as a fallback. */
export const englishText = (items?: I18nStringItem[] | null): string => {
  if (!Array.isArray(items)) return "";
  // v5 of the i18n plugin stores the language id in `language`; older data
  // and manually added rows only have `_key`.
  const english = items.find(
    (item) => isFilled(item) && (item?.language ?? item?._key) === "en"
  );
  const first = items.find(isFilled);
  return (english ?? first)?.value?.trim() ?? "";
};

const TRANSLIT: Record<string, string> = {
  æ: "ae",
  ø: "o",
  å: "a",
  ä: "a",
  ö: "o",
  ü: "u",
  ß: "ss",
};

/** URL-safe slug in the same shape Sanity's own "Generate" button produces. */
export const slugify = (input: string, maxLength = 96): string =>
  input
    .replace(/[æøåäöüß]/gi, (char) => TRANSLIT[char.toLowerCase()] ?? char)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
