import type { APIRoute } from "astro";

export const prerender = true;

/**
 * robots.txt is generated rather than kept in `public/` so the sitemap URL
 * follows `site` (PUBLIC_SITE_URL) instead of being hard-coded per project.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? "http://localhost:4321").replace(/\/$/, "");

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
