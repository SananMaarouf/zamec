import {
  DEFAULT_DARK_PALETTE,
  DEFAULT_LIGHT_PALETTE,
  DEFAULT_RADIUS,
  THEME_TOKENS,
  type PaletteValues,
} from "@/lib/theme-tokens";
import { fontStack, googleFontsHref } from "@/lib/google-fonts";

/** `theme.fonts` — the two Google Fonts choices (see `src/lib/google-fonts.ts`). */
export interface ThemeFonts {
  /** Font for headings; `system` (the default) follows the body font. */
  heading?: string | null;
  /** Font for everything else. `system` = the built-in sans stack. */
  body?: string | null;
}

/** Shape of the `theme` document as returned by `THEME_QUERY`. */
export interface ThemeDocument {
  radius?: string | null;
  light?: PaletteValues | null;
  dark?: PaletteValues | null;
  fonts?: ThemeFonts | null;
}

/** A single color as stored by @sanity/color-input. */
interface SanityColor {
  hex?: string;
  alpha?: number;
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * Sanity stores colors as objects (`{ hex, alpha, hsl, hsv, rgb }`). Accept a
 * plain string too so the schema can be swapped for a simpler input later.
 */
function toCssColor(value: unknown): string | null {
  let hex: string | undefined;
  let alpha: number | undefined;

  if (typeof value === "string") {
    hex = value.trim();
  } else if (value && typeof value === "object") {
    const color = value as SanityColor;
    hex = typeof color.hex === "string" ? color.hex.trim() : undefined;
    alpha = typeof color.alpha === "number" ? color.alpha : undefined;
  }

  if (!hex || !HEX_RE.test(hex)) return null;

  // Append alpha as 8-digit hex notation when a color is translucent.
  if (typeof alpha === "number" && alpha < 1) {
    const rgb = hex.length === 4 ? expandShorthand(hex) : hex.slice(0, 7);
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
      .toString(16)
      .padStart(2, "0");
    return `${rgb}${a}`.toLowerCase();
  }

  return hex.toLowerCase();
}

/** `#abc` -> `#aabbcc` (alpha is always appended as a full 6-digit base). */
function expandShorthand(hex: string): string {
  const [r, g, b] = hex.slice(1, 4).split("");
  return `#${r}${r}${g}${g}${b}${b}`;
}

function radiusToCss(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  // Keep it to safe length units / zero, so a typo cannot inject arbitrary CSS.
  return /^(0|0?\.\d+(rem|em|px)|[1-9]\d*(rem|em|px))$/.test(trimmed)
    ? trimmed
    : null;
}

/**
 * Turn one palette (+ radius) into CSS custom property declarations.
 * Every known token is always emitted: values missing from the CMS fall back to
 * the starter palette, so a half-filled palette can never produce a broken
 * (e.g. transparent) site.
 */
function declarations(
  palette: PaletteValues | null | undefined,
  defaults: PaletteValues,
  radius: string | null,
): string {
  const lines = THEME_TOKENS.map(({ name, field }) => {
    const value =
      toCssColor(palette?.[name] ?? palette?.[field]) ??
      toCssColor(defaults[name])!;
    return `  --${name}: ${value};`;
  });

  if (radius) lines.push(`  --radius: ${radius};`);

  return lines.join("\n");
}

/**
 * Font declarations for the `<style>` payload.
 *
 * A `system`/unset choice emits nothing on purpose: `src/styles/global.css`
 * already defaults `--font-body` to the built-in sans stack and `--font-heading`
 * to `var(--font-body)`, so "heading follows body" keeps working without the
 * generator having to know the stacks. Only families that are actually chosen
 * are emitted, so the document stays readable.
 *
 * Unlike the colors, fonts are not per-mode: they go into the light block only.
 * `html.dark` does not redeclare them, and because both selectors match the same
 * element the light declaration keeps applying in dark mode.
 */
function fontDeclarations(fonts: ThemeFonts | null | undefined): string[] {
  const lines: string[] = [];
  const body = fontStack(fonts?.body);
  const heading = fontStack(fonts?.heading);

  if (body) lines.push(`  --font-body: ${body};`);
  if (heading) lines.push(`  --font-heading: ${heading};`);

  return lines;
}

/**
 * Build the `<style>` payload that overrides the palette baked into
 * `src/styles/global.css`.
 *
 * The `html:` prefix on both selectors raises specificity to (0,1,1) so these
 * values win over the (0,1,0) `:root` / `.dark` defaults in global.css no
 * matter where the stylesheet lands in the document — Astro injects imported
 * CSS at build time but Vite injects it at runtime during `astro dev`, so
 * relying on source order would work in one mode and break in the other.
 *
 * Returns an empty string when no theme document exists, in which case the
 * CSS defaults stay in charge.
 */
export function themeToCss(theme: ThemeDocument | null | undefined): string {
  if (!theme) return "";

  const light = theme.light ?? null;
  const dark = theme.dark ?? null;
  const fonts = fontDeclarations(theme.fonts);
  const hasAnyColor =
    Object.values(light ?? {}).some(Boolean) ||
    Object.values(dark ?? {}).some(Boolean);

  if (!hasAnyColor && fonts.length === 0) return "";

  const radius = radiusToCss(theme.radius) ?? radiusToCss(DEFAULT_RADIUS);

  // Fonts are mode-independent, so they are only appended to the light block.
  const rootBlock = [
    "html:root {",
    declarations(light, DEFAULT_LIGHT_PALETTE, radius),
    ...fonts,
    "}",
  ].join("\n");

  return [
    '/* Generated from the Sanity "Theme" document — edit colors and fonts in the Studio, not here. */',
    rootBlock,
    `html.dark {\n${declarations(dark, DEFAULT_DARK_PALETTE, radius)}\n}`,
  ].join("\n");
}

/**
 * Google Fonts stylesheet URL for the theme's font choices, or `null` when
 * neither heading nor body uses a webfont (then `Layout.astro` renders no
 * `<link>` at all and the CSS defaults are the only fonts in play).
 */
export function themeFontsHref(
  theme: ThemeDocument | null | undefined,
): string | null {
  return googleFontsHref([theme?.fonts?.heading, theme?.fonts?.body]);
}
