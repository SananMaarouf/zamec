/**
 * Google Fonts catalog for the CMS-driven typography.
 *
 * Single source of truth, shared by the Sanity Studio (field options + picker
 * previews) and the Astro site (the Google Fonts <link> in `Layout.astro` and
 * the CSS custom properties in `src/lib/theme.ts`), so it must stay free of
 * framework imports.
 *
 * Two names per entry, and both matter:
 *   - `family` — the exact Google Fonts family name. This is what gets stored
 *                in Sanity, written into `font-family` and rendered on screen.
 *   - `query`  — the Google Fonts CSS2 axis parameter, e.g.
 *                `ital,wght@0,400..900;1,400..900`.
 *
 * The `query` strings are generated from Google's own font metadata
 * (`https://fonts.google.com/metadata/fonts` → `axes` / `fonts`) and every one
 * of them was verified against the live CSS2 endpoint (HTTP 200 + @font-face).
 * Do not hand-edit them: the CSS2 API answers **400 for the whole request** as
 * soon as one requested axis value does not exist (e.g. `Bebas Neue:wght@400;700`
 * — that family ships a single weight), which silently drops the font from the
 * page with no build error anywhere.
 *
 * Variable families are requested as a range (`wght@300..700` → one file per
 * style); static families only for the weights this design uses
 * (`PREFERRED_WEIGHTS` below), which keeps the returned stylesheet small. A
 * browser only downloads the weights a page actually paints, so including
 * several costs nothing at runtime.
 *
 * To add a font: add it to the array, get `query` from the metadata above, and
 * re-run the check (see README → "Theme: fonts from Google Fonts").
 */

/** Sentinel stored in Sanity for "don't load a webfont, use the CSS default". */
export const SYSTEM_FONT = "system";

/**
 * Default body stack when no webfont is chosen — same value as `--font-sans` in
 * `src/styles/global.css`, so an unconfigured site renders exactly as before.
 * Kept in sync by hand: CSS cannot import from TypeScript.
 */
export const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const FONT_CATEGORIES = [
  "Sans serif",
  "Serif",
  "Display",
  "Monospace",
  "Handwriting",
] as const;

export type FontCategory = (typeof FONT_CATEGORIES)[number];

export interface GoogleFont {
  /** Exact Google Fonts family name (`font-family`, stored in Sanity). */
  family: string;
  /** Grouping shown in the Studio picker. */
  category: FontCategory;
  /** Google Fonts CSS2 axis parameter, without the `family=` part. */
  query: string;
  /** Stack used while the webfont loads, and when it fails to load. */
  stack: string;
}

