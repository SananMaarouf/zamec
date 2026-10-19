import {
  SYSTEM_FONT_STACK,
  fontStack,
  googleFontsHref,
} from "../../lib/google-fonts";

/**
 * Studio-only helpers for rendering the Google Fonts catalog in its own
 * typefaces (the picker and the "Fonts" preview). Nothing here is used by the
 * site — the site gets its fonts from the `<link>` in `Layout.astro`.
 */

const injected = new Set<string>();

/**
 * Inject one family's Google Fonts stylesheet into the Studio document.
 *
 * Deduplicated per family so scrolling the picker up and down does not add a
 * second `<link>`, and the check for an existing element covers a Studio hot
 * reload that rebuilt the module state.
 */
export function loadFontPreview(family: string): void {
  if (typeof document === "undefined" || injected.has(family)) return;

  injected.add(family);

  const href = googleFontsHref([family]);
  if (!href) return;

  const id = `sanity-font-preview-${family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);
}

/**
 * `font-family` value for a stored choice, for Studio previews only.
 * `system`/unset falls back to the same stack the site defaults to.
 */
export function previewFontFamily(value?: string | null): string {
  return fontStack(value) ?? SYSTEM_FONT_STACK;
}
