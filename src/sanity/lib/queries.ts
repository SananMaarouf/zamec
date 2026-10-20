import { defineQuery } from "groq";

// ───── Posts ───────────────────────────────────────────────────────────────
// The `count(... > 0` filter is the i18n correctness guard: only emit a path
// when this locale actually has content. Without it, getStaticPaths produces
// broken half-rendered pages for missing translations.
//
// Every post listing also selects `images[]{ asset, alt }` so a post that only
// has gallery images (no cover) still gets a thumbnail: the components fall
// back to `images[0]`.
//
// Listings are ordered `publishedAt desc, _id asc`. The second key only breaks
// ties between posts published at the same moment, but it must stay identical
// in every listing: the post page's "next post" lookup walks that same order.

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && count(title[language == $locale && value != null]) > 0]{
    "slug": slug.current
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    "title":       coalesce(title[language == $locale][0].value, title[0].value),
    "body":        coalesce(body[language == $locale][0].value,  body[0].value),
    // Optional hand-written description; the page falls back to the opening of
    // the body text when this is empty.
    "seoDescription": coalesce(seoDescription[language == $locale][0].value, seoDescription[0].value),
    publishedAt,
    mainImage{ asset, alt },
    images[]{ asset, alt },
    "categories": categories[]->{
      "title": coalesce(title[language == $locale][0].value, title[0].value),
      "slug":  slug.current
    },
    // Neighbours in the listing order used by the index and the category
    // pages (publishedAt desc, _id asc), so walking the links walks the site's
    // own sequence: "previous" is the entry before this post (newer), "next"
    // the one after it (older). The _id comparisons break ties for posts that
    // share one timestamp — without them whole groups of same-day posts would
    // have no neighbours at all.
    "previousPost": *[
      _type == "post"
      && count(title[language == $locale && value != null]) > 0
      && defined(publishedAt)
      && defined(^.publishedAt)
      && (publishedAt > ^.publishedAt
          || (publishedAt == ^.publishedAt && _id < ^._id))
    ] | order(publishedAt asc, _id desc)[0]{
      "title": coalesce(title[language == $locale][0].value, title[0].value),
      "slug":  slug.current
    },
    "nextPost": *[
      _type == "post"
      && count(title[language == $locale && value != null]) > 0
      && defined(publishedAt)
      && defined(^.publishedAt)
      && (publishedAt < ^.publishedAt
          || (publishedAt == ^.publishedAt && _id > ^._id))
    ] | order(publishedAt desc, _id asc)[0]{
      "title": coalesce(title[language == $locale][0].value, title[0].value),
      "slug":  slug.current
    }
  }
`);

export const POSTS_INDEX_QUERY = defineQuery(`
  *[_type == "post" && count(title[language == $locale && value != null]) > 0]
    | order(publishedAt desc, _id asc){
    "title":     coalesce(title[language == $locale][0].value, title[0].value),
    "slug":      slug.current,
    publishedAt,
    mainImage{ asset, alt },
    images[]{ asset, alt }
  }
`);

// ───── Categories ──────────────────────────────────────────────────────────

export const CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "category" && count(title[language == $locale && value != null]) > 0]{
    "slug": slug.current
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    "title":       coalesce(title[language == $locale][0].value, title[0].value),
    "description": coalesce(description[language == $locale][0].value, description[0].value),
    "slug":        slug.current,
    "posts": *[_type == "post" && references(^._id)
      && count(title[language == $locale && value != null]) > 0]
      | order(publishedAt desc, _id asc){
      "title":     coalesce(title[language == $locale][0].value, title[0].value),
      "slug":      slug.current,
      publishedAt,
      mainImage{ asset, alt },
      images[]{ asset, alt }
    }
  }
`);

// ───── Pages ───────────────────────────────────────────────────────────────

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && count(title[language == $locale && value != null]) > 0]{
    "slug": slug.current
  }
`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    "title":          coalesce(title[language == $locale][0].value, title[0].value),
    "body":           coalesce(body[language == $locale][0].value, body[0].value),
    "seoDescription": coalesce(seoDescription[language == $locale][0].value, seoDescription[0].value),
    "slug":           slug.current,
    ogImage
  }
`);

// ───── Contact page ────────────────────────────────────────────────────────
// A singleton of its own type (not a `page`), because /contact is a
// template-owned route: the Studio entry opens it by fixed id, so there is no
// slug to get wrong and no way to create a second one. Everything here is
// editorial copy; the form's fields and Zod rules live in the island.

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0]{
    "title":          coalesce(title[language == $locale][0].value, title[0].value),
    "body":           coalesce(body[language == $locale][0].value, body[0].value),
    "seoDescription": coalesce(seoDescription[language == $locale][0].value, seoDescription[0].value),
    ogImage,
    // Wording of the form chrome. The island falls back to its built-in
    // localized strings for anything left empty here.
    "contactForm": contactForm{
      "heading":      coalesce(heading[language == $locale][0].value, heading[0].value),
      "submitLabel":  coalesce(submitLabel[language == $locale][0].value, submitLabel[0].value),
      "successTitle": coalesce(successTitle[language == $locale][0].value, successTitle[0].value),
      "successBody":  coalesce(successBody[language == $locale][0].value, successBody[0].value)
    },
    // The column of other ways to get in touch. An empty array or missing
    // object means the page renders the form alone.
    "contactDetails": contactDetails{
      "title": coalesce(title[language == $locale][0].value, title[0].value),
      items[]{ platform, value, label }
    }
  }
`);

// ───── Site Settings + Footer ──────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    "title":       coalesce(title[language == $locale][0].value, title[0].value),
    "description": coalesce(description[language == $locale][0].value, description[0].value),
    siteUrl,
    ogImage,
    // The menu is its own singleton (see structure.ts), so it is fetched by
    // type instead of through a reference on this document.
    "navigation": *[_type == "navigation"][0]{
      // Contact is a template-owned route (no document to reference), so the
      // menu gets an explicit switch + label for it. A missing field means the
      // site predates this setting: default to showing the link.
      "showContact": showContact != false,
      "contactLabel": coalesce(contactLabel[language == $locale][0].value, contactLabel[0].value),
      items[]{
        "label": coalesce(label[language == $locale][0].value, label[0].value),
        href,
        "internalRef": internalRef->{ _type, "slug": slug.current }
      }
    }
  }
`);

export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer"][0]{
    instagramURL,
    cellNumber,
    email,
    "address":   coalesce(address[language == $locale][0].value, address[0].value),
    "copyright": coalesce(copyright[language == $locale][0].value, copyright[0].value)
  }
`);

// ───── Theme ───────────────────────────────────────────────────────────────
// Deliberately locale-free: the color palette and the font choices are
// language-neutral, so this query takes no `$locale` param and no localized
// document exists. `light` / `dark` are `themePalette` objects holding one hex
// string per design token; `fonts` holds the two Google Fonts family names.
// `src/lib/theme.ts` turns both into CSS variables (and, for the fonts, the
// stylesheet URL rendered by the base layout).

export const THEME_QUERY = defineQuery(`
  *[_type == "theme"][0]{
    radius,
    light,
    dark,
    fonts
  }
`);
