# Astro × Sanity × i18n Starter

A template for multilingual static websites using **Astro 6**, **Sanity 5**, and
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
- Prebuilt schemas: `siteSettings`, `navigation`, `footer`, `landing`, `page`,
  `post`, `category`, `author`, and `blockContent`
- Tailwind CSS + shadcn UI setup

## Prerequisites

Install before starting:

1. **Node.js 20+**
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
| `Landing` | Homepage hero content | `title` (`en`, `nb`) and `ctaBtnText` (`en`, `nb`) |

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

## File map (where to edit what)

| Goal | File(s) |
|---|---|
| Change locales/default locale helpers | `src/sanity/lib/locale.ts` |
| Change Astro i18n routing | `astro.config.mjs` |
| Change Studio project/language plugin config | `sanity.config.ts` |
| Add/edit document schemas | `src/sanity/schemaTypes/*` |
| Change Studio sidebar organization | `src/sanity/structure.ts` |
| Add or adjust data fetching | `src/sanity/lib/queries.ts` |
| Update layouts/components | `src/layouts/*`, `src/components/*` |
| Update routes/pages | `src/pages/*` |

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

## Deployment checklist

Before production deploy:

1. Set production environment variables
2. Ensure `PUBLIC_SITE_URL` is your real domain
3. Add production CORS origin:
   ```bash
   npm run sanity:cors-add -- https://your-site.example --credentials
   ```
4. Deploy Sanity Studio (hosted, for browser-based content editing):
   ```bash
   npm run sanity:deploy
   ```
   After this, use the hosted Studio URL (e.g. `https://your-project.sanity.studio`) for all content changes instead of running `sanity:dev` locally.
5. Build:
   ```bash
   npm run build
   ```
6. Deploy `dist/` to your host (or add an Astro adapter for SSR targets)

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Studio at `:3333` fails to load content | Missing CORS origin | `npm run sanity:cors-add -- http://localhost:4321 --credentials` |
| Studio shows unexpected project content | `sanity.config.ts` projectId/dataset mismatch | Align `sanity.config.ts` with `.env` values |
| `sanity:codegen` fails or types are stale | Schema extraction/typegen not rerun | `npm run sanity:codegen` |
| Some content appears in `en` but not `nb` | Missing translation values in localized fields | Add missing locale values in Studio |
| Build succeeds but page content is empty | Required singleton docs not created | Create `Site Settings`, `Navigation`, `Footer`, `Landing` |

## References

- [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)
- [Sanity localization patterns](https://www.sanity.io/docs/studio/localization)
- [Sanity + Astro integration](https://www.sanity.io/docs/astro)
