import { defineArrayMember, defineField, defineType } from "sanity";

import { DOCUMENT_GUIDES } from "../lib/document-guides";

export const navigationType = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  description: DOCUMENT_GUIDES.navigation,
  fields: [
    // The contact page is a template-owned route, so it has no CMS document to
    // hang off the menu as a reference. These two fields are how editors
    // include it (or leave it out) without touching code.
    defineField({
      name: "showContact",
      title: "Show the contact link",
      type: "boolean",
      description:
        "Turn off to remove the contact page from the menu. The page itself stays online at /contact — tell your developer if it should disappear entirely.",
      initialValue: true,
    }),
    defineField({
      name: "contactLabel",
      title: "Contact link label",
      type: "internationalizedArrayString",
      description:
        "Optional. Leave empty to use the built-in label: “Contact” in English, “Kontakt” in Norwegian.",
      hidden: ({ parent }) => parent?.showContact === false,
    }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          name: "navItem",
          type: "object",
          fields: [
            {
              name: "label",
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            },
            {
              name: "href",
              title: "External / manual URL",
              type: "string",
              description:
                "Use for external links or manual paths. Leave empty when using an internal reference.",
            },
            {
              name: "internalRef",
              title: "Internal reference",
              type: "reference",
              to: [{ type: "post" }, { type: "page" }, { type: "category" }],
              description:
                "Linked document. Takes precedence when both are set.",
            },
          ],
          preview: {
            select: {
              labels: "label",
              href: "href",
              ref: "internalRef.slug.current",
            },
            prepare({ labels, href, ref }) {
              const label =
                Array.isArray(labels) && labels.length > 0
                  ? labels[0].value
                  : "Untitled";
              return { title: label, subtitle: ref ? `→ ${ref}` : href };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    // Singleton: the form header uses this as the pane heading.
    prepare: () => ({ title: DOCUMENT_GUIDES.navigation }),
  },
});
