import type { Locale } from "@/sanity/lib/locale";

// The contact page is a template-owned route (`/contact`, `/nb/contact`) whose
// heading and intro come from the CMS `page` document with this slug. Because
// the route is static, the generic `[page]` routes must skip this slug or
// Astro renders it twice and warns about the conflict.
export const CONTACT_SLUG = "contact";

// Props for the contact form island. The endpoint is read at build time from
// the FORMSPREE_URL env var (see `src/pages/contact.astro`) and baked into the
// static HTML, so it is public by design — a Formspree form id is not a secret.
interface ContactFormProps {
  endpoint?: string;
  locale?: Locale;
  className?: string;
  onSuccess?: () => void;
}

export type { ContactFormProps };
