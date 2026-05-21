import type { SchemaTypeDefinition } from "sanity";

import { authorType } from "./author";
import { blockContentType } from "./blockContent";
import { categoryType } from "./category";
import { footerType } from "./footer";
import { landingType } from "./landing";
import { navigationType } from "./navigation";
import { pageType } from "./page";
import { postType } from "./post";
import { siteSettingsType } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    authorType,
    blockContentType,
    categoryType,
    footerType,
    landingType,
    navigationType,
    pageType,
    postType,
    siteSettingsType,
  ],
};
