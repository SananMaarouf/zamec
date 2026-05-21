import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: (doc) => {
          const titles = doc.title as Array<{ value: string; _key: string }> | undefined;
          return titles?.[0]?.value || "";
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "internationalizedArrayBlockContent",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "ogImage",
      title: "OG image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
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
