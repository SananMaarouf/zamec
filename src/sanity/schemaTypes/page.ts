import { defineField, defineType } from "sanity";

import { AutoSlugInput } from "../components/auto-slug-input";
import { DOCUMENT_GUIDES } from "../lib/document-guides";
import { englishText, type I18nStringItem } from "../lib/slug";

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
      name: "body",
      type: "internationalizedArrayBlockContent",
    }),
    // Contact-page-only block: the form is template-owned (Zod validation,
    // Formspree endpoint), but the words around it are editorial copy. Shown
    // only when this document's slug is `contact`, so ordinary pages never see
    // fields that do nothing.
    defineField({
      name: "contactForm",
      title: "Contact form",
      type: "object",
      description:
        "The wording of the contact form. Leave a field empty to use the built-in text. The fields themselves (name, email, subject, message) and their validation are part of the template and cannot be changed here.",
      hidden: ({ document }) =>
        (document?.slug as { current?: string } | undefined)?.current !==
        "contact",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "heading",
          title: "Heading above the form",
          type: "internationalizedArrayString",
          description:
            "Optional. Shown just above the form, e.g. “Send me a message”. Leave empty for no heading.",
        }),
        defineField({
          name: "submitLabel",
          title: "Send button",
          type: "internationalizedArrayString",
          description:
            "Text on the send button. Leave empty for “Send message” / “Send melding”.",
        }),
        defineField({
          name: "successTitle",
          title: "Thank-you heading",
          type: "internationalizedArrayString",
          description:
            "Shown instead of the form after a message is sent. Leave empty for the built-in text.",
        }),
        defineField({
          name: "successBody",
          title: "Thank-you text",
          type: "internationalizedArrayText",
          description:
            "The sentence under the thank-you heading. Leave empty for the built-in text.",
        }),
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "internationalizedArrayText",
      description:
        "The sentence shown under the title in Google results and when the link is shared. Aim for 120–160 characters; search engines cut longer text. Leave empty to use the site description from Site Settings.",
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
