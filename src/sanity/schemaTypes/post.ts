import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  type: "document",
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
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
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
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { titles, author } = selection;
      // Extract the first title from the internationalized array
      const title = Array.isArray(titles) && titles.length > 0
        ? titles[0].value
        : "Untitled";
      return { title, subtitle: author && `by ${author}`, media: selection.media };
    },
  },
});