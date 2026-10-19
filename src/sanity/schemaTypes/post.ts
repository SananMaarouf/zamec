import { defineArrayMember, defineField, defineType } from "sanity";

import { DOCUMENT_GUIDES } from "../lib/document-guides";

export const postType = defineType({
  name: "post",
  type: "document",
  description: DOCUMENT_GUIDES.post,
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: (doc) => {
          // Extract the first available title from the internationalized array
          const titles = doc.title as Array<{ value: string; _key: string }>;
          return titles?.[0]?.value || "";
        },
        maxLength: 96,
      },
    }),
    defineField({
      name: "mainImage",
      title: "Cover image",
      type: "image",
      description:
        "Shown on the index page and at the top of the post. Leave empty to use the first gallery image.",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Gallery images",
      type: "array",
      description:
        "Add one or more images. Visitors can click an image to view it larger.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "body",
      type: "internationalizedArrayBlockContent",
    }),
  ],

  preview: {
    select: {
      titles: "title",
      media: "coalesce(mainImage, images[0])",
    },
    prepare(selection) {
      const { titles } = selection;
      // Extract the first title from the internationalized array
      const title = Array.isArray(titles) && titles.length > 0
        ? titles[0].value
        : "Untitled";
      return { title, media: selection.media };
    },
  },
});
