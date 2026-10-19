import { defineField, defineType } from "sanity";

import { DOCUMENT_GUIDES } from "../lib/document-guides";

export const footerType = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  description: DOCUMENT_GUIDES.footer,
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
  preview: {
    // Singleton: the form header shows this as the pane heading.
    prepare: () => ({ title: DOCUMENT_GUIDES.footer }),
  },
});
