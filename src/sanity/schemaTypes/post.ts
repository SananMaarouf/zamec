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
