/**
 * Helpers for turning CMS free text into metadata that search engines and link
 * previews render well.
 */

/**
 * Google and most social clients cut a description at roughly 155-160
 * characters. Everything longer is silently truncated mid-word, so trim on a
 * word boundary and mark the cut with an ellipsis.
 */
export const META_DESCRIPTION_MAX = 160;

export function metaDescription(
  text: string | null | undefined,
  max: number = META_DESCRIPTION_MAX
): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.replace(/[\s.,;:!?\-–—]+$/, "")}…`;
}

/**
 * Flattens Portable Text blocks into one plain-text string, for the case where
 * an editor has not written a dedicated SEO description and the opening of the
 * text is the best fallback available.
 */
export function textFromBlocks(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .filter((block) => block && typeof block === "object")
    .map((block: any) =>
      Array.isArray(block.children)
        ? block.children.map((child: any) => child?.text ?? "").join("")
        : typeof block.text === "string"
          ? block.text
          : ""
    )
    .filter(Boolean)
    .join(" ")
    .trim();
}
