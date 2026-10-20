import { defineField, defineType } from "sanity";

import { AutoSlugInput } from "../components/auto-slug-input";
import { DOCUMENT_GUIDES } from "../lib/document-guides";
import { englishText, type I18nStringItem } from "../lib/slug";

export const categoryType = defineType({
  name: "category",
  type: "document",
  description: DOCUMENT_GUIDES.category,
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "Fills itself from the English title. Only edit it if you need a different URL.",
      options: {
        source: (doc) => englishText(doc.title as I18nStringItem[]),
        maxLength: 96,
      },
      components: { input: AutoSlugInput },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "internationalizedArrayText",
    }),
  ],
  preview: {
    select: { titles: "title" },
    prepare({ titles }) {
      const title =
        Array.isArray(titles) && titles.length > 0 ? titles[0].value : "Untitled";
      return { title };
    },
  },
});
