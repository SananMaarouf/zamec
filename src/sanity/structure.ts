import type { StructureResolver } from "sanity/structure";

const SINGLETONS = new Set(["siteSettings", "footer", "landing"]);

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
        .title("Footer")
        .id("footer")
        .child(S.document().schemaType("footer").documentId("footer")),
      S.listItem()
        .title("Landing")
        .id("landing")
        .child(S.document().schemaType("landing").documentId("landing")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.has(item.getId() ?? "")
      ),
    ]);
