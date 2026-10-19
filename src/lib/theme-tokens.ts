/**
 * Single source of truth for the site's color tokens.
 *
 * Shared by the Sanity Studio (schema defaults) and the Astro site (CSS
 * variable generation), so it must stay free of framework imports.
 *
 * Each token has two names:
 *   - `name`  — the CSS custom property, e.g. `card-foreground` → `--card-foreground`
 *   - `field` — the Sanity field name, e.g. `cardForeground` (Sanity field names
 *               cannot contain hyphens)
 *
 * The `DEFAULT_*_PALETTE` hex values are exact sRGB equivalents of the oklch
 * values that used to live in `src/styles/global.css` (converted with
 * browser-style chroma-reduced gamut mapping), so the CMS defaults look
 * identical to the original hand-written CSS.
 */

export const THEME_GROUPS = [
  "Base",
  "Surfaces",
  "Buttons & accents",
  "Subtle UI",
  "Status",
  "Advanced",
] as const;

export type ThemeGroup = (typeof THEME_GROUPS)[number];

/**
 * Collapsible group for tokens most projects never touch (charts, sidebar,
 * gradients, the alternate muted pair). Kept out of the way in the Studio.
 */
export const ADVANCED_GROUP: ThemeGroup = "Advanced";

interface ThemeTokenDef {
  /** CSS custom property name, without the leading `--`. */
  name: string;
  label: string;
  /** Client-facing explanation of where the token shows up. */
  hint: string;
  group: ThemeGroup;
}

export interface ThemeToken extends ThemeTokenDef {
  /** Sanity field name (camelCase, derived from `name`). */
  field: string;
}

const token = (
  name: string,
  label: string,
  hint: string,
  group: ThemeGroup,
): ThemeTokenDef => ({ name, label, hint, group });

const TOKEN_DEFS: readonly ThemeTokenDef[] = [
  token("background", "Background", "Page background.", "Base"),
  token("foreground", "Text", "Default body text color.", "Base"),

  token("card", "Card background", "Cards, panels and content blocks.", "Surfaces"),
  token("card-foreground", "Card text", "Text inside cards.", "Surfaces"),
  token("popover", "Menu background", "Dropdowns, menus, sheets.", "Surfaces"),
  token(
    "popover-foreground",
    "Menu text",
    "Text inside dropdowns and menus.",
    "Surfaces",
  ),

  token(
    "primary",
    "Primary",
    "Main brand color: buttons, links, highlights.",
    "Buttons & accents",
  ),
  token(
    "primary-foreground",
    "Primary text",
    "Text and icons on top of the primary color.",
    "Buttons & accents",
  ),
  token(
    "secondary",
    "Secondary",
    "Secondary buttons and surfaces.",
    "Buttons & accents",
  ),
  token(
    "secondary-foreground",
    "Secondary text",
    "Text on secondary surfaces.",
    "Buttons & accents",
  ),
  token(
    "accent",
    "Accent / hover",
    "Hover and active backgrounds (nav items, list rows).",
    "Buttons & accents",
  ),
  token(
    "accent-foreground",
    "Accent text",
    "Text on accent backgrounds.",
    "Buttons & accents",
  ),

  token(
    "muted",
    "Muted background",
    "Subtle backgrounds: badges, code blocks, placeholders.",
    "Subtle UI",
  ),
  token(
    "muted-foreground",
    "Muted text",
    "Secondary text: captions, dates, hints.",
    "Subtle UI",
  ),
  token("border", "Border", "Borders and dividers.", "Subtle UI"),
  token("input", "Input border", "Borders of form fields.", "Subtle UI"),
  token("ring", "Focus ring", "Outline shown on focused elements.", "Subtle UI"),

  token("destructive", "Danger", "Error and destructive actions.", "Status"),
  token(
    "destructive-foreground",
    "Danger text",
    "Text on top of the danger color.",
    "Status",
  ),

  /* Advanced — see ADVANCED_GROUP. Collapsed in the Studio unless expanded. */

  token("chart-1", "Chart 1", "Data-visualisation palette, slot 1.", ADVANCED_GROUP),
  token("chart-2", "Chart 2", "Data-visualisation palette, slot 2.", ADVANCED_GROUP),
  token("chart-3", "Chart 3", "Data-visualisation palette, slot 3.", ADVANCED_GROUP),
  token("chart-4", "Chart 4", "Data-visualisation palette, slot 4.", ADVANCED_GROUP),
  token("chart-5", "Chart 5", "Data-visualisation palette, slot 5.", ADVANCED_GROUP),

  token(
    "sidebar",
    "Sidebar background",
    "Background of sidebar navigation.",
    ADVANCED_GROUP,
  ),
  token("sidebar-foreground", "Sidebar text", "Text in a sidebar.", ADVANCED_GROUP),
  token(
    "sidebar-primary",
    "Sidebar primary",
    "Active item in a sidebar.",
    ADVANCED_GROUP,
  ),
  token(
    "sidebar-primary-foreground",
    "Sidebar primary text",
    "Text of the active sidebar item.",
    ADVANCED_GROUP,
  ),
  token(
    "sidebar-accent",
    "Sidebar accent",
    "Hover background in a sidebar.",
    ADVANCED_GROUP,
  ),
  token(
    "sidebar-accent-foreground",
    "Sidebar accent text",
    "Text on hovered sidebar items.",
    ADVANCED_GROUP,
  ),
  token("sidebar-border", "Sidebar border", "Sidebar dividers.", ADVANCED_GROUP),
  token("sidebar-ring", "Sidebar focus ring", "Focus outline in a sidebar.", ADVANCED_GROUP),

  token(
    "muted-2",
    "Muted 2 background",
    "Alternate subtle background used by some blocks.",
    ADVANCED_GROUP,
  ),
  token(
    "muted-2-foreground",
    "Muted 2 text",
    "Text on the muted-2 background.",
    ADVANCED_GROUP,
  ),

  token(
    "gradient-1",
    "Gradient 1",
    "First stop of decorative gradient blocks.",
    ADVANCED_GROUP,
  ),
  token(
    "gradient-2",
    "Gradient 2",
    "Second stop of decorative gradient blocks.",
    ADVANCED_GROUP,
  ),
  token(
    "gradient-3",
    "Gradient 3",
    "Third stop of decorative gradient blocks.",
    ADVANCED_GROUP,
  ),
];

