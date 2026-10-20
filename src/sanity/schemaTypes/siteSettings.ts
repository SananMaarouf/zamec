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
      description:
        "One or two sentences about the site, used as the description in Google results and link previews for any page that does not have its own. Aim for 120–160 characters; longer text is cut off.",
      validation: (rule) =>
        rule
          .custom((items: any) =>
            Array.isArray(items) &&
            items.some((item) => (item?.value?.length ?? 0) > 160)
              ? "One of these is longer than 160 characters — search results and link previews will cut it off."
              : true
          )
          .warning(),
    }),
    defineField({
      name: "ogImage",
      title: "Share image (link previews)",
      type: "image",
      description:
        "The picture shown next to a link to the site when it is shared in social media or messaging apps (Facebook, LinkedIn, WhatsApp, iMessage, Slack). Used for every page that does not have its own share image. Landscape JPG or PNG, around 1200 × 630 px.",
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
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Public canonical URL (e.g. https://example.com).",
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
