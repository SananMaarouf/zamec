import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Vite loads PUBLIC_* into import.meta.env for src; loadEnv here is only used
// for `site`, which Astro reads at config time. The sitemap is built from the
// same value, so it must match the public origin exactly (no trailing slash) —
// keep PUBLIC_SITE_URL equal to the Site URL set in the Studio.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'http://localhost:4321',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nb'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      // Error pages must never be listed.
      filter: (page) => !new URL(page).pathname.match(/\/404\/?$/),
      // Emit trailing-slash URLs, the form static output is served at and the
      // form SEO.astro uses for the canonical.
      serialize: (item) => {
        const url = new URL(item.url);
        if (!url.pathname.endsWith('/')) url.pathname = `${url.pathname}/`;
        item.url = url.toString();
        return item;
      },
    }),
  ],
});
