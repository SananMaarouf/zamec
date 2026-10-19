import type { SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContent";
import { categoryType } from "./category";
import { footerType } from "./footer";
import { navigationType } from "./navigation";
import { pageType } from "./page";
import { postType } from "./post";
import { siteSettingsType } from "./siteSettings";
import { themeFontsType, themePaletteType, themeType } from "./theme";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    footerType,
    navigationType,
    pageType,
    postType,
    siteSettingsType,
    themeType,
    // Object types referenced by `theme.light` / `theme.dark` / `theme.fonts`.
    themePaletteType,
    themeFontsType,
  ],
};
