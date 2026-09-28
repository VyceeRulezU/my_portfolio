# Victor Ironali — Portfolio

Portfolio site for Victor Ironali, Senior Product Designer & UX Engineer. Live at [ironali.com](https://ironali.com).

## Stack

- **App:** React 19, Vite 8, React Router 7, Framer Motion, Lucide icons
- **Content:** Markdown files in `content/projects/` (source of truth), compiled at build time. Sanity CMS (project `9hecsvz8`) is kept as a synced backup, a fallback for unknown slugs, and the store for private case studies
- **Images:** Cloudflare R2 (public bucket), with pre-generated 800/1920px WebP copies
- **Hosting:** Vercel (SPA rewrites in `vercel.json`, serverless functions in `api/`), with Vercel Analytics and Google Analytics

## Getting started

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # site at http://localhost:5174 (fixed port; it must be on Sanity's CORS list)
npm run studio         # Sanity Studio at http://localhost:3333
```

`npm run dev` doesn't serve `api/` routes. To test private-project unlocking locally, use `vercel dev`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `preview` | Vite dev server, production build, preview the build |
| `npm run lint` | ESLint |
| `npm run studio` | Local Sanity Studio |
| `npm run r2:upload -- <file> <key> [...]` | Upload files to R2 (e.g. `npm run r2:upload -- "shot.png" portfolio/whhf/shot.png`) |
| `npm run r2:upload -- --site` | Upload the site images listed in `scripts/r2-upload.js` |
| `npm run r2:upload -- --optimize` | Create any missing resized WebP copies for images in R2 |
| `npm run content:push` | Mirror `content/projects/*.md` into Sanity (backup) |
| `npm run content:pull` | Sanity → repo (initial migration; won't overwrite files without `-- --force`) |

## How content works

**Projects live in the repo**: one Markdown file per project in `content/projects/<slug>.md`. A small Vite plugin (`vite.config.js`) compiles them at build time, so listings and case studies need no network request.

```markdown
---
title: William & Helen Heritage Foundation
slug: whhf                    # URL: /work/whhf (also the file name)
num: '01'                     # ordering on the home page
type: live                    # live | case | other
role: Product Designer & UX Engineer
year: '2026'
url: https://whheritagefoundation.org
headline: A digital home for a legacy of giving.
desc: One or two sentences for the project card.
cover: portfolio/whhf/cover.png           # R2 key
gallery:                                  # R2 keys, in display order
  - portfolio/whhf/gallery/01.png
images:                                   # optional images under each section
  solution: [portfolio/whhf/solution/01.png]
aliases: []                               # optional old slugs that redirect here
private: false                            # true = body lives in Sanity behind /api/unlock
---
## Overview
Markdown…
## Problem
…
## Solution
…
## Impact
…
```

Only the four `## Overview / Problem / Solution / Impact` headings split sections; use `###` or smaller inside a section.

### Adding a project

1. Upload images: `npm run r2:upload -- "cover.png" portfolio/<slug>/cover.png` (resized copies are made automatically).
2. Create `content/projects/<slug>.md` as above and commit. Vercel builds and deploys it.
3. Run `npm run content:push` to update the Sanity backup.

### Sanity's role

- **Backup:** `content:push` mirrors every project (text, R2 image URLs) into Sanity.
- **Fallback:** a `/work/<slug>` that isn't in the repo is looked up in Sanity (`getProject` in `src/utils/projects.js`).
- **Private case studies:** the GitHub repo is public, so a `private: true` project keeps only its card data in the repo. Its body and password live in Sanity and are returned by `api/unlock.js` after a server-side password check.

### Site images

Logos and hero images are served from R2 under `site/`; see `SITE_IMAGES` in `src/utils/assetHelper.js`. Favicons and the social share image stay in `public/` so they're same-origin. The CV PDF is bundled from `src/assets/`.

## Environment variables

See `.env.example`. Only `VITE_*` variables reach the browser. Everything else stays in local scripts or Vercel functions, and must never be prefixed `VITE_`.

## Structure

```
api/unlock.js            Vercel function: password check for private case studies
content/projects/        Project case studies (Markdown + frontmatter): the source of truth
schemaTypes/             Sanity schema
scripts/                 r2-upload.js (R2 uploads + resized copies), content-sync.js (repo <-> Sanity)
src/
  components/            Navbar, Hero, Experience, Projects, AboutSection, Skills, Footer, CVModal, BackToTop
  pages/                 Home, AboutPage, ProjectDetail
  utils/                 Sanity client + config, GROQ queries, project data access, asset URLs
```
