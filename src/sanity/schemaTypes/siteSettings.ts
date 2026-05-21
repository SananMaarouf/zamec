import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Public canonical URL (e.g. https://example.com).",
    }),
    defineField({
      name: "primaryNav",
      title: "Primary Navigation",
      type: "reference",
      to: [{ type: "navigation" }],
    }),
  ],
});
