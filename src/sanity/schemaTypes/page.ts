import { defineField, defineType } from "sanity";

import { DOCUMENT_GUIDES } from "../lib/document-guides";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  description: DOCUMENT_GUIDES.page,
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: (doc) => {
          const titles = doc.title as Array<{ value: string; _key: string }> | undefined;
          return titles?.[0]?.value || "";
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "internationalizedArrayBlockContent",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "ogImage",
      title: "Share image (link previews)",
      type: "image",
      description:
        "The picture shown next to a link to this page when it is shared in social media or messaging apps (Facebook, LinkedIn, WhatsApp, iMessage, Slack). Leave empty to use the site-wide share image from Site Settings. Landscape JPG or PNG, around 1200 × 630 px.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description:
            "Describes the picture for screen readers and for anyone who cannot load images.",
        },
      ],
    }),
  ],
  preview: {
    select: { titles: "title", media: "ogImage" },
    prepare({ titles, media }) {
      const title =
        Array.isArray(titles) && titles.length > 0 ? titles[0].value : "Untitled";
      return { title, media };
    },
  },
});
