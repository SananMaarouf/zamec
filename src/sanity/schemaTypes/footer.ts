import { defineField, defineType } from "sanity";

export const footerType = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "instagramURL",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "cellNumber",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "address",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "copyright",
      type: "internationalizedArrayString",
    }),
  ],
});
