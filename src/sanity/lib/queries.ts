import { defineQuery } from "groq";

// ───── Posts ───────────────────────────────────────────────────────────────
// The `count(... > 0` filter is the i18n correctness guard: only emit a path
// when this locale actually has content. Without it, getStaticPaths produces
// broken half-rendered pages for missing translations.

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && count(title[_key == $locale && value != null]) > 0]{
    "slug": slug.current
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    "title":       coalesce(title[_key == $locale][0].value, title[0].value),
    "body":        coalesce(body[_key == $locale][0].value,  body[0].value),
    publishedAt,
    mainImage{ asset, alt },
    "author": author->{
      name,
      "slug": slug.current,
      image
    },
    "categories": categories[]->{
      "title": coalesce(title[_key == $locale][0].value, title[0].value),
      "slug":  slug.current
    }
  }
`);

export const POSTS_INDEX_QUERY = defineQuery(`
  *[_type == "post" && count(title[_key == $locale && value != null]) > 0]
    | order(publishedAt desc){
    "title":     coalesce(title[_key == $locale][0].value, title[0].value),
    "slug":      slug.current,
    publishedAt,
    mainImage{ asset, alt }
  }
`);

// ───── Categories ──────────────────────────────────────────────────────────

export const CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "category" && count(title[_key == $locale && value != null]) > 0]{
    "slug": slug.current
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    "title":       coalesce(title[_key == $locale][0].value, title[0].value),
    "description": coalesce(description[_key == $locale][0].value, description[0].value),
    "slug":        slug.current,
    "posts": *[_type == "post" && references(^._id)
      && count(title[_key == $locale && value != null]) > 0]
      | order(publishedAt desc){
      "title":     coalesce(title[_key == $locale][0].value, title[0].value),
      "slug":      slug.current,
      publishedAt,
      mainImage{ asset, alt }
    }
  }
`);

// ───── Authors ─────────────────────────────────────────────────────────────

export const AUTHOR_SLUGS_QUERY = defineQuery(`
  *[_type == "author" && defined(slug.current)]{ "slug": slug.current }
`);

export const AUTHOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "author" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    image,
    "bio": coalesce(bio[_key == $locale][0].value, bio[0].value),
    "posts": *[_type == "post" && references(^._id)
      && count(title[_key == $locale && value != null]) > 0]
      | order(publishedAt desc){
      "title":     coalesce(title[_key == $locale][0].value, title[0].value),
      "slug":      slug.current,
      publishedAt,
      mainImage{ asset, alt }
    }
  }
`);

// ───── Pages ───────────────────────────────────────────────────────────────

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && count(title[_key == $locale && value != null]) > 0]{
    "slug": slug.current
  }
`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    "title":          coalesce(title[_key == $locale][0].value, title[0].value),
    "body":           coalesce(body[_key == $locale][0].value, body[0].value),
    "seoDescription": coalesce(seoDescription[_key == $locale][0].value, seoDescription[0].value),
    "slug":           slug.current,
    ogImage
  }
`);

// ───── Site Settings + Footer + Landing ────────────────────────────────────

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    "title":       coalesce(title[_key == $locale][0].value, title[0].value),
    "description": coalesce(description[_key == $locale][0].value, description[0].value),
    siteUrl,
    ogImage,
    "primaryNav": primaryNav->{
      items[]{
        "label": coalesce(label[_key == $locale][0].value, label[0].value),
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
    "address":   coalesce(address[_key == $locale][0].value, address[0].value),
    "copyright": coalesce(copyright[_key == $locale][0].value, copyright[0].value)
  }
`);

export const LANDING_QUERY = defineQuery(`
  *[_type == "landing"][0]{
    "title":       coalesce(title[_key == $locale][0].value, title[0].value),
    landingImage{ asset, alt },
    image{ asset, alt },
    "ctaText":    coalesce(ctaText[_key == $locale][0].value, ctaText[0].value),
    "ctaBtnText": coalesce(ctaBtnText[_key == $locale][0].value, ctaBtnText[0].value)
  }
`);
