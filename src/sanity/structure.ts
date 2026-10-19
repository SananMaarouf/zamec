import type { StructureResolver } from "sanity/structure";

const SINGLETONS = new Set(["siteSettings", "theme", "footer"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.listItem()
        .title("Theme")
        .id("theme")
        .child(S.document().schemaType("theme").documentId("theme")),
      S.listItem()
        .title("Footer")
        .id("footer")
        .child(S.document().schemaType("footer").documentId("footer")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.has(item.getId() ?? "")
      ),
    ]);
