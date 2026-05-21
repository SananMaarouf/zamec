import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.PUBLIC_SANITY_DATASET!,
  },
  typegen: {
    path: "./src/**/*.{ts,tsx,astro}",
    schema: "./schema.json",
    generates: "./src/sanity/sanity.types.ts",
  },
});
