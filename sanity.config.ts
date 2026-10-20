import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { structure } from "./src/sanity/structure";


export default defineConfig({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool({ structure }),
    internationalizedArray({
      languages: [
        { id: "en", title: "English" },
        { id: "nb", title: "Norwegian Bokmål" },
      ],
      defaultLanguages: ["en"],
      fieldTypes: ["string", "text", "blockContent"],
    }),
  ],
  schema: {
    ...schema,
    /**
     * The /contact route is template-owned and finds its copy through an
     * ordinary `page` document with the fixed slug `contact`. The Studio's
     * "Contact Page" entry opens that document; when it does not exist yet the
     * entry creates it from this template so the slug is already correct
     * (AutoSlug would otherwise derive it from the edited title).
     */
    templates: (previous) => [
      ...previous,
      {
        id: "page-contact",
        title: "Contact page",
        description:
          "The copy for /contact. Use the Contact Page entry in the menu instead of creating it here.",
        schemaType: "page",
        value: {
          slug: { _type: "slug", current: "contact" },
          title: [
            {
              _key: "contact-en",
              _type: "internationalizedArrayStringValue",
              language: "en",
              value: "Contact me",
            },
            {
              _key: "contact-nb",
              _type: "internationalizedArrayStringValue",
              language: "nb",
              value: "Kontakt meg",
            },
          ],
        },
      },
    ],
  },
});
