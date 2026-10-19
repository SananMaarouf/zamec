import { createClient } from '@sanity/client';

/**
 * Shared read-only Content Lake client.
 *
 * Replaces the `sanity:client` virtual module that `@sanity/astro` injects.
 * The site is fully static, so every query runs at build time and the client
 * never ships to the browser. `useCdn: false` keeps builds reading fresh
 * documents (published perspective — drafts never reach production).
 */

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity credentials: set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET in .env'
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-09-21',
  useCdn: false,
  perspective: 'published',
});
