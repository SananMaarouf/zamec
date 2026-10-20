# SEO upgrade plan — for every other Astro + Sanity project

Zamec is built on the same starter as the rest of the client sites, so the SEO work
committed in `97f7e48` is the reference implementation. This is the checklist to take
each other project from "no sitemap, no structured data" to the same state.

Work one project at a time, one branch per project, and finish the verification step
before moving on. Everything below was verified on Zamec — the commands and expected
output are real, not aspirational.

---

## 0. Measure the project before touching it

```bash
git checkout -b seo-baseline
PUBLIC_SITE_URL=https://<real-origin> npm run build
grep -c '<loc>' dist/sitemap-0.xml 2>/dev/null || echo "no sitemap"
ls public/robots.txt src/pages/robots.txt.ts 2>/dev/null || echo "no robots"
python3 - <<'EOF'
import re,glob
for f in sorted(glob.glob('dist/**/index.html',recursive=True))[:5]:
    h=open(f).read()
    print(f, 'h1=',len(re.findall(r'<h1',h)), 'ld=', 'ld+json' in h,
          'og:type=', (re.search(r'og:type" content="([^"]+)',h) or ['','?'])[1])
EOF
```

Write down which of these are missing: sitemap, robots with a `Sitemap:` line, an `h1`
on the home page, JSON-LD, `og:type=article` on detail pages, description length.

---

## 1. Copy these files verbatim (they are project-agnostic)

| File | Why it is safe to copy as-is |
|---|---|
| `src/lib/seo.ts` | Pure helpers: `metaDescription()` and `textFromBlocks()`. No config. |
| `src/pages/robots.txt.ts` | Reads `site` from Astro config, so the host follows `PUBLIC_SITE_URL`. Never hard-code a domain. |
| `src/components/SEO.astro` | Takes everything from props + the `siteSettings` query. Only edit if the project's query keys differ (see step 4). |

```bash
# from the zamec repo
for f in src/lib/seo.ts src/pages/robots.txt.ts src/components/SEO.astro; do
  cp "/path/to/zamec/$f" "<target-repo>/$f"
done
```

If the target project keeps `SEO.astro` at another path, copy the *contents* rather
than the file.

---

## 2. Sitemap: dependency + integration

```bash
npm i @astrojs/sitemap
```

In `astro.config.mjs`:

```js
import sitemap from '@astrojs/sitemap';

integrations: [
  react(),
  sitemap({
    filter: (page) => !new URL(page).pathname.match(/\/404\/?$/),
    // Trailing-slash URLs: the form static output is served at, and the form
    // SEO.astro uses for the canonical.
    serialize: (item) => {
      const url = new URL(item.url);
      if (!url.pathname.endsWith('/')) url.pathname = `${url.pathname}/`;
      item.url = url.toString();
      return item;
    },
  }),
],
```

Requirements:

- `site:` must be set in `astro.config.mjs` (most of the starters already read
  `PUBLIC_SITE_URL`; if a project does not, add it).
- `PUBLIC_SITE_URL` **must equal** the `Site URL` in the Studio's Site Settings,
  because canonicals come from the CMS and the sitemap comes from the env var. If they
  differ you ship two conflicting sets of URLs.

---

## 3. Layout + home-page H1

In `Layout.astro`:

1. Add to `Props`: `type?: "website" | "article"`, `publishedAt?: string`,
   `isHome?: boolean`.
2. Destructure them with defaults (`type = "website"`, `isHome = false`).
3. Pass `type` and `publishedAt` through to `<SEO … />`.
4. Inside `<main>`, before `<slot />`:

```astro
{isHome && <h1 class="sr-only">{navTitle}</h1>}
```

`navTitle` is the CMS site title, which is already in scope and localized. Use
`sr-only` (Tailwind) rather than a visible heading so the design does not change.

Then mark the home route(s) `<Layout … isHome>` — every locale's index page.

> If the project's home page *does* render a visible heading, do not use this: change
> the existing element to `h1` instead. One `h1` per page.

---

## 4. Detail pages: article type and description fallback

For each post/detail route (`src/pages/post/[slug].astro` and the localized twin):

```astro
<Layout
  title={post.title}
  description={post.seoDescription ?? textFromBlocks(post.body)}
  image={post.mainImage ?? post.images?.[0]}
  path={`/post/${slug}`}
  type="article"
  publishedAt={post.publishedAt}
>
```

`textFromBlocks` replaces the old `post.body?.[0]?.children?.[0]?.text` one-liner,
which only captured the first inline span of the first block.

**Query change** — add the field to the by-slug GROQ query in
`src/sanity/lib/queries.ts`:

```groq
"seoDescription": coalesce(seoDescription[language == $locale][0].value, seoDescription[0].value),
```

Watch out: GROQ queries live inside template literals, so **a backtick inside a
comment breaks the file**. Use no backticks in comments there.

Also check the project's `SEO.astro` reads `settings.ogImage` and `settings.siteUrl`.
If a project named those differently (older starters use `defaultOgImage`), adjust the
imported file instead of copying blindly.

---

## 5. Schema: the fields editors actually fill in

Per-project schemas differ, so patch rather than copy. For each document type that has
an SEO description and each image field:

