import { defineField, defineType } from "sanity";

import { DOCUMENT_GUIDES } from "../lib/document-guides";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  description: DOCUMENT_GUIDES.siteSettings,
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site description",
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
  preview: {
    // This document is opened as a singleton (id === type name), so the form
    // header hides the type title and uses `preview.title` as its heading.
    // Lead with what the document is for instead of echoing the site name.
    // `media` is passed through without `select`, so the pane shows no
    // thumbnail; add `select: { media: "ogImage" }` if that is wanted back.
    prepare: () => ({ title: DOCUMENT_GUIDES.siteSettings }),
  },
});
