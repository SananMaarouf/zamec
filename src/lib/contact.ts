import type { Locale } from "@/sanity/lib/locale";

// The contact page is a template-owned route (`/contact`, `/nb/contact`) and
// its copy lives on the `contactPage` singleton — not on a `page` document.
// The generic `[page]` routes nevertheless skip any page whose slug is
// `contact`: a site that still has the old contact `page` document (or an
// editor who titles a page "Contact") would otherwise emit the same
// `dist/contact/index.html` twice and Astro would warn about the conflict.
export const CONTACT_SLUG = "contact";

/**
 * Copy an editor may rewrite for the form itself (the `contactForm` object on
 * the `page` document). Every key is optional: the island keeps its built-in
 * localized defaults and only replaces what is filled in.
 *
 * Validation messages are deliberately *not* here — they are worded to match
 * the Zod rules in `contact-form.tsx` (min/max lengths), and an editorial edit
 * could promise a limit the schema does not enforce.
 */
export interface ContactFormOverrides {
  /** Heading above the form, e.g. "Send me a message". Empty = no heading. */
  heading?: string | null;
  /** Label of the send button. Empty = "Send message" / "Send melding". */
  submitLabel?: string | null;
  /** Heading of the thank-you panel. */
  successTitle?: string | null;
  /** Body text of the thank-you panel. */
  successBody?: string | null;
}

/** Platforms the contact page knows how to draw an icon and link for. */
export const CONTACT_PLATFORMS = [
  "phone",
  "email",
  "instagram",
  "facebook",
  "youtube",
  "website",
] as const;

export type ContactPlatform = (typeof CONTACT_PLATFORMS)[number];

/** One row of the "other ways to get in touch" column. */
export interface ContactChannel {
  platform?: ContactPlatform | string | null;
  /** Phone number, email address, or a full URL — see `channelHref`. */
  value?: string | null;
  /** Optional override for the visible text. */
  label?: string | null;
}

/** The whole optional column; nothing renders when `items` is empty. */
export interface ContactDetailsData {
  title?: string | null;
  items?: ContactChannel[] | null;
}

// Props for the contact form island. The endpoint is read at build time from
// the FORMSPREE_URL env var (see `src/pages/contact.astro`) and baked into the
// static HTML, so it is public by design — a Formspree form id is not a secret.
interface ContactFormProps {
  endpoint?: string;
  locale?: Locale;
  className?: string;
  /** CMS copy overrides; anything left empty falls back to the defaults. */
  overrides?: ContactFormOverrides;
  onSuccess?: () => void;
}

export type { ContactFormProps };
