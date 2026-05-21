import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    }),
    defineField({
      name: "bio",
      type: "internationalizedArrayBlockContent",
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
