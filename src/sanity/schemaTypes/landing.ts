import { defineField, defineType } from "sanity";

export const landingType = defineType({
  name: "landing",
  title: "Landing Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "landingImage",
      type: "image",
      description: "Hero image for the landing page",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    }),
    defineField({
      name: "image",
      type: "image",
      description: "Fallback / thumbnail image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    }),
    defineField({
      name: "ctaText",
      type: "internationalizedArrayString",
      description: "Call to action text",
    }),
    defineField({
      name: "ctaBtnText",
      type: "internationalizedArrayString",
      description: "Call to action button label",
      validation: (rule) => rule.required(),
    }),
  ],
});