export const GOOGLE_FONTS: readonly GoogleFont[] = [
  {
    family: "Assistant",
    category: "Sans serif",
    query: "wght@200..800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "DM Sans",
    category: "Sans serif",
    query: "ital,wght@0,100..1000;1,100..1000",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Figtree",
    category: "Sans serif",
    query: "ital,wght@0,300..900;1,300..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Geist",
    category: "Sans serif",
    query: "ital,wght@0,100..900;1,100..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Instrument Sans",
    category: "Sans serif",
    query: "ital,wght@0,400..700;1,400..700",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Inter",
    category: "Sans serif",
    query: "ital,wght@0,100..900;1,100..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Karla",
    category: "Sans serif",
    query: "ital,wght@0,200..800;1,200..800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Lato",
    category: "Sans serif",
    query: "ital,wght@0,300;0,400;0,700;1,300;1,400;1,700",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Manrope",
    category: "Sans serif",
    query: "wght@200..800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Montserrat",
    category: "Sans serif",
    query: "ital,wght@0,100..900;1,100..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Nunito",
    category: "Sans serif",
    query: "ital,wght@0,200..1000;1,200..1000",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Open Sans",
    category: "Sans serif",
    query: "ital,wght@0,300..800;1,300..800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Outfit",
    category: "Sans serif",
    query: "wght@100..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Plus Jakarta Sans",
    category: "Sans serif",
    query: "ital,wght@0,200..800;1,200..800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Poppins",
    category: "Sans serif",
    query:
      "ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Rubik",
    category: "Sans serif",
    query: "ital,wght@0,300..900;1,300..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Source Sans 3",
    category: "Sans serif",
    query: "ital,wght@0,200..900;1,200..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Space Grotesk",
    category: "Sans serif",
    query: "wght@300..700",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Ubuntu",
    category: "Sans serif",
    query: "ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Work Sans",
    category: "Sans serif",
    query: "ital,wght@0,100..900;1,100..900",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Cormorant Garamond",
    category: "Serif",
    query: "ital,wght@0,300..700;1,300..700",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Crimson Pro",
    category: "Serif",
    query: "ital,wght@0,200..900;1,200..900",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "DM Serif Display",
    category: "Serif",
    query: "ital,wght@0,400;1,400",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "EB Garamond",
    category: "Serif",
    query: "ital,wght@0,400..800;1,400..800",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Fraunces",
    category: "Serif",
    query: "ital,wght@0,100..900;1,100..900",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Instrument Serif",
    category: "Serif",
    query: "ital,wght@0,400;1,400",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Libre Baskerville",
    category: "Serif",
    query: "ital,wght@0,400..700;1,400..700",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Lora",
    category: "Serif",
    query: "ital,wght@0,400..700;1,400..700",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Merriweather",
    category: "Serif",
    query: "ital,wght@0,300..900;1,300..900",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Newsreader",
    category: "Serif",
    query: "ital,wght@0,200..800;1,200..800",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Playfair Display",
    category: "Serif",
    query: "ital,wght@0,400..900;1,400..900",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Roboto Slab",
    category: "Serif",
    query: "wght@100..900",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Source Serif 4",
    category: "Serif",
    query: "ital,wght@0,200..900;1,200..900",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Spectral",
    category: "Serif",
    query:
      "ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    family: "Anton",
    category: "Display",
    query: "wght@400",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Archivo Black",
    category: "Display",
    query: "wght@400",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Bebas Neue",
    category: "Display",
    query: "wght@400",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Bricolage Grotesque",
    category: "Display",
    query: "wght@200..800",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Oswald",
    category: "Display",
    query: "wght@200..700",
    stack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    family: "Fira Code",
    category: "Monospace",
    query: "wght@300..700",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    family: "IBM Plex Mono",
    category: "Monospace",
    query:
      "ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    family: "JetBrains Mono",
    category: "Monospace",
    query: "ital,wght@0,100..800;1,100..800",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    family: "Roboto Mono",
    category: "Monospace",
    query: "ital,wght@0,100..700;1,100..700",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    family: "Source Code Pro",
    category: "Monospace",
    query: "ital,wght@0,200..900;1,200..900",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    family: "Space Mono",
    category: "Monospace",
    query: "ital,wght@0,400;0,700;1,400;1,700",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    family: "Caveat",
    category: "Handwriting",
    query: "wght@400..700",
    stack: '"Segoe Script", "Brush Script MT", cursive',
  },
  {
    family: "Dancing Script",
    category: "Handwriting",
    query: "wght@400..700",
    stack: '"Segoe Script", "Brush Script MT", cursive',
  },
  {
    family: "Great Vibes",
    category: "Handwriting",
    query: "wght@400",
    stack: '"Segoe Script", "Brush Script MT", cursive',
  },
  {
    family: "Pacifico",
    category: "Handwriting",
    query: "wght@400",
    stack: '"Segoe Script", "Brush Script MT", cursive',
  },
];

/** Static families are requested for these weights only (see the header note). */
export const PREFERRED_WEIGHTS = [300, 400, 500, 600, 700, 800] as const;

const BY_NAME = new Map(
  GOOGLE_FONTS.map((font) => [font.family.toLowerCase(), font]),
);

export const DEFAULT_HEADING_FONT = SYSTEM_FONT;
export const DEFAULT_BODY_FONT = SYSTEM_FONT;

/** Choices for `options.list` / the picker: "use the CSS default" + catalog. */
export const FONT_OPTIONS: { title: string; value: string }[] = [
  { title: "Site default — no webfont", value: SYSTEM_FONT },
  ...GOOGLE_FONTS.map((font) => ({ title: font.family, value: font.family })),
];

/** Look up a stored value. Case-insensitive; `null` when unknown/unset. */
export const googleFont = (value?: string | null): GoogleFont | null =>
  BY_NAME.get((value ?? "").trim().toLowerCase()) ?? null;

/** True when the value is something the site can render: a catalog font or "system". */
export const isFontChoice = (value?: string | null): boolean =>
  value === SYSTEM_FONT || googleFont(value) !== null;

/**
 * CSS value for a single font choice, or `null` for "system"/unset — the caller
 * then leaves the declaration out and the stylesheet default applies.
 */
export const fontStack = (value?: string | null): string | null => {
  const font = googleFont(value);
  return font ? `"${font.family}", ${font.stack}` : null;
};

/** `Playfair Display` + `ital,wght@…` → `family=Playfair+Display:ital,wght@…`. */
const familyParam = ({ family, query }: GoogleFont): string => {
  const name = family
    .replace(/ /g, "+")
    .replace(/[^A-Za-z0-9+._-]/g, (char) => encodeURIComponent(char));
  return query ? `family=${name}:${query}` : `family=${name}`;
};

/**
 * Stylesheet URL loading every distinct webfont among `values`, or `null` when
 * nothing but "system" was chosen (in which case no request is made at all).
 *
 * One request for both fonts on purpose: two <link>s would be two round trips.
 */
export function googleFontsHref(
  values: readonly (string | null | undefined)[],
): string | null {
  const families = [
    ...new Set(
      values
        .map((value) => googleFont(value))
        .filter((font): font is GoogleFont => font !== null),
    ),
  ];

  if (families.length === 0) return null;

  const params = families.map(familyParam).join("&");

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
