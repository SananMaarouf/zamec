import { loadEnv } from 'vite';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Vite loads PUBLIC_* into import.meta.env for src; loadEnv here is only used
// for `site`, which Astro reads at config time.
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
  integrations: [react()],
});
