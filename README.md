# Astro × Sanity × i18n Starter

A template for multilingual static websites using **Astro 7**, **Sanity 6**, and
**TypeScript**.

This README is written to be useful both for:
1. **First-time users** setting up the template.
2. **Returning users** who need a quick re-onboarding months later.

## Returning in 6 months? Start here

Use this exact sequence:

```bash
git pull
npm install
cp .env.example .env   # only if .env is missing
npm run sanity:codegen
npm run sanity:dev   # terminal 1 — Studio at http://localhost:3333
npm run dev          # terminal 2 — Site at http://localhost:4321
```

Then confirm:
1. Site opens at <http://localhost:4321>
2. Content appears in both `en` and `nb` where translations exist

For content editing, run Studio in a separate terminal:
```bash
npm run sanity:dev
```
Studio opens at <http://localhost:3333> (or use the hosted Sanity Studio at manage.sanity.io).

## What this template includes

- Astro static site output (Studio runs separately, not embedded)
- Locale-aware routing (`en` default, `nb` secondary)
- Localized Sanity fields via `sanity-plugin-internationalized-array`
- Centralized, typed GROQ queries in `src/sanity/lib/queries.ts`
- Prebuilt schemas: `siteSettings`, `navigation`, `footer`, `page`,
  `post`, `category`, `author`, `theme`, and `blockContent`
