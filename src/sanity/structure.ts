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

/**
 * The contact page is an ordinary `page` document, but `/contact` and
 * `/nb/contact` are template-owned routes that look it up by the fixed slug
 * `contact`. It therefore gets its own Studio entry (so editors can find the
 * form wording), and it is kept out of the generic Pages list: showing it
 * twice invites someone to create a second document with the same slug.
 *
 * Its id is resolved from the dataset because it may have been imported with a
 * generated id; `page-contact` is only used when no such document exists yet,
 * in which case clicking the entry creates one with the slug prefilled.
 */
const CONTACT_SLUG = "contact";
const CONTACT_FALLBACK_ID = "page-contact";

async function contactPageId(): Promise<string> {
  try {
    const id = await studioClient.fetch<string | null>(
      `*[_type == "page" && slug.current == $slug][0]._id`,
      { slug: CONTACT_SLUG }
    );
    return id ?? CONTACT_FALLBACK_ID;
  } catch {
    return CONTACT_FALLBACK_ID;
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
      S.listItem()
        .title("Contact Page")
        .id("contactPage")
        .child(async () =>
          S.document()
            .schemaType("page")
            .documentId(await contactPageId())
            .title("Contact Page")
            // Only applied when the document does not exist yet. The route
            // finds the page by its slug, so a new document must start with
            // `contact` rather than whatever the title happens to slugify to.
            .initialValueTemplate("page-contact")
        ),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((item) => !isSingleton(item.getId() ?? ""))
        .filter((item) => item.getId() !== "page"),
      S.listItem()
        .title("Pages")
        .id("page-list")
        .child(async () =>
          S.documentTypeList("page")
            .title("Pages")
            .filter("_id != $contactId")
            .params({ contactId: await contactPageId() })
        ),
    ]);
