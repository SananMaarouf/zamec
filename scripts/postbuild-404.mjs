// Cloudflare's `assets.not_found_handling: "404-page"` serves the **nearest**
// `404.html` file, and Astro only emits `404.html` at the root of `dist/`: a
// nested `404.astro` becomes `<dir>/404/index.html`. So the Norwegian 404 is
// copied to `dist/nb/404.html` after the build — that is the file an unmatched
// `/nb/...` request resolves to, which is what nginx's `error_page 404 /nb/404`
// used to provide. Without it, Norwegian visitors would get the English root 404.
//
// Runs as part of `npm run build`, so Workers Builds and `npm run cf:*` all get it.
import { access, copyFile } from "node:fs/promises";

const from = "dist/nb/404/index.html";
const to = "dist/nb/404.html";

try {
  await access(from);
} catch {
  console.error(`[postbuild-404] missing ${from} — did src/pages/nb/404.astro render?`);
  process.exit(1);
}

await copyFile(from, to);
console.log(`[postbuild-404] ${from} -> ${to}`);