const toFieldName = (name: string) =>
  name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const THEME_TOKENS: readonly ThemeToken[] = TOKEN_DEFS.map((def) => ({
  ...def,
  field: toFieldName(def.name),
}));

export type ThemeTokenName = string;

/** Partial map of token name -> CSS color (hex, as produced by the Studio). */
export type PaletteValues = Record<string, string | undefined>;

export const DEFAULT_RADIUS = "0.5rem";

export const RADIUS_OPTIONS = [
  { title: "Square — 0", value: "0" },
  { title: "Subtle — 0.25rem", value: "0.25rem" },
  { title: "Default — 0.5rem", value: "0.5rem" },
  { title: "Rounded — 0.75rem", value: "0.75rem" },
  { title: "Extra rounded — 1rem", value: "1rem" },
];

/* Hex defaults below are the sRGB equivalents of the original global.css
   oklch values (kept in comments for easy comparison). Keyed by CSS token
   name; `paletteForFields()` converts them to Sanity field names. */

export const DEFAULT_LIGHT_PALETTE: PaletteValues = {
  background: "#faf9f5", // oklch(0.9818 0.0054 95.0986)
  foreground: "#3d3929", // oklch(0.3438 0.0269 95.7226)
  card: "#ffffff", // elevated card surface — pure white on the warm ivory page. Was oklch(0.9818 0.0054 95.0986), i.e. byte-identical to --background, so cards could not separate from the page.
  "card-foreground": "#141413", // oklch(0.1908 0.0020 106.5859)
  popover: "#ffffff", // oklch(1.0000 0 0)
  "popover-foreground": "#28261b", // oklch(0.2671 0.0196 98.9390)
  primary: "#c96442", // oklch(0.6171 0.1375 39.0427)
  "primary-foreground": "#ffffff", // oklch(1.0000 0 0)
  secondary: "#e9e6dc", // oklch(0.9245 0.0138 92.9892)
  "secondary-foreground": "#535146", // oklch(0.4334 0.0177 98.6048)
  accent: "#e9e6dc", // oklch(0.9245 0.0138 92.9892)
  "accent-foreground": "#28261b", // oklch(0.2671 0.0196 98.9390)
  muted: "#ede9de", // oklch(0.9341 0.0153 90.2390)
  "muted-foreground": "#83827d", // oklch(0.6059 0.0075 97.4233)
  border: "#dad9d4", // oklch(0.8847 0.0069 97.3627)
  input: "#b4b2a7", // oklch(0.7621 0.0156 98.3528)
  ring: "#c96442", // oklch(0.6171 0.1375 39.0427)
  destructive: "#141413", // oklch(0.1908 0.0020 106.5859)
  "destructive-foreground": "#ffffff", // oklch(1.0000 0 0)

  // Advanced
  "chart-1": "#b05730", // oklch(0.5583 0.1276 42.9956)
  "chart-2": "#9c87f5", // oklch(0.6898 0.1581 290.4107)
  "chart-3": "#ded8c4", // oklch(0.8816 0.0276 93.1280)
  "chart-4": "#dbd3f0", // oklch(0.8822 0.0403 298.1792)
  "chart-5": "#b4552d", // oklch(0.5608 0.1348 42.0584)
  sidebar: "#f5f4ee", // oklch(0.9663 0.0080 98.8792)
  "sidebar-foreground": "#3d3d3a", // oklch(0.3590 0.0051 106.6524)
  "sidebar-primary": "#c96442", // oklch(0.6171 0.1375 39.0427)
  "sidebar-primary-foreground": "#fbfbfb", // oklch(0.9881 0 0)
  "sidebar-accent": "#e9e6dc", // oklch(0.9245 0.0138 92.9892)
  "sidebar-accent-foreground": "#343434", // oklch(0.3250 0 0)
  "sidebar-border": "#ebebeb", // oklch(0.9401 0 0)
  "sidebar-ring": "#b5b5b5", // oklch(0.7731 0 0)
  "muted-2": "#e6e6e6", // oklch(0.925 0 89.876) — global.css had invalid syntax
  "muted-2-foreground": "#707086", // oklch(0.552 0.035 285.938) — idem
  "gradient-1": "#4d26ff", // oklch(0.643 0.4075 269.926) — idem, out of sRGB gamut
  "gradient-2": "#00e100", // oklch(0.727 0.4675 144.688) — idem, out of sRGB gamut
  "gradient-3": "#ff00e5", // oklch(0.701 0.3775 339.956) — idem, out of sRGB gamut
};

