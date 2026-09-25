# Victor Ironali — Portfolio

Portfolio site for Victor Ironali, Senior Product Designer & UX Engineer. Live at [ironali.com](https://ironali.com).

## Stack

- **App:** React 19, Vite 8, React Router 7, Framer Motion, Lucide icons
- **Content:** Sanity CMS (project `9hecsvz8`, dataset `production`)
- **Images:** Cloudflare R2 (public bucket) and the Sanity image CDN
- **Hosting:** Vercel (SPA rewrites in `vercel.json`, serverless functions in `api/`), with Vercel Analytics and Google Analytics

## Getting started

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # site at http://localhost:5173
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

## How content works

**Projects** come from Sanity (`schemaTypes/project.js`). `src/data/projectsData.js` is only used as a fallback when Sanity is unreachable.

Data access lives in `src/utils/projects.js`:

- **Thumbnail:** `imgUrl` (an R2 URL) if set, otherwise the Sanity `img`, resized and served as WebP/AVIF.
- **Gallery:** Sanity *Process Images* if present, otherwise every image in R2 under `portfolio/<r2Folder or slug>/`, listed by `VITE_GALLERY_API_URL`.
- **Private projects** (`isPrivate`): the case-study body and password are never sent to the browser. The password is checked server-side by `api/unlock.js`, which then returns the content.

### Adding a project

1. Upload images to R2 under `portfolio/<slug>/`, e.g. `npm run r2:upload -- "cover.png" portfolio/<slug>/cover.png`.
2. In Sanity Studio, create a Project. Set the slug (lowercase, no spaces), number, type, role, year, description, headline, the four case-study sections and the project URL.
3. Set **Main Image URL (R2)** to the cover's public R2 URL. The gallery picks up everything else in that R2 folder automatically. Set **R2 Gallery Folder** only if the folder name differs from the slug.

### Site images

Logos and hero images are served from R2 under `site/`; see `SITE_IMAGES` in `src/utils/assetHelper.js`. Favicons and the social share image stay in `public/` so they're same-origin. The CV PDF is bundled from `src/assets/`.

## Environment variables

See `.env.example`. Only `VITE_*` variables reach the browser. Everything else stays in local scripts or Vercel functions, and must never be prefixed `VITE_`.

## Structure

```
api/unlock.js            Vercel function: password check for private case studies
schemaTypes/             Sanity schema
scripts/r2-upload.js     R2 upload helper
src/
  components/            Navbar, Hero, Experience, Projects, AboutSection, Skills, Footer, CVModal, BackToTop
  pages/                 Home, AboutPage, ProjectDetail
  utils/                 Sanity client + config, GROQ queries, project data access, asset URLs
  data/projectsData.js   Offline fallback for projects
```
