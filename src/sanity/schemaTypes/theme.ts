import { defineField, defineType } from "sanity";

import { DOCUMENT_GUIDES } from "../lib/document-guides";
import {
  ADVANCED_GROUP,
  DEFAULT_DARK_PALETTE,
  DEFAULT_LIGHT_PALETTE,
  DEFAULT_RADIUS,
  RADIUS_OPTIONS,
  THEME_GROUPS,
  THEME_TOKENS,
  paletteForFields,
} from "../../lib/theme-tokens";
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADING_FONT,
  FONT_OPTIONS,
  isFontChoice,
} from "../../lib/google-fonts";
import { PalettePreview } from "../components/palette-preview";
import { ColorSwatchInput } from "../components/color-swatch-input";
import { FontSelectInput } from "../components/font-select-input";
import { FontsPreview } from "../components/fonts-preview";

const fieldsetId = (group: string) =>
  group.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const fieldsets = THEME_GROUPS.map((group) => ({
  name: fieldsetId(group),
  title: group,
  options:
    group === ADVANCED_GROUP
      ? // Kept collapsed so the rare tokens (charts, sidebar, gradients)
        // do not bury the handful of colors a project actually changes.
        { columns: 2, collapsible: true, collapsed: true }
      : { columns: 2 },
}));

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const paletteFields = THEME_TOKENS.map((token) =>
  defineField({
    name: token.field,
    title: token.label,
    description: token.hint,
    type: "string",
    fieldset: fieldsetId(token.group),
    components: { input: ColorSwatchInput },
    validation: (rule) =>
      rule.custom((value) =>
        !value || HEX_COLOR_RE.test(value)
          ? true
          : "Use a hex color, e.g. #c96442.",
      ),
  }),
);

/**
 * Reusable color palette object, used once for light mode and once for dark
 * mode. Every token gets a starter value, so a freshly created theme document
 * reproduces the template's original look until a color is changed.
 */
export const themePaletteType = defineType({
  name: "themePalette",
  title: "Color palette",
  type: "object",
  fieldsets,
  fields: paletteFields,
  components: { input: PalettePreview },
});

/**
 * One font choice: a Google Fonts family, or `system` for "no webfont".
 *
 * The value stored is the exact Google Fonts family name (`Playfair Display`).
 * The catalog, the CSS stacks and the stylesheet URL all live in
 * `src/lib/google-fonts.ts`, which the site also imports — so adding a font
 * there makes it pickable here.
 */
const fontField = (
  name: "heading" | "body",
  title: string,
  description: string,
  initialValue: string,
) =>
  defineField({
    name,
    title,
    description,
    type: "string",
    fieldset: "pair",
    initialValue,
    // Recorded in the schema for reference (and for the default dropdown if the
    // custom input is ever removed); the picker below renders its own UI.
    options: { list: FONT_OPTIONS },
    components: { input: FontSelectInput },
    validation: (rule) =>
      rule.custom((value) =>
        isFontChoice(value)
          ? true
          : "Pick a font from the list, or “Site default”.",
      ),
  });

/**
 * Typography: which Google Fonts the site loads, and what each one is used for.
 * Not per-mode on purpose — fonts do not change between light and dark, and the
 * site emits them as `--font-heading` / `--font-body` (see `src/lib/theme.ts`).
 */
export const themeFontsType = defineType({
  name: "themeFonts",
  title: "Fonts",
  type: "object",
  fieldsets: [
    {
      name: "pair",
      title: "Fonts",
      options: { columns: 2 },
    },
  ],
  fields: [
    fontField(
      "heading",
      "Heading font",
      "Titles: H1–H6 in articles and pages, plus the site name. “Site default” follows the body font.",
      DEFAULT_HEADING_FONT,
    ),
    fontField(
      "body",
      "Body font",
      "Everything else: paragraphs, cards, buttons, navigation, captions. “Site default” keeps the built-in sans stack.",
      DEFAULT_BODY_FONT,
    ),
  ],
  components: { input: FontsPreview },
});

export const themeType = defineType({
  name: "theme",
  title: "Theme",
  type: "document",
  description: DOCUMENT_GUIDES.theme,
  // Tabs, so the color palettes do not bury the font choices (and vice versa).
  groups: [
    { name: "colors", title: "Colors", default: true },
    { name: "fonts", title: "Fonts" },
    { name: "layout", title: "Layout" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "colors",
      hidden: true,
      initialValue: "Theme",
    }),
    defineField({
      name: "light",
      title: "Light mode",
      description:
        "Colors used when the site is in light mode. Unset colors fall back to the starter palette.",
      type: "themePalette",
      group: "colors",
      options: { collapsible: false },
      initialValue: {
        _type: "themePalette",
        ...paletteForFields(DEFAULT_LIGHT_PALETTE),
      },
    }),
    defineField({
      name: "dark",
      title: "Dark mode",
      description:
        "Colors used when the site is in dark mode. Unset colors fall back to the starter palette.",
      type: "themePalette",
      group: "colors",
      // `mode` is read by PalettePreview so unset tokens preview with the dark
      // starter palette rather than the light one.
      options: { collapsible: false, mode: "dark" },
      initialValue: {
        _type: "themePalette",
        ...paletteForFields(DEFAULT_DARK_PALETTE),
      },
    }),
    defineField({
      name: "fonts",
      title: "Fonts",
      description:
        "Google Fonts loaded from fonts.googleapis.com. Headings and body text can each use a different family.",
      type: "themeFonts",
      group: "fonts",
      options: { collapsible: false },
      initialValue: {
        _type: "themeFonts",
        heading: DEFAULT_HEADING_FONT,
        body: DEFAULT_BODY_FONT,
      },
    }),
    defineField({
      name: "radius",
      title: "Corner radius",
      description: "Rounding applied to buttons, cards and inputs.",
      type: "string",
      group: "layout",
      options: { list: RADIUS_OPTIONS, layout: "radio" },
      initialValue: DEFAULT_RADIUS,
    }),
  ],
  preview: {
    // Singleton: the form header uses this as the pane heading, so explain the
    // document rather than repeating its name.
    prepare: () => ({ title: DOCUMENT_GUIDES.theme }),
  },
});