export const DEFAULT_DARK_PALETTE: PaletteValues = {
  background: "#262624", // oklch(0.2679 0.0036 106.6427)
  foreground: "#c3c0b6", // oklch(0.8074 0.0142 93.0137)
  card: "#30302e", // elevated card surface — warm charcoal one step above the page. Was oklch(0.2679 0.0036 106.6427), i.e. byte-identical to --background; matches the popover surface.
  "card-foreground": "#faf9f5", // oklch(0.9818 0.0054 95.0986)
  popover: "#30302e", // oklch(0.3085 0.0035 106.6039)
  "popover-foreground": "#e5e5e2", // oklch(0.9211 0.0040 106.4781)
  primary: "#d97757", // oklch(0.6724 0.1308 38.7559)
  "primary-foreground": "#ffffff", // oklch(1.0000 0 0)
  secondary: "#faf9f5", // oklch(0.9818 0.0054 95.0986)
  "secondary-foreground": "#30302e", // oklch(0.3085 0.0035 106.6039)
  accent: "#1a1915", // oklch(0.2130 0.0078 95.4245)
  "accent-foreground": "#f5f4ee", // oklch(0.9663 0.0080 98.8792)
  muted: "#1b1b19", // oklch(0.2213 0.0038 106.7070)
  "muted-foreground": "#b7b5a9", // oklch(0.7713 0.0169 99.0657)
  border: "#3e3e38", // oklch(0.3618 0.0101 106.8928)
  input: "#52514a", // oklch(0.4336 0.0113 100.2195)
  ring: "#d97757", // oklch(0.6724 0.1308 38.7559)
  destructive: "#ef4444", // oklch(0.6368 0.2078 25.3313)
  "destructive-foreground": "#ffffff", // oklch(1.0000 0 0)

  // Advanced
  "chart-1": "#b05730", // oklch(0.5583 0.1276 42.9956)
  "chart-2": "#9c87f5", // oklch(0.6898 0.1581 290.4107)
  "chart-3": "#1a1915", // oklch(0.2130 0.0078 95.4245)
  "chart-4": "#2f2b48", // oklch(0.3074 0.0516 289.3230)
  "chart-5": "#b4552d", // oklch(0.5608 0.1348 42.0584)
  sidebar: "#1f1e1d", // oklch(0.2357 0.0024 67.7077)
  "sidebar-foreground": "#c3c0b6", // oklch(0.8074 0.0142 93.0137)
  "sidebar-primary": "#343434", // oklch(0.3250 0 0)
  "sidebar-primary-foreground": "#fbfbfb", // oklch(0.9881 0 0)
  "sidebar-accent": "#0f0f0e", // oklch(0.1680 0.0020 106.6177)
  "sidebar-accent-foreground": "#c3c0b6", // oklch(0.8074 0.0142 93.0137)
  "sidebar-border": "#ebebeb", // oklch(0.9401 0 0)
  "sidebar-ring": "#b5b5b5", // oklch(0.7731 0 0)
  "muted-2": "#2e2e2e", // oklch(0.301 0 89.876) — global.css had invalid syntax
  "muted-2-foreground": "#bdbdc5", // oklch(0.802 0.01 286.305) — idem
  "gradient-1": "#3e00e5", // oklch(0.27 0.3925 269.284) — idem, out of sRGB gamut
  "gradient-2": "#00e100", // oklch(0.727 0.4675 144.688) — idem, out of sRGB gamut
  "gradient-3": "#ff00e5", // oklch(0.701 0.3775 339.956) — idem, out of sRGB gamut
};

/** Re-key a CSS-name-keyed palette to Sanity field names (for `initialValue`). */
export const paletteForFields = (palette: PaletteValues): Record<string, string> =>
  Object.fromEntries(
    THEME_TOKENS.flatMap(({ name, field }) =>
      palette[name] ? [[field, palette[name] as string]] : [],
    ),
  );