```ts
// 1) optional description on detail documents that lack it
defineField({
  name: "seoDescription",
  title: "SEO description",
  type: "internationalizedArrayText",
  description:
    "The sentence shown under the title in Google results and when the link is shared. Aim for 120–160 characters; search engines cut longer text. Leave empty to use the opening of the text.",
  validation: (rule) =>
    rule
      .custom((items: any) =>
        Array.isArray(items) && items.some((item) => (item?.value?.length ?? 0) > 160)
          ? "One of these is longer than 160 characters — search results and link previews will cut it off."
          : true
      )
      .warning(),
}),

// 2) warn (do not block) on images with no alt text
validation: (rule) =>
  rule
    .custom((value: any) =>
      value ? true : "No alternative text: screen readers and search engines cannot tell what this image shows."
    )
    .warning(),
```

Use `.warning()`, never `.error()`: existing documents would otherwise become
unpublishable, and a half-edited client site is worse than a missing alt.

After editing schemas:

```bash
npm run sanity:codegen     # schema extract + typegen
```

`src/sanity/sanity.types.ts` is generated — commit it, never hand-edit.

---

## 6. Verify (do not skip)

```bash
npx astro check
PUBLIC_SITE_URL=https://<real-origin> npm run build
```

Then:

```bash
# sitemap exists and excludes 404s
grep -o '<loc>[^<]*' dist/sitemap-0.xml | wc -l
grep -c '404' dist/sitemap-0.xml || echo "no 404 in sitemap"
cat dist/robots.txt

# every indexable page has parseable JSON-LD with absolute ids
python3 - <<'EOF'
import re,json,glob
bad=0
for f in sorted(glob.glob('dist/**/index.html',recursive=True)):
    h=open(f).read()
    m=re.search(r'<script type="application/ld\+json">(.*?)</script>',h,re.S)
    if not m:
        if 'rel="canonical"' in h: print('MISSING LD',f); bad+=1
        continue
    ld=json.loads(m.group(1))
    node=[n for n in ld['@graph'] if n.get('@type')!='WebSite'][0]
    if not str(node.get('@id','')).startswith('https://'): print('BAD id',f); bad+=1
print('problems:',bad)
EOF
```

Expected: `problems: 0`, robots has a `Sitemap:` line, and the filled-in home page has
an `h1`. Spot-check one detail page's `<head>` for `og:type="article"`,
`article:published_time`, `og:image:width/height`.

Finally, after deploying:

- `https://<origin>/robots.txt` and `/sitemap-index.xml` return 200 (not an edge-cached
  file from Cloudflare — see gotcha 1).
- Paste a detail URL into <https://validator.schema.org/> and Google's Rich Results
  Test. Both should find `BlogPosting` with zero errors.

---

## 7. Gotchas that cost time on Zamec

1. **Cloudflare can shadow your robots.txt.** On Zamec the live `/robots.txt` was
   Cloudflare's managed "content signals" file with `cache-control: max-age=604800`
   and no `Sitemap:` line, even though the repo had none. If the deployed file does not
   match `dist/robots.txt`, disable the managed robots.txt in the Cloudflare dashboard
   (AI Crawl Control / managed robots.txt) and purge the cache. Adding the file to
   `public/` alone does not win.
2. **`npm run sanity:build` wipes `dist/`.** It builds the Studio into the same output
   folder with its own `index.html`. Never run it between `npm run build` and the
   deploy step, and never point a Docker `COPY` at `dist/` after it.
3. **`PUBLIC_SITE_URL` is localhost in `.env`.** Build with
   `PUBLIC_SITE_URL=https://<origin>` when checking SEO output locally, or every
   sitemap URL will say `http://localhost:4321`. CI gets the real value from repo
   secrets — confirm the secret exists before trusting a deploy.
4. **www vs apex both answer 200.** Canonicalise in one place (DNS/proxy 301) or accept
   that the canonical tag does the work. Pick one host and keep `Site URL`,
   `PUBLIC_SITE_URL` and the sitemap on it.
5. **Description length is a Studio problem, not a code problem.** Trimming in code
   hides the issue from the person writing it; that is why the warning lives on the
   field.

---

## 8. Deliberately not done (decide per project)

- **RSS/Atom feed** — add `@astrojs/rss` if the client wants one; nothing else here
  depends on it.
- **`Organization` instead of `Person`** — Zamec is a personal portfolio, so the home
  page emits `Person`. For company sites, swap that node in `SEO.astro` and add
  `logo`, `sameAs` (social URLs) and `vatID`/`address` if relevant.
- **`twitter:site` / `creator`** — needs a real handle per project; add it when the
  client has one.
- **Search Console / Bing verification** — per project, do it at launch, then submit
  `sitemap-index.xml`.
- **`robots.txt` disallow rules for staging** — if the project has a staging
  deployment, add a separate `robots.txt` there rather than in the shared template.

---

## 9. Template-level follow-up

The starters are separate repos; Zamec got the change first. For each starter:

1. Apply steps 1–5 on a branch.
2. Run step 6 and paste the output in the PR description.
3. Bump the template's `package.json` version and note the new files in its README
   ("What this template includes" + the file map).
4. Only then copy the result into client projects that have diverged, as those need
   the step 4–5 patches applied by hand rather than a file copy.
