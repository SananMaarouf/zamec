import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV ?? '',
  process.cwd(),
  ''
);

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
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
      apiVersion: '2025-09-21',
    }),
    react(),
  ],
});
