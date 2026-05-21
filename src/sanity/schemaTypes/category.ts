import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
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
      name: "description",
      type: "internationalizedArrayText",
    }),
  ],
  preview: {
    select: { titles: "title" },
    prepare({ titles }) {
      const title =
        Array.isArray(titles) && titles.length > 0 ? titles[0].value : "Untitled";
      return { title };
    },
  },
});