- CMS-driven color palette: clients edit the light/dark theme tokens in the
  Studio instead of touching `src/styles/global.css` (see
  [Theme: colors and fonts from the CMS](#theme-colors-and-fonts-from-the-cms))
- CMS-driven typography: two Google Fonts (headings + body) picked from a
  previewed catalog in the same **Theme** document
- Tailwind CSS + shadcn UI setup

## Prerequisites

Install before starting:

1. **Node.js 22.22+** (required by Astro 7 and Sanity 6; the image builds on `node:24-alpine`)
2. **npm 10+** (bundled with modern Node)
3. **Sanity account** (free tier is fine)
4. **Git**

## First-time setup (foolproof path)

### 1) Create your repository from this template

On GitHub:
1. Click **Use this template**
2. Create your new repository
3. Clone it locally

```bash
git clone <your-new-repo-url> my-site
cd my-site
```

### 2) Install project dependencies

```bash
npm install
```

### 3) Create or choose a Sanity project

If you need a new one:

```bash
npm run sanity:login
npm run sanity:create-project -- --display-name "My Site"
```

Save the **project ID** and **dataset name** (`production` is typical).

### 4) Create `.env`

```bash
cp .env.example .env
```

Set values:

```env
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SITE_URL="http://localhost:4321"
```

### 5) Keep Astro and Studio targeting the same Sanity project

This template has two config entry points:

1. `.env` (used by Astro integration + `sanity.cli.ts`)
2. `sanity.config.ts` (used by Studio config)

Open `sanity.config.ts` and set:

```ts
projectId: "your-project-id",
dataset: "production",
```

If these values do not match `.env`, you may see content/schema mismatches.

### 6) Add local CORS origin

```bash
npm run sanity:cors-add -- http://localhost:4321 --credentials
```

This is required for the Astro dev server to query Sanity.

### 7) Generate schema/query types

```bash
npm run sanity:codegen
```

Run this any time you change:
- Sanity schemas
- Query selections in GROQ files

### 8) Start Studio and create required content

Start Studio in a second terminal:
```bash
npm run sanity:dev
```

Studio opens at <http://localhost:3333>. The layout expects singleton content — create these before running the Astro dev server:

| Document type | Why it matters | Minimum fields to fill |
|---|---|---|
| `Site Settings` | Global title + nav reference + SEO defaults | `title` (`en`, `nb`), `primaryNav` reference |
| `Navigation` | Main menu rendering | `title`, at least 1 `items[]` row with `label` + (`href` or `internalRef`) |
| `Footer` | Footer text/contact section | `address` (`en`, `nb`) and/or `copyright` |
| `Theme` | Site color palette (light + dark) and the two Google Fonts | nothing — every color and font starts at the template default |

Optional but recommended:
- `post`, `author`, and `category` to validate list/detail routes
- `page` to validate CMS-driven `/{locale}/[page]` routes

Publish all documents in Studio, then move on.

### 9) Run the Astro dev server

```bash
npm run dev
```

Open <http://localhost:4321> — content should appear in both `en` and `nb` where translations exist.

## Daily development workflow

When actively building:

1. Pull latest code and install deps after lockfile changes:
   ```bash
   git pull
   npm install
   ```
2. Start both servers (separate terminals):
   ```bash
   npm run sanity:dev   # terminal 1 — Studio at http://localhost:3333
   npm run dev          # terminal 2 — Astro at http://localhost:4321
   ```
3. If you changed schema/query types:
   ```bash
   npm run sanity:codegen
   ```
4. Before deploying:
   ```bash
   npm run build
   ```

## Locale behavior (important)

- Default locale is `en`
- Secondary locale is `nb`
- A localized page/post appears for a locale only when that locale has content
  for required localized fields

That means "missing page in one locale" is often data-related, not routing-related.

## Adding a new locale

For example, add `fr` in **all three places**:

1. `astro.config.mjs` → `i18n.locales`
2. `sanity.config.ts` → `internationalizedArray({ languages: [...] })`
3. `src/sanity/lib/locale.ts` → `LOCALES`

Then run:

```bash
npm run sanity:codegen
```

Restart `npm run dev` and add translations in Studio for existing documents.

## Theme: colors and fonts from the CMS

The palette and the fonts live in Sanity, not in a CSS file. Open **Theme** in
the Studio (<http://localhost:3333> → Theme), which has three tabs: **Colors**,
**Fonts** and **Layout**.

### Colors

- **Light mode / Dark mode** — 37 design tokens that every Tailwind/shadcn utility
  reads. Each one has a swatch picker plus a hex field and a starter value, so you
  only change what you want. The custom input shows a live preview of the palette
  plus a swatch grid.
- The 19 everyday tokens (`background`, `foreground`, `primary`, `border`, …) are
  always visible. The 18 rarely-touched ones (charts, sidebar, gradients,
  `muted-2`) live in a collapsed **Advanced** group.
- **Corner radius** — rounding for buttons, cards and inputs.
- Unset colors fall back to the starter palette, so a half-filled document still
  renders a complete, working site.

How it flows:

1. `src/sanity/schemaTypes/theme.ts` defines the `theme` document (a `themePalette`
   object used twice: light + dark).
2. `THEME_QUERY` in `src/sanity/lib/queries.ts` fetches it — **locale-free**.
3. `themeToCss()` in `src/lib/theme.ts` turns it into CSS custom properties.
4. `src/layouts/Layout.astro` inlines those properties into `<head>` of every page.

### Fonts (Google Fonts)

Two pickers choose the families the site loads from Google Fonts — one for
headings, one for everything else. Nothing is downloaded until you pick
something.

- **Heading font** — `H1`–`H6` in articles and pages, plus the site name.
- **Body font** — paragraphs, cards, buttons, navigation, captions. Buttons and
  form controls come along for free (Tailwind's preflight makes them inherit).
- **Site default** (the starting value for both) loads nothing and keeps the
  built-in stacks: body = the `--font-sans` stack, heading = the body font. A
  site that never opens this tab renders exactly as before.
- Choosing a body font on its own is fine: headings then follow it, because
  `global.css` defines `--font-heading: var(--font-body)`.
- The picker renders every family **in its own typeface** with a search box, and
  loads them lazily as rows scroll into view, so opening the tab costs one
  stylesheet and nothing else. The **Fonts** tab also shows a live headline +
  body-copy sample above the pickers.
- ~50 curated families across sans serif, serif, display, monospace and
  handwriting. A free-text field would be smaller, but a family Google does not
  have renders as a silent fallback with no error in either the Studio or the
  build.

How it flows:

1. `src/lib/google-fonts.ts` is the catalog: family name, category, the Google
   Fonts CSS2 axis parameter, and the fallback stack. It is imported by both the
   Studio and the site, so adding a font there makes it pickable in the Studio.
2. The two choices are stored on the same `theme` singleton as the colors
   (`fonts.heading` / `fonts.body`) — no separate document, no second fetch.
3. `themeToCss()` in `src/lib/theme.ts` emits `--font-body` / `--font-heading`
   into the same `html:root` block as the colors, and `themeFontsHref()` builds
   the stylesheet URL. `src/layouts/Layout.astro` renders that as a
   `<link rel="stylesheet">` plus two `preconnect`s. With **Site default** on
   both, no request to `fonts.googleapis.com` happens at all — the `<link>` is
   simply not emitted.
4. `src/styles/global.css` consumes the two variables: `body {
   font-family: var(--font-body) }`, `h1…h6 { font-family: var(--font-heading) }`,
   and `.font-heading` / `.font-body` utilities for anything else.

Adding a font to the catalog:

1. Find the family on [Google Fonts](https://fonts.google.com).
2. Read its exact axis spec from `https://fonts.google.com/metadata/fonts` (the
   `axes` field for variable families, the `fonts` keys for static ones) and add
   an entry to `GOOGLE_FONTS`.
3. Verify the URL the site will build actually loads:
   ```bash
   curl -sI "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
   ```
   **Do not guess weights.** The CSS2 endpoint answers `400` for the *whole*
   request when a single requested value does not exist (`Bebas Neue:wght@400;700`
   — that family ships one weight), which silently drops the font from the page
   with no error in the Studio or the build. Everything already in the catalog
   was checked this way. Variable families are requested as a range, static ones
   only for the weights the design uses.
4. `npm run sanity:codegen`, so the Studio types include the new family.

i18n notes:

- **The palette and the fonts are language-neutral and are not localized.** There
  is no `language` field, no `internationalizedArray` wrapping, and a single
  lang-agnostic singleton id (`theme`). Colors do not translate and fonts do not
  either; a per-locale copy would silently split the theme and make the site
  depend on which doc the query picked up.
- `THEME_QUERY` takes **no `$locale` param** (`*[_type == "theme"][0]`), unlike the
  other queries. Every locale gets the same palette and the same two fonts, and
  each page links the identical Google Fonts stylesheet — so switching locale
  client-side needs nothing persisted.
- The palette is fetched once per build, not once per page: `src/sanity/lib/theme-query.ts`
  memoizes the promise, so with routes × locales pages the extra GROQ round-trip
  happens only once. The cache is **bypassed under `astro dev`** (`import.meta.env.DEV`):
  module state lives for the whole dev-server session, so a cached promise would pin
  the first palette and a color published in the Studio would only appear after
  restarting the server. In dev the query runs per request, so a browser refresh
  picks up the change.

Other notes:

- The generated CSS uses `html:root` / `html.dark` selectors on purpose: they beat
  the `:root` / `.dark` defaults in `global.css` on specificity, which is what makes
  the CMS values win both in `astro dev` (Vite injects the imported stylesheet at
  runtime) and in a production build (Astro hoists the stylesheet to the end of
  `<head>`). Do not replace them with plain `:root` / `.dark`.
- The starter palette in `src/lib/theme-tokens.ts` is the exact sRGB equivalent of
  the original `oklch(...)` values, which stay in `global.css` as the fallback used
  when no `Theme` document exists. Those `muted-2` / `gradient-*` fallbacks were
  rewritten because the original shadcnblocks values used the invalid
  `oklch(92.5%, 0%, 89.876%)` form (comma syntax + `%` hue), which browsers reject.
- Palettes are stored as plain hex strings, not `@sanity/color-input` objects. That
  plugin writes 18 attributes per color, which pushes a full light+dark palette past
  Sanity's 1000-attribute-per-document limit (the site only ever reads the hex
  anyway). Hex strings keep the whole document at ~80 attributes — which is also why
  the fonts fit comfortably: each one is a single string.
- Fonts are **not** per-mode and are not duplicated into the dark block: they are
  emitted once in `html:root`, and because `html.dark` does not redeclare them the
  same values keep applying in dark mode. Only the colors have a dark block.
- `global.css` no longer `@import`s a Google Font. The Inter import that used to sit
  at the top of the file was dead (nothing referenced the `Inter` family — every
  `font-sans` resolved to the OS stack) and a hardcoded import would re-introduce a
  font the client has not selected. Fonts now arrive only through the `<link>`.
- The two font variables are consumed with plain CSS (`body`, `h1..h6`) and a small
  `@layer utilities` block rather than an `@theme inline { --font-heading:
  var(--font-heading) }` alias: the alias form emits a self-referential
  `:root { --font-heading: var(--font-heading) }`, which only resolves by luck of
  declaration order.
- The site is static (`output: 'static'`) and colors **and fonts** are read at build
  time, so a published change appears after a rebuild/redeploy. In `astro dev` the
  next request picks it up — including fonts, which ride the same memoized fetch.
- To add a token: add it to `THEME_TOKENS` in `src/lib/theme-tokens.ts` (the Sanity
  field name is derived), add the matching `--token` to `global.css`, then run
  `npm run sanity:codegen`.

## File map (where to edit what)

| Goal | File(s) |
|---|---|
| Change locales/default locale helpers | `src/sanity/lib/locale.ts` |
| Change Astro i18n routing | `astro.config.mjs` |
| Change Studio project/language plugin config | `sanity.config.ts` |
| Add/edit document schemas | `src/sanity/schemaTypes/*` |
| Change Studio sidebar organization | `src/sanity/structure.ts` |
| Color tokens + starter palette | `src/lib/theme-tokens.ts` |
| Google Fonts catalog (families, axis specs, fallback stacks) | `src/lib/google-fonts.ts` |
| CMS palette + fonts → CSS variables / stylesheet URL | `src/lib/theme.ts`, `src/layouts/Layout.astro` |
| Memoized theme fetch | `src/sanity/lib/theme-query.ts` |
| Studio inputs for the palette | `src/sanity/components/palette-preview.tsx`, `src/sanity/components/color-swatch-input.tsx` |
| Studio inputs for the fonts | `src/sanity/components/fonts-preview.tsx`, `src/sanity/components/font-select-input.tsx`, `src/sanity/components/load-google-font.ts` |
| Fallback palette / font stacks / base typography | `src/styles/global.css` |
| Add or adjust data fetching | `src/sanity/lib/queries.ts` |
| Update layouts/components | `src/layouts/*`, `src/components/*` |
| Update routes/pages | `src/pages/*` |
| 404 copy / markup | `src/components/NotFound.astro`; routes in `src/pages/404.astro` + `src/pages/[locale]/404.astro`; served by `nginx.conf` `error_page` |

## Command reference

| Command | Purpose |
|---|---|
| `npm run dev` | Run Astro dev server at http://localhost:4321 |
| `npm run build` | Build static production output to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run sanity:dev` | Run Sanity Studio directly |
| `npm run sanity:codegen` | Extract schema and generate `src/sanity/sanity.types.ts` |
| `npm run sanity:cors-add -- <origin> --credentials` | Allow frontend origin in Sanity CORS |
| `npm run sanity:dataset-list` | Show datasets in current Sanity project |

## Deployment (CI/CD → Dokploy)

Deploys are automated. Nothing is built locally or uploaded by hand:

```
push to main ──┐
Sanity webhook ─┴─▶ GitHub Actions (deploy.yml)
                     ├─ docker build (Astro build runs inside the image)
                     ├─ push <owner>/<image>:latest | :main | :<sha> to Docker Hub
                     └─ POST Dokploy deploy hook (trigger-deploy.yml) → pull + restart
```

- `.github/workflows/deploy.yml` — builds the image and pushes it. Triggers on pushes
  to `main`, on manual `workflow_dispatch`, and on `repository_dispatch: sanity-update`
  (content-only rebuilds reuse the Docker layer cache and only bust the `npm run build` step).
- `.github/workflows/trigger-deploy.yml` — calls the Dokploy deploy hook behind Cloudflare
  Access service auth. Reusable via `workflow_call` or runnable standalone.
- `Dockerfile` — `node:24-alpine` builds `dist/`, `nginxinc/nginx-unprivileged:alpine`
  serves it on port 8080 as non-root with the caching/security headers in `nginx.conf`.
- `docker-compose.yml` — local reproduction: `docker compose up --build` → <http://localhost:8080>.

### One-time setup

1. **Docker Hub repo** for the image (e.g. `sananmaarouf/zamec`).
2. **Dokploy application** using the `latest` image from that repo, exposed on port 8080.
3. **GitHub repository secrets**:

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub account (also the image namespace) |
| `DOCKERHUB_TOKEN` | Docker Hub access token, read/write |
| `DOCKERHUB_IMAGE_NAME` | Image name, e.g. `zamec` |
| `PUBLIC_SANITY_PROJECT_ID` | Baked into the build (public) |
| `PUBLIC_SANITY_DATASET` | Baked into the build (public) |
| `PUBLIC_SITE_URL` | Canonical origin, e.g. `https://zamec.no` |
| `DOKPLOY_DEPLOY_HOOK_URL` | Application deploy hook |
| `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET` | Cloudflare Access service token for the hook |

4. **Sanity webhook** (Manage → API → Webhooks) posting to
   `https://api.github.com/repos/SananMaarouf/zamec/dispatches` with
   `{"event_type": "sanity-update"}` so publishing content triggers a rebuild.
5. Add the production CORS origin, and deploy the Studio once:
   ```bash
   npm run sanity:cors-add -- https://your-site.example --credentials
   npm run sanity:deploy
   ```
   After this, edit content at the hosted Studio URL (`https://your-project.sanity.studio`).

Note: the image build runs `npm ci` **with** devDependencies — Astro, Tailwind and the
Sanity toolchain are build-time only for a static site, so never set `NODE_ENV=production`
in the builder stage.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Studio at `:3333` fails to load content | Missing CORS origin | `npm run sanity:cors-add -- http://localhost:4321 --credentials` |
| Studio shows unexpected project content | `sanity.config.ts` projectId/dataset mismatch | Align `sanity.config.ts` with `.env` values |
| `sanity:codegen` fails or types are stale | Schema extraction/typegen not rerun | `npm run sanity:codegen` |
| Some content appears in `en` but not `nb` | Missing translation values in localized fields | Add missing locale values in Studio |
| Build succeeds but page content is empty | Required singleton docs not created | Create `Site Settings`, `Navigation`, `Footer` |
| A font picked in the Studio does not show up on the site | Static output — fonts are read at build time | Rebuild/redeploy (`npm run build`); in `astro dev` a refresh is enough |
| Site renders in a fallback typeface, no error anywhere | The Google Fonts URL 400s, e.g. a weight the family does not ship | Check the `<link>` href from the page source with `curl -sI`; fix `query` in `src/lib/google-fonts.ts` (see [Fonts](#fonts-google-fonts)) |
| Studio warns “is not in the font catalog” | The stored value is not in `GOOGLE_FONTS` (e.g. family removed) | Pick a font again, or re-add the family to `src/lib/google-fonts.ts` |
| Heading font unchanged although only the body font was set | Expected: “Site default” means *follow the body font* | Pick an explicit heading font |

## References

- [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)
- [Sanity localization patterns](https://www.sanity.io/docs/studio/localization)
- [Sanity + Astro integration](https://www.sanity.io/docs/astro)
