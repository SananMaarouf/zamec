/**
 * One plain-language sentence per document type, written for the client's
 * editors rather than for developers.
 *
 * Where each string shows up:
 * - Singleton documents (`siteSettings`, `theme`, `footer`) open with a fixed
 *   id equal to the type name, and the Studio's form header hides the type
 *   title for those. Their `preview.title` is therefore set to the sentence
 *   below, so the pane heading explains the document instead of repeating the
 *   site name.
 * - Collection documents (`post`, `page`, …) use the sentence as the type's
 *   `description`, which the Studio renders in the info tooltip beside the
 *   type name in the document form header.
 *
 * Keep each entry to one or two short sentences; it is rendered as a heading.
 */
export const DOCUMENT_GUIDES = {
  siteSettings:
    "Here you set the site name, description, sharing image and public URL used across the whole website.",
  theme:
    "Here you set the colours, fonts and corner radius used across the whole website.",
  footer:
    "Here you set the contact details and copyright line shown at the bottom of every page.",
  post: "A blog post. Fill in a language to get a page in that language; fields you leave empty simply are not published.",
  page: "A standalone page such as About or FAQ. Its slug decides the URL, and each language you fill in gets its own page.",
  category:
    "A topic that groups posts, for example Ceramics or Fabrics. Every category gets its own listing page.",
  navigation:
    "The main menu. Each item points at a post, page, category or external URL, and every label is translated per language.",
} as const;

export type DocumentGuideType = keyof typeof DOCUMENT_GUIDES;
