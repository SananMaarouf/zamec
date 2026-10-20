import { createClient } from "@sanity/client";
import type { StructureResolver } from "sanity/structure";

/**
 * Documents the site assumes exist exactly once. They are pulled out of the
 * generic document list so editors cannot create a second one.
 */
const SINGLETONS = ["siteSettings", "theme", "footer", "navigation"] as const;

type SingletonName = (typeof SINGLETONS)[number];

const isSingleton = (id: string | undefined): boolean =>
  SINGLETONS.includes(id as SingletonName);

const studioClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: "2025-09-21",
  useCdn: false,
  perspective: "published",
});

/**
 * Fixed-id singletons (`siteSettings`, `theme`, `footer`) already exist under
 * their type name. `navigation` does not: the dataset predates the singleton
 * and stores the menu under a generated id. Opening a fixed, non-existent id
 * would show an empty menu in the Studio while the site kept rendering the
 * real one, so resolve the document that is actually there and only fall back
 * to the fixed id when none exists.
 */
async function existingDocumentId(type: SingletonName): Promise<string> {
  try {
    const id = await studioClient.fetch<string | null>(
      `*[_type == $type] | order(_updatedAt asc)[0]._id`,
      { type }
    );
    return id ?? type;
  } catch {
    return type;
  }
}

const singleton = (
  S: Parameters<StructureResolver>[0],
  type: Exclude<SingletonName, "navigation">,
  title: string
) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "siteSettings", "Site Settings"),
      S.listItem()
        .title("Navigation")
        .id("navigation")
        .child(async () =>
          S.document()
            .schemaType("navigation")
            .documentId(await existingDocumentId("navigation"))
            .title("Navigation")
        ),
      singleton(S, "theme", "Theme"),
      singleton(S, "footer", "Footer"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !isSingleton(item.getId() ?? "")
      ),
    ]);
