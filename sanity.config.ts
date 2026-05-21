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
  schema,
});
