import { defineArrayMember, defineField, defineType } from "sanity";

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
    // Second editorial block for the contact page: the "other ways to reach
    // me" column next to the form. Empty (no rows) means the page renders the
    // form alone, so nothing has to be deleted from code when a channel goes.
    defineField({
      name: "contactDetails",
      title: "Other ways to get in touch",
      type: "object",
      description:
        "Shown in a column beside the contact form. If you leave this empty, or delete every row, the page shows the form on its own.",
      hidden: ({ document }) =>
        (document?.slug as { current?: string } | undefined)?.current !==
        "contact",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Column heading",
          type: "internationalizedArrayString",
          description:
            "e.g. “Other ways to reach me”. Leave empty for the built-in heading.",
        }),
        defineField({
          name: "items",
          title: "Contact details",
          type: "array",
          of: [
            defineArrayMember({
              name: "contactChannel",
              title: "Contact detail",
              type: "object",
              fields: [
                {
                  name: "platform",
                  title: "Type",
                  type: "string",
                  options: {
                    list: [
                      { value: "phone", title: "Phone" },
                      { value: "email", title: "Email" },
                      { value: "instagram", title: "Instagram" },
                      { value: "facebook", title: "Facebook" },
                      { value: "youtube", title: "YouTube" },
                      { value: "website", title: "Website" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                },
                {
                  name: "value",
                  title: "Link, number or address",
                  type: "string",
                  description:
                    "Phone: the number as you would dial it. Email: the address. Everything else: the full link, e.g. https://instagram.com/yourname.",
                  validation: (rule) => rule.required(),
                },
                {
                  name: "label",
                  title: "Text shown (optional)",
                  type: "string",
                  description:
                    "Overrides the default text, e.g. “@sarazamecznik”. Phone and email show the number/address when this is empty; links show the platform name.",
                },
              ],
              preview: {
                select: { platform: "platform", value: "value" },
                prepare({ platform, value }) {
                  const names: Record<string, string> = {
                    phone: "Phone",
                    email: "Email",
                    instagram: "Instagram",
                    facebook: "Facebook",
                    youtube: "YouTube",
                    website: "Website",
                  };
                  return {
                    title: names[platform as string] ?? "Contact detail",
                    subtitle: value,
                  };
                },
              },
            }),
          ],
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
