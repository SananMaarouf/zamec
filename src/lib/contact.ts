import type { Locale } from "@/sanity/lib/locale";

// The contact page is a template-owned route (`/contact`, `/nb/contact`) whose
// heading and intro come from the CMS `page` document with this slug. Because
// the route is static, the generic `[page]` routes must skip this slug or
// Astro renders it twice and warns about the conflict.
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
