import type { StructureResolver } from "sanity/structure";

/**
 * Documents the site assumes exist exactly once. They are opened by a fixed id
 * equal to the type name, so the Studio always edits the same document and
 * editors cannot create a second one from the content list.
 */
const SINGLETONS = ["siteSettings", "navigation", "theme", "footer"] as const;

type SingletonName = (typeof SINGLETONS)[number];

const isSingleton = (id: string | undefined): boolean =>
  SINGLETONS.includes(id as SingletonName);

const singleton = (
  S: Parameters<StructureResolver>[0],
  type: SingletonName,
  title: string
) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "siteSettings", "Site Settings"),
      singleton(S, "navigation", "Navigation"),
      singleton(S, "theme", "Theme"),
      singleton(S, "footer", "Footer"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !isSingleton(item.getId() ?? "")
      ),
    ]);
