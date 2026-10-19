import { defineField, defineType } from "sanity";

type InternationalizedValue = { _key: string; language: string; value: string };

/**
 * Pick a human-readable string out of a `internationalizedArray*` value.
 * Prefers the given language, then the first entry that actually has text.
 * Studio previews are fed the raw array, so without this the list/header
 * renders the whole `[{ language, value }, …]` blob as the document title.
 */
const localizedText = (
  entries: InternationalizedValue[] | undefined,
  language = "en"
): string => {
  const filled = (entries ?? []).filter(
    (entry) => typeof entry?.value === "string" && entry.value.trim() !== ""
  );
  return (filled.find((entry) => entry.language === language) ?? filled[0])
    ?.value ?? "";
};

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site description",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Public canonical URL (e.g. https://example.com).",
    }),
    defineField({
      name: "primaryNav",
      title: "Primary Navigation",
      type: "reference",
      to: [{ type: "navigation" }],
    }),
  ],
  preview: {
    select: {
      titles: "title",
      descriptions: "description",
      media: "ogImage",
    },
    prepare({ titles, descriptions, media }) {
      const title = localizedText(titles) || "Site Settings";
      const description = localizedText(descriptions);
      return {
        title,
        subtitle: description
          ? description.length > 90
            ? `${description.slice(0, 90).trimEnd()}…`
            : description
          : undefined,
        media,
      };
    },
  },
});
