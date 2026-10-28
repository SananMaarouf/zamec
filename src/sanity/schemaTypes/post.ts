import { defineArrayMember, defineField, defineType } from "sanity";

import { AutoSlugInput } from "../components/auto-slug-input";
import { DOCUMENT_GUIDES } from "../lib/document-guides";
import { englishText, type I18nStringItem } from "../lib/slug";

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
      description:
        "Fills itself from the English title. Only edit it if you need a different URL.",
      options: {
        source: (doc) => englishText(doc.title as I18nStringItem[]),
        maxLength: 96,
      },
      components: { input: AutoSlugInput },
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "internationalizedArrayText",
      description:
        "The sentence shown under the title in Google results and when the link is shared. Aim for 120–160 characters; search engines cut longer text. Leave empty to use the opening of the post text.",
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
          description:
            "Describes the picture for screen readers and search engines.",
          validation: (rule) =>
            rule
              .custom((value: any) =>
                value
                  ? true
                  : "No alternative text: screen readers and search engines cannot tell what this image shows."
              )
              .warning(),
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
              description:
                "Describes the picture for screen readers and search engines.",
              validation: (rule) =>
                rule
                  .custom((value: any) =>
                    value
                      ? true
                      : "No alternative text: screen readers and search engines cannot tell what this image shows."
                  )
                  .warning(),
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "internationalizedArrayText",
      description:
        'The short text that sits directly under the images: the materials. Around 150 characters, 250 at most. The years have their own fields below (Produced at and Displayed at), so they are not written here. Line breaks are kept, so a longer list of materials can run over two lines:\n\n"glazed stoneware and wood,\nhoggstabb"',
      validation: (rule) =>
        rule
          .custom((items: any) =>
            Array.isArray(items) &&
            items.some((item) => (item?.value?.length ?? 0) > 250)
              ? "One of these is longer than 250 characters — this line is meant to be read at a glance under the images."
              : true
          )
          .warning(),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description:
        'Physical size of the work, for example "97 × 233 × 86 cm". Shown on the line under the details, the same in both languages.',
      validation: (rule) =>
        rule
          .custom((value: any) =>
            typeof value === "string" && value.length > 40
              ? "That is long for a size line — it sits under the details in small type."
              : true
          )
          .warning(),
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "producedAt",
      title: "Produced at",
      type: "number",
      description:
        "The year the work was made, written as four digits (2024) — the production year only. Shown at the right edge of the details line under the images, and the newest works are listed first.",
      validation: (rule) =>
        rule
          .integer()
          .min(1900)
          .max(2100)
          .warning("That does not look like four-digit year."),
    }),
    defineField({
      name: "displayedAt",
      title: "Displayed at",
      type: "number",
      description:
        "The year the work was shown in an exhibition, if it has been. Leave it empty when the work has not been exhibited. Shown under the production year; also here only the year is displayed.",
      validation: (rule) =>
        rule
          .integer()
          .min(1900)
          .max(2100)
          .warning("That does not look like four-digit year."),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "internationalizedArrayBlockContent",
      description:
        "The longer text under the Details line: what the work is about, in your own words — around 500 characters.",
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
